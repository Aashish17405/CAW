const express = require("express");
const axios = require("axios");
// Favorite model is no longer needed
// const Favorite = require("../models/Favorite");

const router = express.Router();
const API_KEY = process.env.API_KEY || "78ed8eb3a3019fb3af547bf878796675";

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

// Routes
router.get("/current/:city", validateCityInput, async (req, res) => {
  const city = req.validatedCity;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

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

router.get("/livecast", async (req, res) => {
  const { lat, lon} = req.query;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    res.json(response.data); 
  } catch (error) {
    console.error("Error fetching live weather data:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to fetch live weather data",
    });
  }
});

// Removed POST /favorites, GET /favorites, and DELETE /favorites/:city routes
// as favorites are now handled on the client-side with localStorage.

module.exports = router;
