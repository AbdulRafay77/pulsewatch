const notificationService =
  require("./notification.service.js");

async function getNotifications(req, res) {
  try {
    const notifications =
      await notificationService.getNotifications(
        req.user._id
      );

    res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
}

async function getUnreadCount(req, res) {
  try {
    const count =
      await notificationService.getUnreadCount(
        req.user._id
      );

    res.status(200).json({
      count
    });
  } catch (error) {
    console.error(
      "Get unread count error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch unread count"
    });
  }
}

async function markAsRead(req, res) {
  try {
    const notification =
      await notificationService.markAsRead(
        req.user._id,
        req.params.id
      );

    res.status(200).json(notification);
  } catch (error) {
    console.error(
      "Mark notification error:",
      error
    );

    res
      .status(error.statusCode || 500)
      .json({
        message: error.statusCode
          ? error.message
          : "Failed to update notification"
      });
  }
}

async function markAllAsRead(req, res) {
  try {
    const result =
      await notificationService.markAllAsRead(
        req.user._id
      );

    res.status(200).json({
      message:
        "Notifications marked as read",
      modifiedCount:
        result.modifiedCount
    });
  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update notifications"
    });
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};