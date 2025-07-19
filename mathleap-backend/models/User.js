const mongoose = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: { // Changed from username to name to match frontend
      type: String,
      required: true,
      minlength: [3, "Must be at least 3 characters long"],
      maxlength: [30, "Must be no more than 30 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Must be a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Must be at least 6 characters long"], // Adjusted for simplicity
    },
    biography: {
      type: String,
      default: "",
      maxLength: [250, "Must be at most 250 characters long"],
    },
    avatar: {
        type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema); // Changed model name to singular "User" for convention
