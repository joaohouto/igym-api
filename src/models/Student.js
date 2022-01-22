const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  birth: {
    type: String,
  },

  cpf: {
    type: String,
  },

  address: {
    type: String,
  },

  groups: [
    {
      group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "group",
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
        required: true,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("student", StudentSchema);
