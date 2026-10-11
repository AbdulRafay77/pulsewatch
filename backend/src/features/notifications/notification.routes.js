const express = require("express");

const notificationController =
  require("./notification.controller.js");

const {
  requireAuth
} = require("../../middleware/auth.middleware.js");

const router = express.Router();

router.use(requireAuth);

router.get(
  "/",
  notificationController.getNotifications
);

router.get(
  "/unread-count",
  notificationController.getUnreadCount
);

router.patch(
  "/read-all",
  notificationController.markAllAsRead
);

router.patch(
  "/:id/read",
  notificationController.markAsRead
);

module.exports = router;