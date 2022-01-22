const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },

  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("payment", PaymentSchema);
