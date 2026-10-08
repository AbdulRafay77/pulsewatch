const express = require("express");
const monitorController = require("./monitor.controller.js");
const checkController = require("../checks/check.controller.js");

const router = express.Router();

router.post('/', monitorController.createMonitor);
router.get('/', monitorController.getMonitors);
router.post("/:id/check", checkController.runMonitorCheck);
router.get("/:id/checks", checkController.getChecksByMonitor);
router.get("/:id", monitorController.getMonitorById);
router.patch("/:id", monitorController.updateMonitor);
router.delete("/:id", monitorController.deleteMonitor);

module.exports = router;