require("dotenv");
const mongoose = require("mongoose");
const app = require("./middleware/app");
const dbURI = process.env.MONGODB_URI;
const jwt = require("jsonwebtoken");
const Task = require("./models/tasks");
const User = require("./models/user");

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("succesfully connected to mongodb");
    const port = process.env.PORT || 3000;

    app.post("/register", async (req, res) => {
      const { username, email, passoword } = req.body;

      try {
        const newUser = new User(username, email, passoword);
        res.status(201).json({
          message: "you have been succesfully registered",
          user: newUser,
        });
        await newUser.save();
      } catch (error) {
        res.status(404).json({
          message: error.message,
        });
      }
    });

    app.listen(port, () => {
      console.log(`horizon is listening on localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("database cconnection error", err);
    process.exit(1);
  });
