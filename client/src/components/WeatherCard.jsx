import {
  Thermometer,
  Wind,
  Cloud,
  Droplets,
  Gauge,
  Sun,
  Moon,
  ThermometerSun,
  Eye,
  CloudRain,
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
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const weatherIcon = getWeatherIcon(weather.weather[0].icon);

  const WeatherInfoCard = ({ title, icon: Icon, value, unit, subValue }) => (
    <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-blue-400" />
        <h4 className="text-gray-400 text-sm">{title}</h4>
      </div>
      <p className="text-xl font-semibold">
        {value}
        {unit}
      </p>
      {subValue && <p className="text-sm text-gray-300">{subValue}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-white mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-gray-300">
            {new Date(weather.dt * 1000).toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-20 h-20"
            />
            <p className="text-lg font-medium text-white capitalize">
              {weather.weather[0].main}
            </p>
            <p className="text-sm text-gray-300 capitalize">
              {weather.weather[0].description}
            </p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-white">
              {convertTemp(weather.main.temp)}
              {getTempUnit()}
            </p>
            <p className="text-gray-300">
              Feels like {convertTemp(weather.main.feels_like)}
              {getTempUnit()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <WeatherInfoCard
          title="Temperature"
          icon={Thermometer}
          value={`${convertTemp(weather.main.temp_min)} - ${convertTemp(
            weather.main.temp_max
          )}`}
          unit={getTempUnit()}
        />
        <WeatherInfoCard
          title="Humidity"
          icon={Droplets}
          value={weather.main.humidity}
          unit="%"
        />
        <WeatherInfoCard
          title="Wind"
          icon={Wind}
          value={weather.wind.speed.toFixed(1)}
          unit=" m/s"
        />
        <WeatherInfoCard
          title="Pressure"
          icon={Gauge}
          value={weather.main.pressure}
          unit=" hPa"
        />
        <WeatherInfoCard
          title="Visibility"
          icon={Eye}
          value={(weather.visibility / 1000).toFixed(1)}
          unit=" km"
        />
        <WeatherInfoCard
          title="Clouds"
          icon={Cloud}
          value={weather.clouds.all}
          unit="%"
        />
        <WeatherInfoCard
          title="Sunrise"
          icon={Sun}
          value={formatTime(weather.sys.sunrise)}
        />
        <WeatherInfoCard
          title="Sunset"
          icon={Moon}
          value={formatTime(weather.sys.sunset)}
        />
      </div>
    </div>
  );
}
