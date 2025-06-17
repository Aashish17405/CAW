const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const weatherRoutes = require("./routes/weather.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use("/weather", weatherRoutes);

// Fallback
app.use((req, res) => res.status(404).send("Not found"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
