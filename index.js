require("dotenv").config();
const express = require("express");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/logging")();
require("./startup/db")();
require("./startup/middlewareAdded")(app);

// log
const logger = require("./middleware/logger");

// custom middleware
app.use(logger);

app.get("/", (req, res) => {
  res.send({
    message: "hallo world...",
  });
});

require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening in port ${port}`));
module.exports = server;
