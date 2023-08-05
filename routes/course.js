const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Course } = require("../models/Course");
const auth = require("../middleware/auth");

const validation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(body);
};

router.get("/", async (req, res) => {
  const course = await Course.find().sort("name");
  return res.send(course);
});

router.get("/:id", async (req, res) => {
  const findData = await Course.findById({ _id: req.params.id });
  if (!findData) return res.status(404).send({ message: "Not Found!" });
  res.send({
    message: "Success",
    data: findData,
  });
});

router.post("/", auth, (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const payload = {
    name: req.body.name,
  };

  let course = new Course(payload);
  course.save();
  res.send({ message: "Success" });
});

router.put("/:id", async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!course) return res.status(404).send({ message: "Not Found!" });

  res.send(course);
});

router.delete("/:id", async (req, res) => {
  const data = await Course.findByIdAndRemove(req.params.id);
  if (!data) {
    res.status(404).send({ message: "data not found!" });
    return;
  }

  res.send(data);
});

module.exports = router;
