// frontend/src/api/postApi.js
import axios from "../utils/axiosInstance";

/**
 * 📰 Récupérer le flux public de posts
 * @returns {Promise<Array>} Liste des posts
 */
export const getFeed = async () => {
  try {
    const res = await axios.get("/posts");
    return res.data.posts || [];
  } catch (err) {
    console.error("❌ Erreur récupération feed posts:", err.response?.data || err.message);
    return [];
  }
};

/**
 * 📸 Récupérer toutes les stories actives
 * @returns {Promise<Array>} Liste des stories
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
 * ❤️ Liker / unliker un post
 * @param {string} postId - ID du post
 * @returns {Promise<Object>} { success, liked, likeCount }
 */
export const toggleLike = async (postId) => {
  try {
    const res = await axios.patch(`/posts/${postId}/like`);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur lors du like/unlike:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors du like/unlike" };
  }
};

/**
 * 📤 Créer un post
 * @param {Object|FormData} postData - Données du post (caption + mediaId)
 * @returns {Promise<Object>} { success, post }
 */
export const createPost = async (postData) => {
  try {
    const isFormData = postData instanceof FormData;
    const res = await axios.post("/posts", postData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  } catch (err) {
    console.error("❌ Erreur création post:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors de la création du post" };
  }
};

/**
 * 🗑️ Supprimer un post
 * @param {string} postId - ID du post
 * @returns {Promise<Object>} { success, message }
 */
export const deletePost = async (postId) => {
  try {
    const res = await axios.delete(`/posts/${postId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur suppression post:", err.response?.data || err.message);
    throw err.response?.data || { message: "Erreur lors de la suppression du post" };
  }
};

export const getUserPosts = async (userId) => {
  try {
    const res = await axios.get(`/posts/user/${userId}`);
    return res.data.posts || [];
  } catch (err) {
    console.error("❌ Erreur récupération posts user:", err);
    return [];
  }
};

export default {
  getFeed,
  getStories,
  toggleLike,
  createPost,
  deletePost,
  getUserPosts,
};
