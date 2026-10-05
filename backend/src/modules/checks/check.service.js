const Monitor = require("../monitors/monitor.model");
const Check = require("./check.model");
const checkMonitor = require("../../services/checkMonitor");

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

  monitor.status = result.success ? "up" : "down";
  monitor.lastCheckedAt = checkedAt;

  await monitor.save();

  return {
    monitor,
    check
  };
}

module.exports = {
  runMonitorCheck
};