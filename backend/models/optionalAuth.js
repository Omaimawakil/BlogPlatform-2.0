const jwt = require("jsonwebtoken");

// Attaches req.user if a valid token is sent, otherwise continues as anonymous
module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      req.user = undefined;
    }
  }
  next();
};