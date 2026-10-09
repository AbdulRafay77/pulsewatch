const monitorService = require("./monitor.service.js");

async function createMonitor(req, res) {
  try {
    console.log("CONTROLLER userId:", req.user._id);
    console.log("CONTROLLER body:", req.body);

    const monitor = await monitorService.createMonitor(
      req.user._id,
      req.body
    );

    res.status(201).json(monitor);
  } catch (error) {
    console.error("Create monitor error:", error);

    res.status(500).json({
      message: "Failed to create monitor"
    });
  }
}

async function getMonitors(req, res) {
  try {
    console.log("Logged-in user ID:", req.user._id);

    const monitors = await monitorService.getMonitors(
      req.user._id
    );

    res.status(200).json(monitors);
  } catch (error) {
    console.error("Get monitors error:", error);

    res.status(500).json({
      message: "Failed to fetch monitors"
    });
  }
}

async function getMonitorById(req, res) {
  try {
    const monitor = await monitorService.getMonitorById(
      req.user._id,
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
    const allowedFields = [
      "name",
      "url",
      "intervalMinutes",
      "timeoutMs",
      "isPaused"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const monitor = await monitorService.updateMonitor(
      req.user._id,
      req.params.id,
      updates
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

async function deleteMonitor(req, res) {
  try {
    const monitor = await monitorService.deleteMonitor(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      message: "Monitor deleted successfully",
      monitorId: monitor._id
    });
  } catch (error) {
    console.error("Delete monitor error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to delete monitor"
    });
  }
}

module.exports = {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor
};