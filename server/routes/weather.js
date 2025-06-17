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

// Routes
router.get("/current/:city", async (req, res) => {
  const { city } = req.params;

  // Input validation
  if (!city || city.trim().length === 0) {
    return res.status(400).json({
      error: "City name is required",
      message: "Please provide a valid city name",
    });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching current weather for ${city}:`, error.message);

    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({
          error: "City not found",
          message: `Weather data for "${city}" is not available. Please check the city name.`,
        });
      } else if (status === 401) {
        return res.status(500).json({
          error: "API authentication failed",
          message: "Weather service is temporarily unavailable",
        });
      } else if (status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        });
      } else {
        return res.status(500).json({
          error: "Weather service error",
          message: "Unable to fetch weather data at this time",
        });
      }
    } else if (error.request) {
      // Network error
      return res.status(503).json({
        error: "Network error",
        message:
          "Unable to connect to weather service. Please try again later.",
      });
    } else {
      // Other error
      return res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred while fetching weather data",
      });
    }
  }
});

router.get("/forecast/:city", async (req, res) => {
  const { city } = req.params;

  // Input validation
  if (!city || city.trim().length === 0) {
    return res.status(400).json({
      error: "City name is required",
      message: "Please provide a valid city name",
    });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching forecast for ${city}:`, error.message);

    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({
          error: "City not found",
          message: `Forecast data for "${city}" is not available. Please check the city name.`,
        });
      } else if (status === 401) {
        return res.status(500).json({
          error: "API authentication failed",
          message: "Weather service is temporarily unavailable",
        });
      } else if (status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        });
      } else {
        return res.status(500).json({
          error: "Weather service error",
          message: "Unable to fetch forecast data at this time",
        });
      }
    } else if (error.request) {
      // Network error
      return res.status(503).json({
        error: "Network error",
        message:
          "Unable to connect to weather service. Please try again later.",
      });
    } else {
      // Other error
      return res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred while fetching forecast data",
      });
    }
  }
});

router.post("/favorites", (req, res) => {
  try {
    const { city } = req.body;

    // Input validation
    if (!city || typeof city !== "string" || city.trim().length === 0) {
      return res.status(400).json({
        error: "Invalid city name",
        message: "Please provide a valid city name",
      });
    }

    const trimmedCity = city.trim();

    // Check if city name is reasonable length
    if (trimmedCity.length > 100) {
      return res.status(400).json({
        error: "City name too long",
        message: "City name must be less than 100 characters",
      });
    }

    // Read favorites file
    let data;
    try {
      const fileContent = fs.readFileSync(favoritesFile, "utf8");
      data = JSON.parse(fileContent);
    } catch (fileError) {
      console.error("Error reading favorites file:", fileError.message);
      // Initialize with empty favorites if file doesn't exist or is corrupted
      data = { favorites: [] };
    }

    // Ensure data structure is correct
    if (!data.favorites || !Array.isArray(data.favorites)) {
      data.favorites = [];
    }

    // Check if city already exists (case-insensitive)
    const cityExists = data.favorites.some(
      (existingCity) => existingCity.toLowerCase() === trimmedCity.toLowerCase()
    );

    if (cityExists) {
      return res.status(409).json({
        error: "City already exists",
        message: `"${trimmedCity}" is already in your favorites`,
      });
    }

    // Add city to favorites
    data.favorites.push(trimmedCity);

    // Write back to file
    try {
      fs.writeFileSync(favoritesFile, JSON.stringify(data, null, 2));
    } catch (writeError) {
      console.error("Error writing to favorites file:", writeError.message);
      return res.status(500).json({
        error: "Failed to save favorite",
        message: "Unable to save the city to favorites. Please try again.",
      });
    }

    res.json({
      message: "City added successfully",
      city: trimmedCity,
      totalFavorites: data.favorites.length,
    });
  } catch (error) {
    console.error("Error in POST /favorites:", error.message);
    res.status(500).json({
      error: "Internal server error",
      message:
        "An unexpected error occurred while adding the city to favorites",
    });
  }
});

router.get("/favorites", (req, res) => {
  try {
    let data;

    // Try to read the favorites file
    try {
      const fileContent = fs.readFileSync(favoritesFile, "utf8");
      data = JSON.parse(fileContent);
    } catch (fileError) {
      console.error("Error reading favorites file:", fileError.message);

      if (fileError.code === "ENOENT") {
        // File doesn't exist, create it with empty favorites
        const initialData = { favorites: [] };
        try {
          fs.writeFileSync(favoritesFile, JSON.stringify(initialData, null, 2));
          data = initialData;
        } catch (createError) {
          console.error("Error creating favorites file:", createError.message);
          return res.status(500).json({
            error: "File system error",
            message: "Unable to access favorites data",
          });
        }
      } else {
        // File exists but is corrupted or unreadable
        return res.status(500).json({
          error: "Data corruption",
          message: "Favorites data is corrupted. Please contact support.",
        });
      }
    }

    // Ensure data structure is correct
    if (!data || typeof data !== "object") {
      data = { favorites: [] };
    }

    if (!data.favorites || !Array.isArray(data.favorites)) {
      data.favorites = [];
    }

    // Filter out any invalid entries (non-strings or empty strings)
    const validFavorites = data.favorites.filter(
      (city) => typeof city === "string" && city.trim().length > 0
    );

    res.json({
      favorites: validFavorites,
      count: validFavorites.length,
    });
  } catch (error) {
    console.error("Error in GET /favorites:", error.message);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while fetching favorites",
    });
  }
});

module.exports = router;
