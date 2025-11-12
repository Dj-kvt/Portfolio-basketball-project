// src/api/searchApi.js
import axios from "../utils/axiosInstance";

export const searchUsers = async (username) => {
  try {
    const res = await axios.get(`/search?username=${encodeURIComponent(username)}`);
    return res.data.profiles;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { message: "Erreur de connexion au serveur." };
  }
};
