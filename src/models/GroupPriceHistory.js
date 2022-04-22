const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  deadlineDay: {
    type: Number,
    required: true,
  },

  monthReference: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("group", GroupSchema);
