const Notification =
  require("./notification.model.js");

async function createNotification(data) {
  const {
    userId,
    monitorId = null,
    incidentId = null,
    type,
    title,
    message
  } = data;

  return Notification.create({
    userId,
    monitorId,
    incidentId,
    type,
    title,
    message
  });
}

async function createIncidentNotification({
  userId,
  monitorId,
  incidentId,
  type,
  title,
  message
}) {
  try {
    const notification =
      await Notification.create({
        userId,
        monitorId,
        incidentId,
        type,
        title,
        message,
        isRead: false,
        readAt: null
      });

    return {
      notification,
      created: true
    };
  } catch (error) {
    if (error.code === 11000) {
      const notification =
        await Notification.findOne({
          incidentId,
          type
        });

      return {
        notification,
        created: false
      };
    }

    throw error;
  }
}

async function getNotifications(userId) {
  return Notification.find({
    userId
  })
    .populate(
      "monitorId",
      "name url status"
    )
    .sort({
      createdAt: -1
    })
    .limit(50);
}

async function getUnreadCount(userId) {
  return Notification.countDocuments({
    userId,
    isRead: false
  });
}

async function markAsRead(
  userId,
  notificationId
) {
  const notification =
    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId
      },
      {
        isRead: true,
        readAt: new Date()
      },
      {
        returnDocument: "after"
      }
    );

  if (!notification) {
    const error =
      new Error("Notification not found");

    error.statusCode = 404;

    throw error;
  }

  return notification;
}

async function markAllAsRead(userId) {
  const now = new Date();

  return Notification.updateMany(
    {
      userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: now
      }
    }
  );
}

module.exports = {
  createNotification,
  createIncidentNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};