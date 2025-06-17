import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RefreshCw, Trash2 } from "lucide-react";

export default function FavoritesList({ onCitySelect, refreshTrigger }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch favorites");
      }

      setFavorites(data.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error(error.message || "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (city) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/favorites/${city}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove from favorites");
      }

      toast.success(`${city} removed from favorites`);
      fetchFavorites(); // Refresh the list
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error(error.message || "Failed to remove from favorites");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-white">Favorite Cities</h3>
          <button
            onClick={fetchFavorites}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Refresh favorites"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-white">Favorite Cities</h3>
        <button
          onClick={fetchFavorites}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          title="Refresh favorites"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="text-gray-200">No favorite cities yet</p>
      ) : (
        <ul className="space-y-2">
          {favorites.length > 0 &&
            favorites.map((city) => (
              <li
                key={city}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
              >
                <button
                  onClick={() => onCitySelect(city)}
                  className="flex-1 text-left text-white hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {city}
                </button>
                <button
                  onClick={() => removeFavorite(city)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
