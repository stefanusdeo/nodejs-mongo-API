const winston = require("winston");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log(ex.message);
    winston.log("error", ex.message);
  });

  // create logging with witson
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
};
