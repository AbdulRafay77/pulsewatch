const monitorService = require("./monitor.service.js");

async function createMonitor(req, res) {
  try {
    const monitor = await monitorService.createMonitor(req.body);

    res.status(201).json(monitor);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create monitor"
    });
  }
}

async function getMonitors(req, res) {
  try {
    const monitors = await monitorService.getMonitors();

    res.json(monitors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch monitors"
    });
  }
}

module.exports = {
  createMonitor,
  getMonitors
};