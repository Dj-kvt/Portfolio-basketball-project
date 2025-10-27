// src/api/postApi.js
import axios from "../utils/axiosInstance";

// Récupérer le feed public
export const getFeed = async () => {
  try {
    const res = await axios.get("/posts"); // backend route: GET /posts
    return res.data.posts || res.data; // s'assure de retourner un tableau
  } catch (err) {
    console.error("Error fetching feed:", err);
    return [];
  }
};

// Récupérer les stories (si tu en as)
export const getStories = async () => {
  try {
    const res = await axios.get("/stories"); // exemple
    return res.data.stories || res.data;
  } catch (err) {
    console.error("Error fetching stories:", err);
    return [];
  }
};

// Liker / unliker un post
export const toggleLike = async (postId) => {
  try {
    const res = await axios.patch(`/posts/${postId}/like`);
    return res.data;
  } catch (err) {
    console.error("Error toggling like:", err);
  }
};

// Créer un post
export const createPost = async (postData) => {
  try {
    const res = await axios.post("/posts", postData);
    return res.data;
  } catch (err) {
    console.error("Error creating post:", err);
  }
};

// Supprimer un post
export const deletePost = async (postId) => {
  try {
    const res = await axios.delete(`/posts/${postId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting post:", err);
  }
};

// Export par défaut (pour ton import actuel)
export default {
  getFeed,
  getStories,
  toggleLike,
  createPost,
  deletePost,
};
