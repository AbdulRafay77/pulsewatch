const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    },

    intervalMinutes: {
      type: Number,
      default: 5
    },

    timeoutMs: {
      type: Number,
      default: 5000
    },

    status: {
      type: String,
      enum: ["unknown", "up", "down"],
      default: "unknown"
    },

    isPaused: {
      type: Boolean,
      default: false
    },

    lastCheckedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Monitor", monitorSchema);