// frontend/src/api/contactApi.js
import axios from "./axiosInstance";

// ✉️ Envoyer un message de contact
export const sendContactMessage = async (data) => {
  const res = await axios.post("/contact", data);
  return res.data;
};
