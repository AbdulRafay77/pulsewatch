const Monitor = require("../monitors/monitor.model");
const Check = require("./check.model");
const checkMonitor = require("../../services/checkMonitor");
const incidentService = require("../incidents/incident.service.js");

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

  const result = await checkMonitor(monitor);

  const checkedAt = new Date();

  const check = await Check.create({
    monitorId: monitor._id,
    success: result.success,
    statusCode: result.statusCode,
    responseTime: result.responseTime,
    errorMessage: result.errorMessage,
    checkedAt
  });

  const newStatus = result.success ? "up" : "down";

  if (
    newStatus === "down" &&
    previousStatus !== "down"
  ) {
    await incidentService.createIncident(
      monitor,
      result,
      checkedAt
    );
  }

  if (
    newStatus === "up" &&
    previousStatus === "down"
  ) {
    await incidentService.resolveIncident(
      monitor._id,
      checkedAt
    );
  }

  monitor.status = newStatus;
  monitor.lastCheckedAt = checkedAt;

  await monitor.save();

  return {
    monitor,
    check
  };
}

async function getChecksByMonitor(monitorId) {
  return Check.find({
    monitorId
  })
    .sort({ checkedAt: -1 })
    .limit(50);
}

module.exports = {
  runMonitorCheck,
  getChecksByMonitor
};