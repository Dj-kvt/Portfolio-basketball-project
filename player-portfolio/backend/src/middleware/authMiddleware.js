// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    // Décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Recherche complète de l'utilisateur
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Ajout explicite des champs nécessaires
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("❌ Erreur verifyToken:", error);
    res.status(401).json({ message: "Token invalide ou expiré.", error: error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    next();
  };
};
