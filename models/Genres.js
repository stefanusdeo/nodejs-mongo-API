const mongoose = require("mongoose");
const genresSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true, maxLength: 255 },
});

const Genres = new mongoose.model("Genres", genresSchema);

exports.Genres = Genres;
exports.genresSchema = genresSchema;
