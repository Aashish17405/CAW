require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather.js");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Initialize db.json if it doesn't exist
const dbPath = "./db.json";
if (!fs.existsSync(dbPath)) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify({ favorites: [] }, null, 2));
    console.log("Created db.json file");
  } catch (error) {
    console.error("Error creating db.json:", error.message);
  }
}

app.use(cors());
app.use(express.json());
app.use("/weather", weatherRoutes);

// Fallback
app.use((req, res) => res.status(404).send("Not found"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
