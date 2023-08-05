const mongoose = require("mongoose");
const { genresSchema } = require("../models/Genres");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true,
    trim: true,
  },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  genre: {
    type: genresSchema,
    required: true,
  },
});

const Movie = new mongoose.model("Movie", movieSchema);

exports.Movie = Movie;
exports.schemaMovie = movieSchema;
