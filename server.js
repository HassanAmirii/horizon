require("dotenv").config();
const bcrypt = require("bcrypt");
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

      try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = {
          id: user._id,
          username: user.username,
          admin: user.isAdmin,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.status(200).json({
          message: "User logged in successfully",
          token: token,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "An internal server error occurred",
        });
      }
    });

    app.post("/createTask", userAuth, async (req, res) => {
      try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description, owner: req.payload.id });
        await newTask.save();

        res
          .status(201)
          .json({ message: "new task created successfully", task: newTask });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    app.get("/getTask", userAuth, async (req, res) => {
      try {
        const myTasks = await Task.find({ owner: req.payload.id });
        if (myTasks === 0) {
          return res
            .status(204)
            .json({ message: "no data found, please create a new task" });
        }
        res.status(200).json({ message: "succesful", tasks: myTasks });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    //protected admin route: GET ALL USER PROFILE
    app.get("/user", adminAuth, async (req, res) => {
      try {
        const users = await User.find({});
        if (!users) {
          return res
            .status(404)
            .json({ message: "no user profile in database" });
        }
        res
          .status(200)
          .json({ message: "users succesfully retrieved ", users: users });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
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
