require('dotenv').config();
const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather.js");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/weather", weatherRoutes);

// Fallback
app.use((req, res) => res.status(404).send("Not found"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
