const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Movie } = require("../models/Movie");
const { Customer } = require("../models/Customers");
const { Rental } = require("../models/Rental");

const validation = (body) => {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });

  return schema.validate(body);
};

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  return res.send(rental);
});

router.get("/:id", async (req, res) => {
  const findData = await Rental.findById({ _id: req.params.id });
  if (!findData) return res.status(404).send({ message: "Not Found!" });
  res.send({
    message: "Success",
    data: findData,
  });
});

router.post("/", async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const customer = await Customer.findById(req.body.customerId);
  const movie = await Movie.findById(req.body.movieId);

  if (!movie || !customer)
    return res
      .status(404)
      .send({ message: "Data Customer or Movie Not Found!" });

  if (movie.numberInStock === 0)
    return res.status(404).send({ message: "movie not in stock." });

  let rental = new Rental({
    movie: {
      title: movie.title,
      _id: movie._id,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      name: customer.name,
      _id: customer._id,
      phone: customer.phone,
    },
  });

  try {
    // transaction
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const result = await rental.save();
      movie.numberInStock--;
      movie.save();
      res.send(result);
    });

    await session.endSession();
  } catch (error) {
    await session.endSession();
  }
});

router.put("/:id", async (req, res) => {
  const resValidation = validation(req.body);
  if (resValidation.error)
    return res
      .status(400)
      .send({ message: "Bad Request", detail: resValidation.error.details });

  const customer = await Customer.findById(req.body.customerId);
  const movie = await Movie.findById(req.body.movieId);

  if (!movie || !customer)
    return res
      .status(404)
      .send({ message: "Data Customer or Movie Not Found!" });

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      movie: {
        title: movie.title,
        _id: movie._id,
        dailyRentalRate: movie.dailyRentalRate,
      },
      customer: {
        name: customer.name,
        _id: customer._id,
        phone: customer.phone,
      },
    },
    {
      new: true,
    }
  );

  if (!rental) return res.status(404).send({ message: "Not Found!" });

  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const data = await Rental.findByIdAndRemove(req.params.id);
  if (!data) {
    res.status(404).send({ message: "data not found!" });
    return;
  }

  res.send(data);
});

module.exports = router;
