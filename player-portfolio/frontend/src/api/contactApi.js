import axios from "../utils/axiosInstance";

// Envoyer un message
export const sendContactMessage = async (data) => {
  const res = await axios.post("/contact", data);
  return res.data;
};

// Récupérer tous les messages reçus pour l'utilisateur connecté
export const getMyMessages = async () => {
  const res = await axios.get("/contact/me");
  return res.data;
};

const contactApi = { sendContactMessage, getMyMessages };
export default contactApi;
