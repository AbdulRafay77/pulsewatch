const express = require("express");
const incidentController = require("./incident.controller");
const {
  requireAuth
} = require("../../middleware/auth.middleware.js");

const router = express.Router();

router.use(requireAuth);

router.get("/", incidentController.getIncidents);

module.exports = router;