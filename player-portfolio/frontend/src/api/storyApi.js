// frontend/src/api/storyApi.js
import axios from "../utils/axiosInstance";

/**
 * 📤 Upload une story (image ou vidéo)
 * @param {File} file - fichier à uploader
 * @returns {Promise<Object>} { success, story }
 */
export const uploadStory = async (file) => {
  try {
    const formData = new FormData();
    // ⚠️ le champ doit s'appeler "image" (comme dans ton backend multer)
    formData.append("image", file);

    const res = await axios.post("/stories/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Erreur upload story:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors de l'upload de la story" };
  }
};

/**
 * 👀 Récupérer toutes les stories actives
 * @returns {Promise<Array>} liste des stories
 */
export const getStories = async () => {
  try {
    const res = await axios.get("/stories");
    return res.data.stories || [];
  } catch (err) {
    console.error("❌ Erreur récupération stories:", err.response?.data || err.message);
    return [];
  }
};

/**
 * 🗑️ Supprimer une story
 * @param {string} id - ID de la story
 * @returns {Promise<Object>} { success, message }
 */
export const deleteStory = async (id) => {
  try {
    const res = await axios.delete(`/stories/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur suppression story:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors de la suppression de la story" };
  }
};

export default {
  uploadStory,
  getStories,
  deleteStory,
};
