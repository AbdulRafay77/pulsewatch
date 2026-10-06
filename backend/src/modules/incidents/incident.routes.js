const express = require("express");
const incidentController = require("./incident.controller");

const router = express.Router();

router.get("/", incidentController.getIncidents);

module.exports = router;