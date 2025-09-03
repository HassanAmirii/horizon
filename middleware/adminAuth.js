require("dotenv").config();
const jwt = require("jsonwebtoken");
const adminAuth = (res, req, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "access denied, no authorization" });
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "could not find token in auth header" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin === true) {
      return res.status(401).json({ message: "access denied, not an admin" });
    }
    req.payload = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = adminAuth;
