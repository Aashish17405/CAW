# Weather Dashboard

A modern, feature-rich weather application built with React that provides real-time weather information and forecasts with a beautiful, responsive UI.

## 🌟 Key Features

### Core Features

- **Current Weather**: Get detailed current weather information for any city
- **5-Day Forecast**: View detailed weather forecasts for the next 5 days
- **Live Location Weather**: Get weather data for your current location
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Weather Animations**: Dynamic weather animations based on current conditions
- **Favorites System**: Save and quickly access your favorite cities
- **PDF Export**: Export weather reports as PDF documents

### Advanced Features

- **Smart Caching**: 24-hour local storage caching to reduce API calls
- **Rate Limiting**: Prevents excessive API calls
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Live weather data with automatic refresh
- **Error Handling**: Comprehensive error handling and user feedback
- **Analytics**: Built-in analytics for usage tracking

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```env
VITE_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 💡 Usage Guide

1. **Search for Weather**:

   - Enter a city name in the search bar
   - Click "Get Current" for current weather
   - Click "Get Forecast" for 5-day forecast

2. **Use Current Location**:

   - Click "Weather in Your Place"
   - Allow location access when prompted

3. **Manage Favorites**:

   - Click "Add Favorite" to save a city
   - Access favorites from the sidebar
   - Click on a favorite to load its weather

4. **Export Data**:
   - Click "Export PDF" to save weather report
   - PDF includes current weather and forecast

## 🛠️ Technical Highlights

- **Modern Stack**: Built with React, Vite, and TailwindCSS
- **Performance**: Optimized with local storage caching
- **UX Design**: Smooth animations and transitions
- **Error Handling**: Comprehensive error management
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA labels and semantic HTML

## 📱 Features in Detail

### Weather Information

- Temperature (current, feels like)
- Weather conditions with icons
- Humidity and wind speed
- Cloud coverage
- UV index
- Sunrise and sunset times

### Forecast Features

- 5-day weather forecast
- Hourly temperature predictions
- Weather condition changes
- Wind and humidity forecasts

### User Experience

- Dark mode interface
- Dynamic weather backgrounds
- Smooth scrolling
- Toast notifications
- Loading indicators

## 🔒 Environment Variables

Create a `.env` file with the following variables:

```env
VITE_API_KEY=your_openweathermap_api_key
VITE_API_URL=your_backend_api_url
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Lucide React for icons
- React Hot Toast for notifications
- jsPDF for PDF generation
