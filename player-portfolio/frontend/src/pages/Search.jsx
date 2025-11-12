// src/pages/Search.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../api/searchApi";

const Search = () => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);

    try {
      const profiles = await searchUsers(username);
      setResults(profiles);
    } catch (err) {
      setError(err.message || "Aucun résultat trouvé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-50 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-black rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4 text-center">
          🔍 Rechercher un utilisateur
        </h2>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Entrez un nom d’utilisateur..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Rechercher
          </button>
        </form>

        {/* Message ou chargement */}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Recherche en cours...</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        {/* Liste des résultats */}
        {!loading && results.length > 0 && (
          <div className="mt-6 space-y-4">
            {results.map((profile) => (
              <div
                key={profile._id}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition cursor-pointer"
              >
                <div
                  className="flex items-center gap-3"
                  onClick={() => navigate(`/profile/${profile.user._id}`)}
                >
                  <img
                    src={
                      profile.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      @{profile.user.username}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {profile.bio || "Aucune bio disponible"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/profile/${profile.user._id}`)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Voir le profil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
