const express = require("express");
const authController = require("./auth.controller.js");
const { requireAuth } = require("../../middleware/auth.middleware.js");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", requireAuth, authController.getMe);

module.exports = router;