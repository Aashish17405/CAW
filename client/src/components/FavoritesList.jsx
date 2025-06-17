import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/weather";

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/favorites`);
      setFavorites(res.data.favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (cityToRemove) => {
    try {
      await axios.delete(`${API}/favorites/${cityToRemove}`);
      alert(`${cityToRemove} removed from favorites!`);
      fetchFavorites(); // Refresh the list after removal
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove favorite. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-3xl font-semibold text-blue-300">
          Favorite Cities
        </h3>
        <button
          onClick={fetchFavorites}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-105"
        >
          Refresh
        </button>
      </div>
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites added yet.</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((c, i) => (
            <li
              key={i}
              className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-lg text-white"
            >
              <span>{c}</span>
              <button
                onClick={() => removeFavorite(c)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out hover:scale-105"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
