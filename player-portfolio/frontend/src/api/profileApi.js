// frontend/src/api/profileApi.js
import axios from "../utils/axiosInstance";

// Tous les profils
export const getAllProfiles = async () => {
  const res = await axios.get("/profiles");
  return res.data;
};

// Profil par ID
export const getProfileById = async (id) => {
  const res = await axios.get(`/profiles/${id}`);
  return res.data;
};

// Profil connecté
export const getMyProfile = async () => {
  const res = await axios.get("/profiles/me");
  return res.data;
};

// Mise à jour du profil
export const updateProfile = async (id, data) => {
  const res = await axios.put(`/profiles/${id}`, data);
  return res.data;
};

// Upload avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await axios.post("/avatar/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Follow / Unfollow
export const followUser = async (userId) => {
  const res = await axios.post(`/profiles/${userId}/follow`);
  return res.data;
};

export default {
  getAllProfiles,
  getProfileById,
  getMyProfile,
  updateProfile,
  uploadAvatar,
  followUser,
};
