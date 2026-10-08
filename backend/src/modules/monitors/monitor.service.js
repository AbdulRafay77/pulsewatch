const Monitor = require("./monitor.model");
const Check = require("../checks/check.model.js");
const Incident = require("../incidents/incident.model.js");

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

async function deleteMonitor(monitorId) {
  const monitor = await Monitor.findById(monitorId);

  if (!monitor) {
    const error = new Error("Monitor not found");
    error.statusCode = 404;
    throw error;
  }

  await Check.deleteMany({
    monitorId: monitor._id
  });

  await Incident.deleteMany({
    monitorId: monitor._id
  });

  await Monitor.findByIdAndDelete(monitor._id);

  return monitor;
}

module.exports = {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor
};