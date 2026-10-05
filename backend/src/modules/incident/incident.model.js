const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active"
    },

    startedAt: {
      type: Date,
      required: true
    },

    resolvedAt: {
      type: Date,
      default: null
    },

    durationMs: {
      type: Number,
      default: null
    },

    reason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Incident", incidentSchema);