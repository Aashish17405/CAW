const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const weatherRoutes = require("./routes/weather.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(cors());
app.use(express.json());
app.use("/weather", weatherRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong. Please try again later.",
  });
});

app.use((req, res) => res.status(404).send("Not found"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
