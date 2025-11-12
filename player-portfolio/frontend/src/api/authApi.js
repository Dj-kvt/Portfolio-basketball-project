// frontend/src/api/authApi.js
import axios from "../utils/axiosInstance";

// 🔐 Inscription
export const registerUser = async (userData) => {
  const res = await axios.post("/auth/register", userData);
  return res.data;
};

// 🔐 Connexion
export const loginUser = async (credentials) => {
  const res = await axios.post("/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// 👤 Récupérer l'utilisateur connecté (protégé par JWT)
export const getCurrentUser = async () => {
  const res = await axios.get("/auth/me");
  return res.data;
};

// 🚪 Déconnexion
export const logoutUser = () => {
  localStorage.removeItem("token");
};
