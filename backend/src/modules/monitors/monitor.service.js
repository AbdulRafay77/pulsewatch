const Monitor = require("./monitor.model");
const Check = require("../checks/check.model.js");
const Incident = require("../incidents/incident.model.js");
const validateMonitorUrl = require("./monitorUrl.Validator.js");

async function createMonitor(userId, data) {
  const validatedUrl = validateMonitorUrl(data.url);

  return Monitor.create({
    ...data,
    url: validatedUrl,
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
  const monitor = await Monitor.findOne({
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
  const safeUpdates = { ...updates };

  if (Object.prototype.hasOwnProperty.call(safeUpdates, "url")) {
    safeUpdates.url = validateMonitorUrl(safeUpdates.url);
  }

  const monitor = await Monitor.findOneAndUpdate(
    {
      _id: monitorId,
      userId
    },
    safeUpdates,
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