const Monitor = require("../monitors/monitor.model");
const Check = require("./check.model");
const checkWithRetries = require("../../services/checkWithRetries.js");
const incidentService = require("../incidents/incident.service.js");

const notificationService =
  require("../../features/notifications/notification.service.js");

const alertEmailService =
  require("../../features/notifications/alertEmail.service.js");


async function runMonitorCheck(monitorId) {
  const monitor = await Monitor.findById(monitorId);

  if (!monitor) {
    const error = new Error("Monitor not found");
    error.statusCode = 404;
    throw error;
  }

  if (monitor.isPaused) {
    const error = new Error("Monitor is paused");
    error.statusCode = 409;
    throw error;
  }

  const previousStatus = monitor.status;

  const result = await checkWithRetries(monitor);

  const checkedAt = new Date();

  const check = await Check.create({
    monitorId: monitor._id,
    success: result.success,
    statusCode: result.statusCode,
    responseTime: result.responseTime,
    errorMessage: result.errorMessage,
    checkedAt
  });

  const newStatus =
    result.success ? "up" : "down";


  // --------------------------------
  // TRANSITION: UP/UNKNOWN -> DOWN
  // --------------------------------

  if (
    newStatus === "down" &&
    previousStatus !== "down"
  ) {
    const incident =
      await incidentService.createIncident(
        monitor,
        result,
        check.checkedAt
      );

    if (incident) {
      const message =
        result.errorMessage ||
        (
          result.statusCode
            ? `${monitor.name} returned HTTP ${result.statusCode}.`
            : `${monitor.name} is currently unreachable.`
        );

      const { created } =
        await notificationService
          .createIncidentNotification({
            userId: monitor.userId,
            monitorId: monitor._id,
            incidentId: incident._id,

            type: "monitor_down",

            title:
              `${monitor.name} is down`,

            message
          });

      if (created) {
        alertEmailService
          .sendIncidentAlertEmail({
            userId: monitor.userId,
            monitor,
            incident,
            type: "monitor_down",
            message
          })
          .catch((error) => {
            console.error(
              "Failed to send DOWN alert email:",
              error.message
            );
          });
      }
    }
  }


  // --------------------------------
  // TRANSITION: DOWN -> UP
  // --------------------------------

  if (
    newStatus === "up" &&
    previousStatus === "down"
  ) {
    const incident =
      await incidentService.resolveIncident(
        monitor._id,
        check.checkedAt
      );

    if (incident) {
      const message =
        `${monitor.name} is responding normally again.`;

      const { created } =
        await notificationService
          .createIncidentNotification({
            userId: monitor.userId,
            monitorId: monitor._id,
            incidentId: incident._id,

            type: "monitor_recovered",

            title:
              `${monitor.name} recovered`,

            message
          });

      if (created) {
        alertEmailService
          .sendIncidentAlertEmail({
            userId: monitor.userId,
            monitor,
            incident,
            type: "monitor_recovered",
            message
          })
          .catch((error) => {
            console.error(
              "Failed to send RECOVERY alert email:",
              error.message
            );
          });
      }
    }
  }


  monitor.status = newStatus;
  monitor.lastCheckedAt = checkedAt;

  await monitor.save();

  return {
    monitor,
    check
  };
}


async function getChecksByMonitor(
  userId,
  monitorId
) {
  const monitor = await Monitor.findOne({
    _id: monitorId,
    userId
  });

  if (!monitor) {
    const error =
      new Error("Monitor not found");

    error.statusCode = 404;

    throw error;
  }

  return Check.find({
    monitorId
  })
    .sort({
      checkedAt: -1
    })
    .limit(50);
}


async function runUserMonitorCheck(
  userId,
  monitorId
) {
  const monitor = await Monitor.findOne({
    _id: monitorId,
    userId
  });

  if (!monitor) {
    const error =
      new Error("Monitor not found");

    error.statusCode = 404;

    throw error;
  }

  return runMonitorCheck(monitorId);
}


module.exports = {
  runMonitorCheck,
  getChecksByMonitor,
  runUserMonitorCheck
};