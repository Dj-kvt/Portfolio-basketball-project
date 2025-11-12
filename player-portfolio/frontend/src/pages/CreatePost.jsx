import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../api/postApi";
import mediaApi from "../api/mediaApi";
import Loader from "../components/Common/Loader";

const CreatePost = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🎥 Active la caméra
  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(userStream);
      setCameraActive(true);
      if (videoRef.current) videoRef.current.srcObject = userStream;
    } catch (err) {
      console.error("Erreur accès caméra:", err);
      setError("Impossible d’accéder à la caméra.");
    }
  };

  // 🧹 Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  // 📷 Capture une photo depuis la caméra
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setFile(capturedFile);
      setPreview(URL.createObjectURL(capturedFile));
      stopCamera();
    }, "image/jpeg");
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraActive(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      stopCamera();
    }
  };

  // 🚀 Upload + création post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !caption) return setError("Ajoute un média ou une légende avant de publier.");

    try {
      setLoading(true);
      setError("");
      let mediaId = null;

      // 1️⃣ Upload fichier si présent
      if (file) {
        console.log("Upload fichier:", file);
        const mediaRes = await mediaApi.uploadMedia(file, caption);
        if (mediaRes.success && mediaRes.media) {
          mediaId = mediaRes.media._id;
        } else {
          throw new Error("Échec de l’upload du média.");
        }
      }

      // 2️⃣ Création post
      const postRes = await postApi.createPost({ caption, mediaId });
      if (!postRes.success) throw new Error(postRes.message || "Erreur création post");

      navigate("/reels");
    } catch (err) {
      console.error("❌ Erreur création post:", err);
      setError(err.message || "Échec de la publication.");
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
        <h1 className="text-lg font-semibold">Créer une publication</h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-md">
        {/* Zone d’affichage ou capture */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full object-cover rounded-xl" />
          ) : cameraActive ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full" />
              <canvas ref={canvasRef} className="hidden" />
              <button
                type="button"
                onClick={capturePhoto}
                className="absolute bottom-3 bg-white text-black px-4 py-2 rounded-full font-semibold"
              >
                Capturer
              </button>
            </>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 text-sm">Choisis un média ou capture une photo</p>
              <div className="flex gap-3 mt-4">
                <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                  Importer
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={startCamera}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  Caméra
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Légende */}
        <textarea
          placeholder="Ajoute une légende..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          rows="3"
        />

        {/* Bouton publier */}
        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl py-2 font-semibold disabled:opacity-50 transition">
          {loading ? <Loader small /> : "Partager"}
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
