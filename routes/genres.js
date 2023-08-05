const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Genres } = require("../models/Genres");
const validationObjectId = require("../middleware/validationObjectId");
const auth = require("../middleware/auth");

const validation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(body);
};

router.get("/", async (req, res) => {
  const genres = await Genres.find().sort("name");
  return res.send(genres);
});

router.get("/:id", validationObjectId, async (req, res) => {
  const findData = await Genres.findById({ _id: req.params.id });
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

  let genres = new Genres(payload);
  genres.save();
  res.send({ message: "Success" });
});

router.put("/:id", validationObjectId, async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const genre = await Genres.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre) return res.status(404).send({ message: "Not Found!" });

  res.send(genre);
});

router.delete("/:id", validationObjectId, async (req, res) => {
  const data = await Genres.findByIdAndRemove(req.params.id);
  if (!data) {
    res.status(404).send({ message: "data not found!" });
    return;
  }

  res.send(data);
});

module.exports = router;
