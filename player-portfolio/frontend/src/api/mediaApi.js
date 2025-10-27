// frontend/src/api/mediaApi.js
import axios from "./axiosInstance";

// 📤 Upload un média (image ou vidéo)
export const uploadMedia = async (file, caption = "") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("caption", caption);

  const res = await axios.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// 📰 Récupérer le feed (tous les médias)
export const getFeed = async () => {
  const res = await axios.get("/media/feed");
  return res.data;
};

// 🗑️ Supprimer un média
export const deleteMedia = async (id) => {
  const res = await axios.delete(`/media/${id}`);
  return res.data;
};
