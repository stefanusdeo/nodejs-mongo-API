const mongoose = require("mongoose");
const winston = require("winston");
require("dotenv").config();

module.exports = function () {
  const db = process.env.DB_TEST;
  mongoose.connect(db).then(() => winston.info(`connected mongo ${db}...`));
};
