require("dotenv").config();
const jwt = require("jsonwebtoken");
const auth = (res, req, next) => {
  const authHeader = req.header["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "access denied, no authorization" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
