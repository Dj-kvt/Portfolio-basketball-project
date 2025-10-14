// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    // Vérifier la présence du token dans l’en-tête
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Charger l’utilisateur associé (exclure le mot de passe)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    req.user = user; // Attacher l’utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré.", error: error.message });
  }
};
