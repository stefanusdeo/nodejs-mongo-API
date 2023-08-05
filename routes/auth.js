const express = require("express");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

const { User } = require("../models/User");

const validation = (body) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
};

router.post("/", async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "invalid email and password" });

  let authValidation = await bcrypt.compare(req.body.password, user.password);
  if (!authValidation)
    return res.status(400).send({ message: "invalid email and password" });

  const token = jwt.sign(
    _.pick(user, ["name", "_id", "email"]),
    process.env.SECRETTOKEN
  );
  res.send({
    data: _.pick(user, ["_id", "name", "email"]),
    token,
  });
});

module.exports = router;
