import {
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Moon,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { getWeatherIcon } from "../utils/weatherUtils";

export default function WeatherCard({ weather, isCelsius }) {
  // Validate weather data
  if (!weather || !weather.main || !weather.weather || !weather.weather[0]) {
    return (
      <div className="text-center p-6 bg-red-500/20 border border-red-500 rounded-lg">
        <p className="text-red-300">Invalid weather data received</p>
      </div>
    );
  }

  const convertTemp = (kelvin) => {
    if (!kelvin && kelvin !== 0) return "N/A";
    if (isCelsius) {
      return Math.round(kelvin - 273.15);
    }
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
  };

  const getTempUnit = () => (isCelsius ? "°C" : "°F");

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const weatherIcon = getWeatherIcon(weather.weather[0].icon);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-300">
          {weather.name || "Unknown"}, {weather.sys?.country || "Unknown"}
        </h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-6xl">{weatherIcon}</div>
          <div>
            <p className="text-5xl font-bold">
              {convertTemp(weather.main.temp)}
              {getTempUnit()}
            </p>
            <p className="text-gray-300 capitalize">
              {weather.weather[0].description || "Unknown"}
            </p>
          </div>
        </div>
        <p className="text-gray-400">
          Feels like {convertTemp(weather.main.feels_like)}
          {getTempUnit()}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ThermometerSun className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-400 text-sm">Min/Max</h4>
          </div>
          <p className="text-xl font-semibold">
            {convertTemp(weather.main.temp_min)}/
            {convertTemp(weather.main.temp_max)}
            {getTempUnit()}
          </p>
        </div>

        <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-400 text-sm">Humidity</h4>
          </div>
          <p className="text-xl font-semibold">
            {weather.main.humidity || "N/A"}%
          </p>
        </div>

        <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-400 text-sm">Wind Speed</h4>
          </div>
          <p className="text-xl font-semibold">
            {weather.wind?.speed || "N/A"} m/s
          </p>
        </div>

        <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-400 text-sm">Pressure</h4>
          </div>
          <p className="text-xl font-semibold">
            {weather.main.pressure || "N/A"} hPa
          </p>
        </div>

        <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-400 text-sm">Clouds</h4>
          </div>
          <p className="text-xl font-semibold">
            {weather.clouds?.all || "N/A"}%
          </p>
        </div>

        <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-400 text-sm">Visibility</h4>
          </div>
          <p className="text-xl font-semibold">
            {weather.visibility
              ? (weather.visibility / 1000).toFixed(1)
              : "N/A"}{" "}
            km
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-400" />
          <span>Sunrise: {formatTime(weather.sys?.sunrise)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-blue-300" />
          <span>Sunset: {formatTime(weather.sys?.sunset)}</span>
        </div>
      </div>
    </div>
  );
}
