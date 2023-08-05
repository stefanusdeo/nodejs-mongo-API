const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Movie } = require("../models/Movie");
const { Genres } = require("../models/Genres");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const validation = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    genreId: Joi.objectId().required(),
  });

  return schema.validate(body);
};

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const movies = await Movie.find().short("name");
    return res.send(movies);
  })
);

router.get("/:id", async (req, res) => {
  const findData = await Movie.findById({ _id: req.params.id });
  if (!findData) return res.status(404).send({ message: "Not Found!" });
  res.send({
    message: "Success",
    data: findData,
  });
});

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const resValidation = validation(req.body);
    if (resValidation.error)
      return res
        .status(400)
        .send({ message: "Bad Request", detail: resValidation.error.details });

    const genre = await Genres.findById(req.body.genreId);

    if (!genre) return res.status(404).send({ message: "Not Found!" });

    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send({ message: "Success" });
  })
);

module.exports = router;
