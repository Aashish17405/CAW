import { useState, useEffect } from "react";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

export default function FavoritesList({ onCitySelect, refreshTrigger }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, [refreshTrigger]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API}/favorites`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch favorites");
      }

      setFavorites(data.favorites);
      setError(null);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError(error.message || "Failed to fetch favorites");
      toast.error(error.message || "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (city) => {
    try {
      const res = await fetch(`${API}/favorites/${city}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove favorite");
      }

      setFavorites((prev) => prev.filter((fav) => fav !== city));
      toast.success(`${city} removed from favorites`);
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error(error.message || "Failed to remove favorite");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
        <p className="text-gray-400">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites yet</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((city) => (
            <li
              key={city}
              className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors"
            >
              <button
                onClick={() => onCitySelect(city)}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
              >
                <Star className="w-4 h-4" />
                <span className="capitalize">{city}</span>
              </button>
              <button
                onClick={() => removeFavorite(city)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
