const express = require("express");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const router = express.Router();

const { User } = require("../models/User");
const auth = require("../middleware/auth");

const validation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
};

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  return res.send(user);
});

router.post("/", async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const checkData = await User.findOne({ email: req.body.email });
  if (checkData) return res.status(400).send({ message: "email registered!" });

  let user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

module.exports = router;
