const incidentService = require("./incident.service");

async function getIncidents(req, res) {
  try {
    const incidents = await incidentService.getIncidents();

    res.status(200).json(incidents);
  } catch (error) {
    console.error("Get incidents error:", error);

    res.status(500).json({
      message: "Failed to fetch incidents"
    });
  }
}

module.exports = {
  getIncidents
};