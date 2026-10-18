const express = require("express");

const userController =
  require("./user.controller.js");

const {
  requireAuth
} = require("../../middleware/auth.middleware.js");

const router = express.Router();

router.use(requireAuth);

router.get(
  "/me/preferences",
  userController.getPreferences
);

router.patch(
  "/me/preferences",
  userController.updatePreferences
);

module.exports = router;