// frontend/src/api/userApi.js
import axios from "../utils/axiosInstance";

/**
 *  Récupérer tous les utilisateurs (ou profils publics)
 */
export const getAllUsers = async () => {
  const res = await axios.get("/profiles");
  return res.data;
};

/**
 *  Récupérer un utilisateur spécifique
 */
export const getUserById = async (userId) => {
  const res = await axios.get(`/profiles/${userId}`);
  return res.data;
};

/**
 * 🧩 Récupérer le profil du user actuellement connecté
 */
export const getCurrentUser = async () => {
  const res = await axios.get("/auth/me");
  return res.data;
};

/**
 * Mettre à jour le profil d’un utilisateur
 */
export const updateUserProfile = async (data) => {
  const res = await axios.put("/profiles/me", data);
  return res.data;
};

/**
 * (Optionnel) Suivre / Se désabonner d’un utilisateur
 */
export const toggleFollow = async (userId) => {
  const res = await axios.post(`/profiles/${userId}/follow`);
  return res.data;
};

export default {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  toggleFollow,
};
