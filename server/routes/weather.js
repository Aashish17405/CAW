const express = require("express");
const fs = require("fs");
const axios = require("axios");

const router = express.Router();
const favoritesFile = "./db.json";
const API_KEY = process.env.API_KEY;
// const API_KEY = "78ed8eb3a3019fb3af547bf878796675";

// Mock data
const mockCurrent = (city) => ({
  city,
  temperature: `${Math.floor(Math.random() * 10) + 25}°C`,
  condition: "Sunny",
});

const mockForecast = (city) => ({
  city,
  forecast: Array.from({ length: 5 }, (_, i) => ({
    day: `Day ${i + 1}`,
    condition: "Partly Cloudy",
    high: `${30 + i}°C`,
    low: `${20 + i}°C`,
  })),
});

// Input validation middleware
const validateCityInput = (req, res, next) => {
  const city = req.params.city || req.body.city;

  if (!city) {
    return res.status(400).json({
      error: "Missing city parameter",
      message: "Please provide a city name",
    });
  }

  if (typeof city !== "string") {
    return res.status(400).json({
      error: "Invalid city parameter",
      message: "City name must be a string",
    });
  }

  const trimmedCity = city.trim();

  if (trimmedCity.length === 0) {
    return res.status(400).json({
      error: "Empty city name",
      message: "Please provide a valid city name",
    });
  }

  if (trimmedCity.length > 100) {
    return res.status(400).json({
      error: "City name too long",
      message: "City name must be less than 100 characters",
    });
  }

  // Sanitize city name - only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedCity)) {
    return res.status(400).json({
      error: "Invalid city name format",
      message:
        "City name can only contain letters, spaces, hyphens, and apostrophes",
    });
  }

  req.validatedCity = trimmedCity;
  next();
};

// Error handling middleware
const handleApiError = (error, city) => {
  console.error(`Error fetching weather for ${city}:`, error.message);

  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 404:
        return {
          status: 404,
          error: "City not found",
          message: `Weather data for ${city} is not available. Please check the city name.`,
        };
      case 401:
        return {
          status: 500,
          error: "API authentication failed",
          message:
            "Weather service is temporarily unavailable. Please try again later.",
        };
      case 429:
        return {
          status: 429,
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        };
      default:
        return {
          status: 500,
          error: "Weather service error",
          message:
            "Unable to fetch weather data at this time. Please try again later.",
        };
    }
  }

  if (error.request) {
    return {
      status: 503,
      error: "Network error",
      message:
        "Unable to connect to weather service. Please check your internet connection.",
    };
  }

  return {
    status: 500,
    error: "Internal server error",
    message: "An unexpected error occurred. Please try again later.",
  };
};

// Validate API response
const validateWeatherData = (data) => {
  const requiredFields = ["main", "weather", "sys", "name"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Invalid weather data: missing required fields: ${missingFields.join(
        ", "
      )}`
    );
  }

  if (!Array.isArray(data.weather) || data.weather.length === 0) {
    throw new Error("Invalid weather data: weather array is empty or invalid");
  }

  if (!data.main.temp || typeof data.main.temp !== "number") {
    throw new Error("Invalid weather data: temperature is missing or invalid");
  }

  return true;
};

// Routes
router.get("/current/:city", validateCityInput, async (req, res) => {
  const city = req.validatedCity;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    // Validate the response data
    validateWeatherData(response.data);

    res.json(response.data);
  } catch (error) {
    const errorResponse = handleApiError(error, city);
    res.status(errorResponse.status).json(errorResponse);
  }
});

router.get("/forecast/:city", validateCityInput, async (req, res) => {
  const city = req.validatedCity;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
    );

    // Validate forecast data
    if (!response.data.list || !Array.isArray(response.data.list)) {
      throw new Error(
        "Invalid forecast data: missing or invalid forecast list"
      );
    }

    res.json(response.data);
  } catch (error) {
    const errorResponse = handleApiError(error, city);
    res.status(errorResponse.status).json(errorResponse);
  }
});

// Favorites handling
const readFavoritesFile = () => {
  try {
    const fileContent = fs.readFileSync(favoritesFile, "utf8");
    const data = JSON.parse(fileContent);
    return data.favorites || [];
  } catch (error) {
    console.error("Error reading favorites file:", error.message);
    return [];
  }
};

const writeFavoritesFile = (favorites) => {
  try {
    fs.writeFileSync(favoritesFile, JSON.stringify({ favorites }, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing to favorites file:", error.message);
    return false;
  }
};

router.post("/favorites", validateCityInput, (req, res) => {
  const city = req.validatedCity;
  const favorites = readFavoritesFile();

  // Check if city already exists (case-insensitive)
  if (favorites.some((fav) => fav.toLowerCase() === city.toLowerCase())) {
    return res.status(409).json({
      error: "City already exists",
      message: `"${city}" is already in your favorites`,
    });
  }

  // Add city to favorites
  favorites.push(city);

  if (writeFavoritesFile(favorites)) {
    res.json({
      message: "City added successfully",
      city,
      totalFavorites: favorites.length,
    });
  } else {
    res.status(500).json({
      error: "Failed to save favorite",
      message: "Unable to save the city to favorites. Please try again.",
    });
  }
});

router.get("/favorites", (req, res) => {
  const favorites = readFavoritesFile();
  res.json({
    favorites,
    count: favorites.length,
  });
});

router.delete("/favorites/:city", validateCityInput, (req, res) => {
  const city = req.validatedCity;
  const favorites = readFavoritesFile();

  const cityIndex = favorites.findIndex(
    (fav) => fav.toLowerCase() === city.toLowerCase()
  );

  if (cityIndex === -1) {
    return res.status(404).json({
      error: "City not found",
      message: `"${city}" is not in your favorites`,
    });
  }

  favorites.splice(cityIndex, 1);

  if (writeFavoritesFile(favorites)) {
    res.json({
      message: "City removed successfully",
      city,
      totalFavorites: favorites.length,
    });
  } else {
    res.status(500).json({
      error: "Failed to remove favorite",
      message: "Unable to remove the city from favorites. Please try again.",
    });
  }
});

module.exports = router;
