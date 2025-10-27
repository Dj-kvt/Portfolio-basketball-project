// frontend/src/api/storyApi.js
import axios from "../utils/axiosInstance";

// 📤 Upload une story
const uploadStory = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post("/stories/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 👀 Récupérer toutes les stories actives
const getStories = async () => {
  const res = await axios.get("/stories");
  return res.data;
};

// 🗑️ Supprimer une story
const deleteStory = async (id) => {
  const res = await axios.delete(`/stories/${id}`);
  return res.data;
};

// Export par défaut pour pouvoir faire : import storyApi from "../api/storyApi"
export default {
  uploadStory,
  getStories,
  deleteStory,
};
