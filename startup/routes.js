// router
const course = require("../routes/course");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movie = require("../routes/movie");
const rental = require("../routes/rental");
const user = require("../routes/user");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/course", course);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movie", movie);
  app.use("/api/rental", rental);
  app.use("/api/user", user);
  app.use("/api/auth", auth);

  // error handling exception
  app.use(error);
};
