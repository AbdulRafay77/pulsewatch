const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true
  },

  success: {
    type: Boolean,
    required: true
  },

  statusCode: {
    type: Number,
    default: null
  },

  responseTime: {
    type: Number,
    required: true
  },

  errorMessage: {
    type: String,
    default: null
  },

  checkedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Check", checkSchema);