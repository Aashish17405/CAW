export default function WeatherCard({ weather }){
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-blue-300 mb-2">{weather.name}</h2>
      <div className="flex items-center justify-center gap-4 mb-4">
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
          alt={weather.weather[0].description}
          className="w-20 h-20"
        />
        <div>
          <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-gray-300 capitalize">{weather.weather[0].description}</p>
        </div>
      </div>
      <p className="text-gray-400">Feels like {Math.round(weather.main.feels_like)}°C</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <ThermometerSun className="w-5 h-5 text-blue-400" />
          <h4 className="text-gray-400 text-sm">Min/Max</h4>
        </div>
        <p className="text-xl font-semibold">
          {Math.round(weather.main.temp_min)}°/{Math.round(weather.main.temp_max)}°
        </p>
      </div>
      
      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          <h4 className="text-gray-400 text-sm">Humidity</h4>
        </div>
        <p className="text-xl font-semibold">{weather.main.humidity}%</p>
      </div>
      
      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="w-5 h-5 text-blue-400" />
          <h4 className="text-gray-400 text-sm">Wind Speed</h4>
        </div>
        <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
      </div>
      
      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-5 h-5 text-blue-400" />
          <h4 className="text-gray-400 text-sm">Pressure</h4>
        </div>
        <p className="text-xl font-semibold">{weather.main.pressure} hPa</p>
      </div>
      
      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-blue-400" />
          <h4 className="text-gray-400 text-sm">Clouds</h4>
        </div>
        <p className="text-xl font-semibold">{weather.clouds.all}%</p>
      </div>
      
      <div className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <h4 className="text-gray-400 text-sm">Visibility</h4>
        </div>
        <p className="text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
      </div>
    </div>

    <div className="flex items-center justify-between bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Sun className="w-5 h-5 text-yellow-400" />
        <span>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}</span>
      </div>
      <div className="flex items-center gap-2">
        <Moon className="w-5 h-5 text-blue-300" />
        <span>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}</span>
      </div>
    </div>
  </div>
};