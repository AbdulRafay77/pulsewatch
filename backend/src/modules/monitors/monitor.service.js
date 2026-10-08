const Monitor = require("./monitor.model");

async function createMonitor(data) {
  return Monitor.create(data);
}

async function getMonitors() {
  return Monitor.find().sort({ createdAt: -1 });
}

async function getMonitorById(monitorId) {
  const monitor = await Monitor.findById(monitorId);

  if (!monitor) {
    const error = new Error("Monitor not found");
    error.statusCode = 404;
    throw error;
  }

  return monitor;
}

async function updateMonitor(monitorId, updates) {
  const monitor = await Monitor.findByIdAndUpdate(
    monitorId,
    updates,
    {
      returnDocument: "after",
      runValidators: true
    }
  );

  if (!monitor) {
    const error = new Error("Monitor not found");
    error.statusCode = 404;
    throw error;
  }

  return monitor;
}

module.exports = {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor
};