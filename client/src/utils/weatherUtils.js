export const getWeatherBackground = (icon) => {
  const weatherType = icon.substring(0, 2);
  const timeOfDay = icon.endsWith("n") ? "night" : "day";

  const backgrounds = {
    "01": {
      day: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
      night: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900",
    },
    "02": {
      day: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
      night: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900",
    },
    "03": {
      day: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      night: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
    },
    "04": {
      day: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      night: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
    },
    "09": {
      day: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
      night: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900",
    },
    10: {
      day: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
      night: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900",
    },
    11: {
      day: "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",
      night: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
    },
    13: {
      day: "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500",
      night: "bg-gradient-to-br from-gray-800 via-blue-900 to-gray-800",
    },
    50: {
      day: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
      night: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800",
    },
  };

  return (
    backgrounds[weatherType]?.[timeOfDay] ||
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
