import { useState, useEffect } from "react";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const FAVORITES_STORAGE_KEY = "weatherAppFavorites";

export default function FavoritesList({ onCitySelect, refreshTrigger, triggerRefresh }) {
  const [favorites, setFavorites] = useState([]);
  // Removed loading and error states as localStorage operations are synchronous and less prone to a "loading" state or typical fetch errors.
  // We can add specific error handling for localStorage if needed (e.g., storage full).

  useEffect(() => {
    loadFavoritesFromLocalStorage();
  }, [refreshTrigger]);

  const loadFavoritesFromLocalStorage = () => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      toast.error("Could not load favorites.");
      setFavorites([]); // Reset to empty array on error
    }
  };

  const removeFavoriteInLocalStorage = (cityToRemove) => {
    try {
      const currentFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
      const updatedFavorites = currentFavorites.filter(city => city.toLowerCase() !== cityToRemove.toLowerCase());
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites); // Update component state
      toast.success(`${cityToRemove} removed from favorites`);
    } catch (error) {
      console.error("Error removing favorite from localStorage:", error);
      toast.error(`Failed to remove ${cityToRemove} from favorites.`);
    }
  };

  // No loading state needed for localStorage, render directly.
  // Error state can be simplified or handled differently if specific localStorage errors need to be shown.
  // For now, errors are logged and a toast is shown.

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites yet</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((city) => (
            <li
              key={city} // Assuming city names are unique enough for keys here
              className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors"
            >
              <button
                onClick={() => { onCitySelect(city); triggerRefresh(true); }}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
              >
                <Star className="w-4 h-4" />
                <span className="capitalize">{city}</span>
              </button>
              <button
                onClick={() => removeFavoriteInLocalStorage(city)}
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