const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const authJwt = (req, res, next) => {
  let bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(403).send({ message: "No token provided!" });
  }

  token = bearerToken.split(' ')[1];
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  });
};

module.exports = authJwt;

