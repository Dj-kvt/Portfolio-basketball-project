// frontend/src/api/postApi.js
import axios from "../utils/axiosInstance";

// 📥 Récupérer le flux de publications
export const getFeed = async () => {
  const res = await axios.get("/posts");
  return res.data.posts || res.data; // tolérant aux formats
};

// 📤 Créer un post (upload image + texte)
export const createPost = async (file, caption) => {
  const formData = new FormData();
  formData.append("file", file);
  if (caption) formData.append("caption", caption);

  const res = await axios.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ❤️ Like/unlike un post
export const toggleLike = async (postId) => {
  const res = await axios.post(`/posts/${postId}/like`);
  return res.data;
};

// 🗑️ Supprimer un post
export const deletePost = async (postId) => {
  const res = await axios.delete(`/posts/${postId}`);
  return res.data;
};

export default {
  getFeed,
  createPost,
  toggleLike,
  deletePost,
};
