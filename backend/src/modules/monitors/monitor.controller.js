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

    res.status(200).json(monitors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch monitors"
    });
  }
}

async function getMonitorById(req, res) {
  try {
    const monitor = await monitorService.getMonitorById(
      req.params.id
    );

    res.status(200).json(monitor);
  } catch (error) {
    console.error("Get monitor error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to fetch monitor"
    });
  }
}

async function updateMonitor(req, res) {
  try {
    const monitor = await monitorService.updateMonitor(
      req.params.id,
      req.body
    );

    res.status(200).json(monitor);
  } catch (error) {
    console.error("Update monitor error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to update monitor"
    });
  }
}

module.exports = {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor
};