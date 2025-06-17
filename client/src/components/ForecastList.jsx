import ForecastCard from "./ForecastCard";

export default function ForecastList({ forecastData }) {
  if (!forecastData || !forecastData.list) {
    return (
      <div className="text-gray-400 text-center p-4">
        No forecast data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {forecastData.list.map((forecast, index) => (
        <ForecastCard key={index} forecast={forecast} />
      ))}
    </div>
  );
}
