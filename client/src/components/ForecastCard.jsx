import { Cloud, Wind, Thermometer, Droplets } from "lucide-react";

export default function ForecastCard({ forecast }) {
  const { main, weather, wind, dt_txt } = forecast;

  const date = new Date(dt_txt);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
      <div className="text-gray-300 mb-3">{formattedDate}</div>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt={weather[0].description}
          className="w-16 h-16"
        />
        <div>
          <h3 className="text-xl font-semibold text-blue-300 capitalize">
            {weather[0].description}
          </h3>
          <p className="text-2xl font-bold text-white">
            {Math.round(main.temp)}°C
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-gray-300">
          <Thermometer className="w-5 h-5 text-red-400" />
          <span>Feels like: {Math.round(main.feels_like)}°C</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Droplets className="w-5 h-5 text-blue-400" />
          <span>Humidity: {main.humidity}%</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Wind className="w-5 h-5 text-green-400" />
          <span>Wind: {Math.round(wind.speed)} m/s</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Cloud className="w-5 h-5 text-gray-400" />
          <span>Pressure: {main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}
