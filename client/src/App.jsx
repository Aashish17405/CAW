import { useState, useRef } from "react";
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
  Download,
} from "lucide-react";
import WeatherCard from "./components/WeatherCard";
import { getWeatherBackground } from "./utils/weatherUtils";
import toast, { Toaster } from "react-hot-toast";
import FavoritesList from "./components/FavoritesList";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// For Vite:
const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshFavorites, setRefreshFavorites] = useState(0);
  const [isCelsius, setIsCelsius] = useState(true);
  const forecastRef = useRef(null);

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

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/current/${city}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch weather data");
      }

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

    setForecastLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/forecast/${city}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch forecast data");
      }

      setForecast(data);
      toast.success(`Forecast data for ${data.city.name} loaded successfully!`);

      // Scroll to forecast after a short delay to ensure it's rendered
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
      const weatherElement = document.querySelector(".weather-report");
      if (!weatherElement) {
        throw new Error("Weather report element not found");
      }

      // Create a temporary container for the export
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px"; // Set a fixed width for better quality
      container.style.backgroundColor = "#1F2937";
      container.style.padding = "20px";
      container.style.color = "white";

      // Clone the content
      const contentClone = weatherElement.cloneNode(true);

      // Remove gradient backgrounds
      const gradientElements =
        contentClone.getElementsByClassName("bg-gradient-to-br");
      Array.from(gradientElements).forEach((el) => {
        el.style.background = "#1F2937";
      });

      // Add the clone to the container
      container.appendChild(contentClone);
      document.body.appendChild(container);

      // Wait for images to load
      const images = container.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve;
              }
            })
        )
      );

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#1F2937",
        allowTaint: true,
        foreignObjectRendering: true,
        width: 800,
        height: container.offsetHeight,
        onclone: (clonedDoc) => {
          // Ensure all text is visible
          const elements = clonedDoc.getElementsByTagName("*");
          Array.from(elements).forEach((el) => {
            if (window.getComputedStyle(el).color === "rgba(0, 0, 0, 0)") {
              el.style.color = "white";
            }
          });
        },
      });

      // Clean up
      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `weather-report-${city}-${new Date().toISOString().split("T")[0]}.pdf`
      );

      toast.success("Weather report exported successfully!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export weather report");
    }
  };

  // Get background class based on current weather
  const backgroundClass = weather?.weather?.[0]?.icon
    ? getWeatherBackground(weather.weather[0].icon)
    : "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900";

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
    getWeather();
    getForecast();
  };

  return (
    <div
      className={`min-h-screen w-full ${backgroundClass} text-white transition-colors duration-500`}
    >
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-4">
            Weather Dashboard
          </h1>
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="flex flex-col gap-4">
              {/* Input Section */}
              <div className="w-full flex justify-center">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full max-w-md p-3 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      getWeather();
                    }
                  }}
                />
              </div>

              {/* Buttons Section */}
              <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
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
                  {(weather || forecast) && (
                    <button
                      onClick={exportToPDF}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Export PDF
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <div className="weather-report">
                {weather && (
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => setIsCelsius(!isCelsius)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        {isCelsius ? "°C" : "°F"}
                      </button>
                    </div>
                    <WeatherCard weather={weather} isCelsius={isCelsius} />
                  </div>
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
                      <button
                        onClick={() => setIsCelsius(!isCelsius)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        {isCelsius ? "°C" : "°F"}
                      </button>
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

            <div className="lg:col-span-3">
              <FavoritesList
                onCitySelect={handleCitySelect}
                refreshTrigger={refreshFavorites}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
