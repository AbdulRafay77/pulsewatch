const Incident = require("./incident.model");
const Monitor = require("../monitors/monitor.model.js");

async function createIncident(monitor, result, checkedAt) {
  let reason = "Monitor check failed";

  if (result.statusCode) {
    reason = `HTTP ${result.statusCode}`;
  } else if (result.errorMessage) {
    reason = result.errorMessage;
  }

  try {
    return await Incident.findOneAndUpdate(
      {
        monitorId: monitor._id,
        status: "active"
      },
      {
        $setOnInsert: {
          monitorId: monitor._id,
          status: "active",
          startedAt: checkedAt,
          reason
        }
      },
      {
        returnDocument: "after",
        upsert: true
      }
    );
  } catch (error) {
    if (error.code === 11000) {
      return Incident.findOne({
        monitorId: monitor._id,
        status: "active"
      });
    }

    throw error;
  }
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

async function getIncidents(userId) {
  const monitors = await Monitor.find({
    userId
  }).select("_id");

  const monitorIds = monitors.map(
    (monitor) => monitor._id
  );

  return Incident.find({
    monitorId: {
      $in: monitorIds
    }
  })
    .populate("monitorId", "name url status")
    .sort({ startedAt: -1 });
}

module.exports = {
  createIncident,
  resolveIncident,
  getIncidents
};