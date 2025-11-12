// frontend/src/api/mediaApi.js
import axios from "../utils/axiosInstance";

/**
 * 📤 Upload un média (image ou vidéo)
 * @param {File} file - fichier à uploader
 * @param {string} [caption] - texte optionnel
 * @returns {Promise<Object>} - { success, media }
 */
export const uploadMedia = async (file, caption = "") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (caption) formData.append("caption", caption);

    const res = await axios.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Erreur upload media:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors de l'upload du média" };
  }
};

/**
 * 📰 Récupérer le flux des médias publics
 * @returns {Promise<Array>} - tableau de médias
 */
export const getFeed = async () => {
  try {
    const res = await axios.get("/media/feed");
    return res.data.medias || [];
  } catch (err) {
    console.error("❌ Erreur récupération feed:", err.response?.data || err.message);
    return [];
  }
};

/**
 * 🗑️ Supprimer un média par ID
 * @param {string} id - ID du média à supprimer
 * @returns {Promise<Object>} - { success, message }
 */
export const deleteMedia = async (id) => {
  try {
    const res = await axios.delete(`/media/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur suppression média:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors de la suppression du média" };
  }
};

export default {
  uploadMedia,
  getFeed,
  deleteMedia,
};
