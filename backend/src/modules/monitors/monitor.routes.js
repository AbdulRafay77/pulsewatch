const express = require("express");
const monitorController = require("./monitor.controller.js");

const router = express.Router();

router.post('/', monitorController.createMonitor);
router.get('/', monitorController.getMonitors);

module.exports = router;