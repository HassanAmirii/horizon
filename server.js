require("dotenv");
const mongoose = require("mongoose");
const app = require("./middleware/app");
const dbURI = process.env.MONGODB_URI;
const jwt = require("jsonwebtoken");
const task = require("./models/tasks");

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("succesfully connected to mongodb");
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`horizon is listening on localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("database cconnection error", err);
    process.exit(1);
  });
