import React from "react";
import { Droplet, Wind, Thermometer, Cloud, Sun } from "lucide-react";

const LiveDashboard = ({ data, isCelsius }) => {
  if (!data) return null;

  const convertTemp = (kelvin) => {
    if (!kelvin && kelvin !== 0) return "N/A";
    if (isCelsius) {
      return Math.round(kelvin - 273.15);
    }
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
  };

  const getTempUnit = () => (isCelsius ? "°C" : "°F");

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Live Weather Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Current Weather */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">
            Current Weather
          </h3>
          <div className="flex items-center gap-2">
            <img
              src={`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`}
              alt={data.current.weather[0].description}
              className="w-16 h-16"
            />
            <div>
              <p className="text-2xl font-bold text-white">
                {convertTemp(data.current.temp)}
                {getTempUnit()}
              </p>
              <p className="text-gray-300 capitalize">
                {data.current.weather[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Feels Like */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Feels Like</h3>
          <div className="flex items-center gap-2">
            <Thermometer className="w-8 h-8 text-orange-400" />
            <p className="text-2xl font-bold text-white">
              {convertTemp(data.current.feels_like)}
              {getTempUnit()}
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Humidity</h3>
          <div className="flex items-center gap-2">
            <Droplet className="w-8 h-8 text-blue-400" />
            <p className="text-2xl font-bold text-white">
              {data.current.humidity}%
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Wind Speed</h3>
          <div className="flex items-center gap-2">
            <Wind className="w-8 h-8 text-gray-400" />
            <p className="text-2xl font-bold text-white">
              {data.current.wind_speed} m/s
            </p>
          </div>
        </div>

        {/* Cloud Coverage */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">
            Cloud Coverage
          </h3>
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-gray-400" />
            <p className="text-2xl font-bold text-white">
              {data.current.clouds}%
            </p>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">UV Index</h3>
          <div className="flex items-center gap-2">
            <Sun className="w-8 h-8 text-yellow-400" />
            <p className="text-2xl font-bold text-white">{data.current.uvi}</p>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Hourly Forecast
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.hourly.slice(0, 6).map((hour, index) => (
            <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-300 mb-2">{formatTime(hour.dt)}</p>
              <img
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                alt={hour.weather[0].description}
                className="w-12 h-12 mx-auto"
              />
              <p className="text-lg font-semibold text-white mt-2">
                {convertTemp(hour.temp)}
                {getTempUnit()}
              </p>
              <p className="text-sm text-gray-300 capitalize">
                {hour.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;
