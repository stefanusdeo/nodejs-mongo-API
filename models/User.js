const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
require("dotenv").config();
const userSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true, maxLength: 255 },
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
    maxLength: 1024,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    process.env.SECRETTOKEN
  );
  return token;
};
const User = new mongoose.model("User", userSchema);

exports.User = User;
exports.userSchema = userSchema;
