const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monitor",
        default: null
      },

      incidentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incident",
        default: null
      },

      type: {
        type: String,
        enum: [
          "monitor_down",
          "monitor_recovered"
        ],
        required: true
      },

      title: {
        type: String,
        required: true,
        trim: true
      },

      message: {
        type: String,
        required: true,
        trim: true
      },

      isRead: {
        type: Boolean,
        default: false
      },

      readAt: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );

notificationSchema.index({
  userId: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);