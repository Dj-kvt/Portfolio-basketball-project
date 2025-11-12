// frontend/src/pages/CreateStory.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import storyApi from "../api/storyApi";
import Loader from "../components/Common/Loader";

const CreateStory = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🎞️ Sélection d'un média
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 🚀 Soumission de la story
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Choisis une image ou une vidéo avant de publier.");

    try {
      setLoading(true);
      setError("");

      // ✅ Upload via storyApi (champ 'image' attendu par le backend)
      const res = await storyApi.uploadStory(file);
      if (!res.success) throw new Error("Échec de l’upload de la story.");

      // Redirection vers Home
      navigate("/home");
    } catch (err) {
      console.error("❌ Erreur création story:", err);
      setError(err.message || "Impossible de publier la story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <header className="w-full flex justify-between items-center py-3 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          ← Retour
        </button>
        <h1 className="text-lg font-semibold">Créer une story</h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-md">
        {/* Preview */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center overflow-hidden aspect-square">
          {preview ? (
            file.type.startsWith("video") ? (
              <video src={preview} controls className="w-full h-full object-contain" />
            ) : (
              <img src={preview} alt="preview" className="w-full h-full object-contain" />
            )
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-gray-400"
            >
              + Sélectionner un média
            </button>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <textarea
          placeholder="Ajoute une légende (optionnel)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          rows="3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl py-2 font-semibold disabled:opacity-50 transition"
        >
          {loading ? <Loader small /> : "Partager ma story"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default CreateStory;
