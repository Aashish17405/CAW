import { useState } from "react";
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
import WeatherCard from "./components/WeatherCard";

// Mock FavoritesList component
const FavoritesList = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
    <h3 className="text-2xl font-semibold text-blue-300 mb-4">Favorite Cities</h3>
    <p className="text-gray-400">Your favorite cities will appear here...</p>
  </div>
);

const API = "http://localhost:5000/weather";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const validateCity = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return false;
    }
    setError(null);
    return true;
  };

  const getWeather = async () => {
    if (!validateCity()) return;
    
    setLoading(true);
    try {
      // Uncomment this when using real API
      const res = await fetch(`${API}/current/${city}`);
      const data = await res.json();
      setWeather(data);
      
      setTimeout(() => {
        setWeather(data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching current weather:", error);
      setWeather(null);
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  const getForecast = async () => {
    if (!validateCity()) return;
    
    setForecastLoading(true);
    try {
      // Uncomment this when using real API
      const res = await fetch(`${API}/forecast/${city}`);
      const data = await res.json();
      setForecast(data);
      
      setTimeout(() => {
        setForecast(data);
        setForecastLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecast(null);
      setError("Failed to fetch forecast data");
      setForecastLoading(false);
    }
  };

  const addFavorite = async () => {
    if (!validateCity()) return;
    
    try {
      // Uncomment this when using real API
      // await fetch(`${API}/favorites`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ city })
      // });
      alert("Added to favorites!");
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert("Failed to add to favorites. Please try again.");
    }
  };

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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="w-full px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Weather Dashboard
          </h1>
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full sm:w-64 p-3 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    getWeather();
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={getWeather}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Loading..." : "Get Current"}
                </button>
                <button
                  onClick={getForecast}
                  disabled={forecastLoading}
                  className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 ${
                    forecastLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {forecastLoading ? "Loading..." : "Get Forecast"}
                </button>
                <button
                  onClick={addFavorite}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
                >
                  Add Favorite
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
                {error}
              </div>
            )}
          </div>
        </header>

        <main className="w-full space-y-8">
          {weather && (
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
              <WeatherCard weather={weather} />
            </div>
          )}
          
          {forecast && (
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
              <div className="mb-6">
                <h3 className="text-3xl font-semibold text-blue-300 mb-2">
                  5-Day Forecast - {forecast.city.name}, {forecast.city.country}
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Sun className="w-5 h-5" />
                  <span>Sunrise: {formatTime(forecast.city.sunrise)}</span>
                  <Moon className="w-5 h-5 ml-4" />
                  <span>Sunset: {formatTime(forecast.city.sunset)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <span>Population: {forecast.city.population?.toLocaleString()}</span>
                  <span className="ml-4">Coordinates: {forecast.city.coord.lat}, {forecast.city.coord.lon}</span>
                </div>
              </div>

              <div className="space-y-6">
                {forecast && forecast.length && forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg hover:bg-gray-700/70 transition-colors duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-semibold text-blue-300">
                        {formatDate(item.dt)}
                      </h4>
                      <span className="text-gray-400">{item.dt_txt}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <WeatherInfoCard
                        title="Temperature"
                        icon={Thermometer}
                        value={Math.round(item.main.temp)}
                        unit="°C"
                        subValue={`Feels like: ${Math.round(item.main.feels_like)}°C`}
                      />

                      <WeatherInfoCard
                        title="Min/Max"
                        icon={ThermometerSun}
                        value={`${Math.round(item.main.temp_min)}°/${Math.round(item.main.temp_max)}°`}
                        subValue={`Temp KF: ${item.main.temp_kf.toFixed(1)}°C`}
                      />

                      <WeatherInfoCard
                        title="Humidity"
                        icon={Droplets}
                        value={item.main.humidity}
                        unit="%"
                      />

                      <WeatherInfoCard
                        title="Wind"
                        icon={Wind}
                        value={item.wind.speed.toFixed(1)}
                        unit=" m/s"
                        subValue={`Dir: ${item.wind.deg}° | Gust: ${item.wind.gust?.toFixed(1) || 'N/A'} m/s`}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <WeatherInfoCard
                        title="Pressure"
                        icon={Gauge}
                        value={item.main.pressure}
                        unit=" hPa"
                        subValue={`Sea: ${item.main.sea_level} hPa`}
                      />

                      <WeatherInfoCard
                        title="Ground Level"
                        icon={Gauge}
                        value={item.main.grnd_level}
                        unit=" hPa"
                      />

                      <WeatherInfoCard
                        title="Clouds"
                        icon={Cloud}
                        value={item.clouds.all}
                        unit="%"
                      />

                      <WeatherInfoCard
                        title="Visibility"
                        icon={Eye}
                        value={(item.visibility / 1000).toFixed(1)}
                        unit=" km"
                      />
                    </div>

                    {(item.rain || item.pop > 0) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {item.rain && (
                          <WeatherInfoCard
                            title="Rain (3h)"
                            icon={CloudRain}
                            value={item.rain['3h']?.toFixed(2) || 0}
                            unit=" mm"
                          />
                        )}
                        <WeatherInfoCard
                          title="Precipitation"
                          icon={Droplets}
                          value={Math.round(item.pop * 100)}
                          unit="%"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 bg-gray-600/50 p-3 rounded-lg">
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                        className="w-12 h-12"
                      />
                      <div>
                        <p className="text-lg font-medium capitalize">
                          {item.weather[0].main}
                        </p>
                        <p className="text-sm text-gray-300 capitalize">
                          {item.weather[0].description}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm text-gray-400">Time Period</p>
                        <p className="text-sm text-gray-300">{item.sys.pod === 'd' ? 'Day' : 'Night'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <div className="w-full mt-8">
          <FavoritesList />
        </div>
      </div>
    </div>
  );
}