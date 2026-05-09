const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const noteRoutes = require("./routes/noteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", noteRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Employee Notes Dashboard Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});