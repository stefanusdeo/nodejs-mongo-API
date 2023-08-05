const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true },
      phone: { type: String, required: true, minLength: 10, maxLength: 15 },
      isGold: { type: Boolean, default: false },
    }),
  },
  movie: {
    type: new mongoose.Schema({
      title: { type: String, required: true },
      dailyRentalRate: { type: Number, min: 0 },
    }),
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturn: {
    type: Date,
  },
  rentalFee: {
    type: Date,
    min: 0,
  },
});
const Rental = new mongoose.model("Rental", rentalSchema);

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
