const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["BASIC", "EDITOR", "ADMIN"],
    default: "BASIC",
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  refreshToken: {
    type: String,
    select: false,
  },

  passwordResetToken: {
    type: String,
    select: false,
  },

  passwordResetExpires: {
    type: Date,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("user", UserSchema);
