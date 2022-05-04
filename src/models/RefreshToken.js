const mongoose = require("mongoose");

const RefreshToken = mongoose.Schema({
  expiresIn: {
    type: Number,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("refresh_token", RefreshToken);
