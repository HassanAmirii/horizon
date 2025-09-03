require("dotenv").config();
const bcrpt = require("bcrypt");
const mongoose = require("mongoose");
const app = require("./middleware/app");
const dbURI = process.env.MONGODB_URI;
const jwt = require("jsonwebtoken");
const Task = require("./models/tasks");
const User = require("./models/user");
const userAuth = require("./middleware/userAuth");
const adminAuth = require("./middleware/adminAuth");

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("succesfully connected to mongodb");
    const port = process.env.PORT || 3000;

    // register route
    app.post("/register", async (req, res) => {
      try {
        const { username, email, password, isAdmin } = req.body;
        const newUser = new User({ username, email, password, isAdmin });
        await newUser.save();
        res.status(201).json({
          message: "you have been succesfully registered",
          user: newUser,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });

    // login route with a signed token
    app.post("/login", async (req, res) => {
      const { username, password } = req.body;
      const user = await User.find(req.body.username);
      if (!user && !(await bcrpt.compare(User.password, password))) {
        return res.status(401).json({ error: "invalid credentials" });
      }

      try {
        res.status(200).json({
          message: `you have  succesfully login ${username}`,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }

      const payload = {
        id: user._id,
        username: user.username,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      res.json({ token });
    });

    // horizon listener
    app.listen(port, () => {
      console.log(`horizon is listening on localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("database cconnection error", err);
    process.exit(1);
  });
