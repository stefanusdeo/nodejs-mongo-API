const jwt = require("jsonwebtoken");
require("dotenv").config();
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ message: "access denied!" });

  try {
    const decoded = jwt.verify(token, process.env.SECRETTOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: "invalid Token" });
  }
}

module.exports = auth;
