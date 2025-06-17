import { useState, useRef, useEffect, useMemo } from "react";
import { Sun, Moon, Download, MapPin } from "lucide-react";

import {
  RainAnimation,
  SnowAnimation,
  ThunderAnimation,
  ClearSkyAnimation,
  CloudAnimation,
} from "./components/WeatherAnimations";

import WeatherCard from "./components/WeatherCard";
import Spinner from "./components/Spinner";
import { getWeatherBackground } from "./utils/weatherUtils";
import toast, { Toaster } from "react-hot-toast";
import FavoritesList from "./components/FavoritesList";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import useRateLimit from "./hooks/useRateLimit";
import LiveDashboard from "./components/LiveDashboard";

const API = import.meta.env.VITE_API_URL;

// Local storage utility functions
const getStoredForecast = (city) => {
  const storedData = localStorage.getItem(`forecast_${city.toLowerCase()}`);
  if (!storedData) return null;

  const { data, timestamp } = JSON.parse(storedData);
  const now = new Date().getTime();

  // Check if data is older than 24 hours
  if (now - timestamp > 24 * 60 * 60 * 1000) {
    localStorage.removeItem(`forecast_${city.toLowerCase()}`);
    return null;
  }

  return data;
};

const storeForecast = (city, data) => {
  const storageData = {
    data,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(
    `forecast_${city.toLowerCase()}`,
    JSON.stringify(storageData)
  );
};

const getStoredWeather = (city) => {
  const storedData = localStorage.getItem(`weather_${city.toLowerCase()}`);
  if (!storedData) return null;

  const { data, timestamp } = JSON.parse(storedData);
  const now = new Date().getTime();

  // Check if data is older than 24 hours
  if (now - timestamp > 24 * 60 * 60 * 1000) {
    localStorage.removeItem(`weather_${city.toLowerCase()}`);
    return null;
  }

  return data;
};

const storeWeather = (city, data) => {
  const storageData = {
    data,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(
    `weather_${city.toLowerCase()}`,
    JSON.stringify(storageData)
  );
};

export default function App() {
  const [city, setCity] = useState("");
  const [exporting, setExporting] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshFavorites, setRefreshFavorites] = useState(0);
  const [isCelsius, setIsCelsius] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const forecastRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const { isLimited, checkRateLimit } = useRateLimit(2000); // 2 seconds between calls

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

  const convertTemp = (kelvin) => {
    if (!kelvin && kelvin !== 0) return "N/A";
    if (isCelsius) {
      return Math.round(kelvin - 273.15);
    }
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
  };

  const getTempUnit = () => (isCelsius ? "°C" : "°F");

  const getWeather = async () => {
    if (!validateCity()) return;
    if (!checkRateLimit()) {
      toast.error("Please wait a moment before making another request");
      return;
    }

    // Check local storage first
    const storedWeather = getStoredWeather("weather_" + city);
    if (storedWeather) {
      setWeather(storedWeather);
      toast.success(`Weather data for ${city} loaded from cache!`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/current/${city}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch weather data");
      }

      // Store the new weather data
      storeWeather(city, data);

      setWeather(data);
      toast.success(`Weather data for ${data.name} loaded successfully!`);
    } catch (error) {
      console.error("Error fetching current weather:", error);
      setWeather(null);
      setError(error.message || "Failed to fetch weather data");
      toast.error(error.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const getForecast = async () => {
    if (!validateCity()) return;
    if (!checkRateLimit()) {
      toast.error("Please wait a moment before making another request");
      return;
    }

    // Check local storage first
    const storedForecast = getStoredForecast("forecast_" + city);
    if (storedForecast) {
      setForecast(storedForecast);
      toast.success(`Forecast data for ${city} loaded from cache!`);
      setTimeout(() => {
        forecastRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return;
    }

    setForecastLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/forecast/${city}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch forecast data");
      }

      // Store the new forecast data
      storeForecast(city, data);

      setForecast(data);
      toast.success(`Forecast data for ${data.city.name} loaded successfully!`);
      setTimeout(() => {
        forecastRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecast(null);
      setError(error.message || "Failed to fetch forecast data");
      toast.error(error.message || "Failed to fetch forecast data");
    } finally {
      setForecastLoading(false);
    }
  };

  const addFavorite = async () => {
    if (!validateCity()) return;

    try {
      const res = await fetch(`${API}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to favorites");
      }

      toast.success(`${city} added to favorites`);
      setRefreshFavorites((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding favorite:", error);
      setError(
        error.message || "Failed to add to favorites. Please try again."
      );
      toast.error(
        error.message || "Failed to add to favorites. Please try again."
      );
    }
  };

  const exportToPDF = async () => {
    if (!weather && !forecast) {
      toast.error("No weather data to export!");
      return;
    }

    try {
      setExporting(true);
      const weatherElement = document.querySelector(".weather-report");
      if (!weatherElement) throw new Error("Weather report element not found");

      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "800px",
        backgroundColor: "#1F2937",
        padding: "20px",
        color: "white",
        height: `${weatherElement.offsetHeight + 100}px`,
      });

      const contentClone = weatherElement.cloneNode(true);

      contentClone.querySelectorAll("*").forEach((el) => {
        el.style.visibility = "visible";
        el.style.opacity = "1";
      });

      container.appendChild(contentClone);
      document.body.appendChild(container);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        backgroundColor: "#1F2937",
        logging: true,
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll("*").forEach((el) => {
            el.style.color = "#fff";
            el.style.backgroundColor = "#1F2937";
          });
        },
      });

      document.body.removeChild(container);

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pageWidth / pageHeight;

      let imgWidth, imgHeight, x, y;

      if (imgRatio > pageRatio) {
        imgWidth = pageWidth - 20;
        imgHeight = imgWidth / imgRatio;
        x = 10;
        y = (pageHeight - imgHeight) / 2;
      } else {
        imgHeight = pageHeight - 20;
        imgWidth = imgHeight * imgRatio;
        x = (pageWidth - imgWidth) / 2;
        y = 10;
      }

      pdf.addImage(canvas, "PNG", x, y, imgWidth, imgHeight);

      pdf.save(
        `weather-report-${city}-${new Date().toISOString().split("T")[0]}.pdf`
      );

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const backgroundClass = weather?.weather?.[0]?.icon
    ? getWeatherBackground(weather.weather[0].icon)
    : "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900";

  const getTextColor = (icon) => {
    const code = icon.slice(0, 2);
    const isNight = icon.endsWith("n");

    switch (code) {
      case "01":
      case "02":
        return isNight
          ? "text-yellow-200 drop-shadow-lg"
          : "text-white drop-shadow-md";
      case "03":
      case "04":
        return isNight
          ? "text-white drop-shadow-lg"
          : "text-gray-900 drop-shadow";
      case "09":
      case "10":
        return isNight
          ? "text-blue-100 drop-shadow-lg"
          : "text-white drop-shadow";
      case "11":
        return "text-yellow-300 font-bold drop-shadow-lg";
      case "13":
        return isNight
          ? "text-blue-100 drop-shadow-lg"
          : "text-blue-900 drop-shadow";
      case "50":
        return isNight
          ? "text-gray-200 drop-shadow-lg"
          : "text-gray-900 drop-shadow";
      default:
        return "text-white drop-shadow";
    }
  };
  const icon = weather?.weather?.[0]?.icon;
  const textColorClass = icon ? getTextColor(icon) : "text-white";

  const getWeatherAnimation = useMemo(() => {
    if (!icon) return null;
    if (icon.startsWith("09") || icon.startsWith("10"))
      return <RainAnimation />;
    if (icon.startsWith("13")) return <SnowAnimation />;
    if (icon.startsWith("11")) return <ThunderAnimation />;
    if (icon.startsWith("01") && icon.endsWith("d"))
      return <ClearSkyAnimation />;
    if (icon.startsWith("03") || icon.startsWith("04") || icon.startsWith("02"))
      return <CloudAnimation />;
    return null;
  }, [icon]);

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

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
  };

  const getWeatherInYourPlace = async () => {
    if (!checkRateLimit()) {
      toast.error("Please wait a moment before making another request");
      return;
    }

    setLocationLoading(true);
    setError(null);

    try {
      // Get user's current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Fetch weather data using coordinates
      const res = await fetch(
        `${API}/livecast?lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch weather data");
      }

      // Store the weather data
      storeWeather("current_location", data);
      setWeather(data);
      toast.success("Weather data for your location loaded successfully!");
    } catch (error) {
      console.error("Error getting location or weather:", error);
      setWeather(null);
      const errorMessage =
        error.code === 1
          ? "Location access denied. Please enable location services."
          : error.message || "Failed to fetch weather data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (refresh) {
      getWeather();
      getForecast();
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <div
      className={`min-h-screen w-full ${backgroundClass} text-white transition-colors duration-500`}
    >
      {getWeatherAnimation}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1F2937",
            color: "#fff",
            border: "1px solidrgb(255, 255, 255)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="w-full px-4 py-8">
        <header className="text-center mb-8 md:mb-12">
          <h1
            className={`${textColorClass} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-4`}
          >
            Weather Dashboard
          </h1>
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="flex flex-col gap-4">
              <div className="w-full flex justify-center">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  spellCheck={false}
                  className="w-full max-w-md p-3 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      getWeather();
                    }
                  }}
                />
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={getWeather}
                    disabled={loading}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? <Spinner /> : "Get Current"}
                  </button>
                  <button
                    onClick={getForecast}
                    disabled={forecastLoading}
                    className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 ${
                      forecastLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {forecastLoading ? <Spinner /> : "Get Forecast"}
                  </button>
                  <button
                    onClick={getWeatherInYourPlace}
                    disabled={locationLoading}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 flex items-center gap-2 ${
                      locationLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    {locationLoading ? <Spinner /> : "Weather in Your Place"}
                  </button>
                  <button
                    onClick={addFavorite}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
                  >
                    Add Favorite
                  </button>
                  {(weather || forecast) && (
                    <button
                      onClick={exportToPDF}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {exporting ? "Exporting..." : "Export PDF"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-300 max-w-md mx-auto">
                {error}
              </div>
            )}
          </div>
        </header>

        <main className="w-full max-w-6xl mx-auto space-y-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
            <div className="lg:col-span-9">
              <div className="weather-report">
                {weather && !weather.current && (
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
                    <div className="flex justify-end mb-4">
                      <div className="flex justify-end mb-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCelsius}
                            onChange={() => setIsCelsius(!isCelsius)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-blue-600 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-400 transition-all duration-300"></div>
                          <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 transform peer-checked:translate-x-6"></div>
                          <span className="ml-3 text-sm text-white font-medium">
                            {isCelsius ? "°C" : "°F"}
                          </span>
                        </label>
                      </div>
                    </div>
                    <WeatherCard weather={weather} isCelsius={isCelsius} />
                  </div>
                )}

                {weather && weather.current && (
                  <LiveDashboard data={weather} isCelsius={isCelsius} />
                )}

                {forecast && (
                  <div
                    ref={forecastRef}
                    className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-3xl font-semibold text-white">
                        5-Day Forecast - {forecast.city.name},{" "}
                        {forecast.city.country}
                      </h3>
                      <div className="flex justify-end mb-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCelsius}
                            onChange={() => setIsCelsius(!isCelsius)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-blue-600 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-400 transition-all duration-300"></div>
                          <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 transform peer-checked:translate-x-6"></div>
                          <span className="ml-3 text-sm text-white font-medium">
                            {isCelsius ? "°C" : "°F"}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 mb-6">
                      <Sun className="w-5 h-5" />
                      <span>Sunrise: {formatTime(forecast.city.sunrise)}</span>
                      <Moon className="w-5 h-5 ml-4" />
                      <span>Sunset: {formatTime(forecast.city.sunset)}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {forecast.list
                        .filter((item, index) => index % 8 === 0)
                        .slice(0, 5)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg hover:bg-gray-700/70 transition-colors duration-300"
                          >
                            <div className="text-center mb-4">
                              <h4 className="text-xl font-semibold text-white">
                                {formatDate(item.dt)}
                              </h4>
                              <p className="text-gray-300 text-sm">
                                {item.dt_txt.split(" ")[1]}
                              </p>
                            </div>

                            <div className="flex flex-col items-center mb-4">
                              <img
                                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                                className="w-16 h-16"
                              />
                              <p className="text-lg font-medium text-white capitalize mt-2">
                                {item.weather[0].main}
                              </p>
                              <p className="text-sm text-gray-300 capitalize">
                                {item.weather[0].description}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                  Temperature
                                </span>
                                <span className="text-white font-medium">
                                  {convertTemp(item.main.temp)}
                                  {getTempUnit()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                  Feels Like
                                </span>
                                <span className="text-white font-medium">
                                  {convertTemp(item.main.feels_like)}
                                  {getTempUnit()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Humidity</span>
                                <span className="text-white font-medium">
                                  {item.main.humidity}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Wind</span>
                                <span className="text-white font-medium">
                                  {item.wind.speed.toFixed(1)} m/s
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <FavoritesList
              onCitySelect={handleCitySelect}
              refreshTrigger={refreshFavorites}
              triggerRefresh={setRefresh}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
