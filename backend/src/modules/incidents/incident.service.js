const Incident = require("./incident.model");

async function createIncident(monitor, result, checkedAt) {
  const existingIncident = await Incident.findOne({
    monitorId: monitor._id,
    status: "active"
  });

  if (existingIncident) {
    return existingIncident;
  }

  let reason = "Monitor check failed";

  if (result.statusCode) {
    reason = `HTTP ${result.statusCode}`;
  } else if (result.errorMessage) {
    reason = result.errorMessage;
  }

  return Incident.create({
    monitorId: monitor._id,
    status: "active",
    startedAt: checkedAt,
    reason
  });
}

async function resolveIncident(monitorId, checkedAt) {
  const incident = await Incident.findOne({
    monitorId,
    status: "active"
  });

  if (!incident) {
    return null;
  }

  incident.status = "resolved";
  incident.resolvedAt = checkedAt;
  incident.durationMs =
    checkedAt.getTime() - incident.startedAt.getTime();

  await incident.save();

  return incident;
}

async function getIncidents() {
  return Incident.find()
    .populate("monitorId", "name url status")
    .sort({ startedAt: -1 });
}

module.exports = {
  createIncident,
  resolveIncident,
  getIncidents
};