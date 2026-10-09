const Monitor = require("./monitor.model");
const Check = require("../checks/check.model.js");
const Incident = require("../incidents/incident.model.js");

async function createMonitor(userId, data) {
  console.log("SERVICE userId:", userId);
  console.log("SERVICE data:", data);

  return Monitor.create({
    ...data,
    userId
  });
}

async function getMonitors(userId) {
  return Monitor.find({
    userId
  }).sort({ 
    createdAt: -1
   });
}

async function getMonitorById(userId, monitorId) {
  const monitor = await Monitor.fineOne({
    _id: monitorId,
    userId
  });

  if (!monitor) {
    const error = new Error("Monitor not found");
    error.statusCode = 404;
    throw error;
  }

  return monitor;
}

async function updateMonitor(userId, monitorId, updates) {
  const monitor = await Monitor.findOneAndUpdate(
    {
      _id: monitorId,
      userId
    },
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

async function deleteMonitor(userId, monitorId) {
  const monitor = await Monitor.findOne({
    _id: monitorId,
    userId
  });

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

  await Monitor.deleteOne({
    _id: monitor._id,
    userId
  });

  return monitor;
}

module.exports = {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor
};