function logger(req, res, next) {
  console.log("next ....");
  next();
}

module.exports = logger;
