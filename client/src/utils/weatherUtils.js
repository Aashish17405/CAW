export const getWeatherBackground = (weatherCode, isDay = true) => {
  // Weather codes from OpenWeatherMap
  const backgrounds = {
    // Clear sky
    "01d": "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
    "01n": "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900",

    // Few clouds
    "02d": "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500",
    "02n": "bg-gradient-to-br from-gray-800 via-blue-800 to-gray-900",

    // Scattered clouds
    "03d": "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
    "03n": "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",

    // Broken clouds
    "04d": "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
    "04n": "bg-gradient-to-br from-gray-800 via-gray-900 to-black",

    // Shower rain
    "09d": "bg-gradient-to-br from-gray-400 via-blue-400 to-gray-600",
    "09n": "bg-gradient-to-br from-gray-700 via-blue-800 to-gray-900",

    // Rain
    "10d": "bg-gradient-to-br from-gray-500 via-blue-500 to-gray-700",
    "10n": "bg-gradient-to-br from-gray-800 via-blue-900 to-black",

    // Thunderstorm
    "11d": "bg-gradient-to-br from-gray-600 via-purple-600 to-gray-800",
    "11n": "bg-gradient-to-br from-gray-900 via-purple-900 to-black",

    // Snow
    "13d": "bg-gradient-to-br from-gray-200 via-blue-200 to-gray-400",
    "13n": "bg-gradient-to-br from-gray-700 via-blue-700 to-gray-900",

    // Mist
    "50d": "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
    "50n": "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",
  };

  return (
    backgrounds[weatherCode] ||
    "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
  );
};

export const getWeatherIcon = (weatherCode) => {
  const icons = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "🌨️",
    "13n": "🌨️",
    "50d": "🌫️",
    "50n": "🌫️",
  };

  return icons[weatherCode] || "❓";
};
