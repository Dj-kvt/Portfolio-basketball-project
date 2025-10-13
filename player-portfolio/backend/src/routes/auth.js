// src/routes/auth.js
import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Route d'inscription
// Body attendu (JSON) : 
// {
//   "username": "JohnDoe",
//   "email": "john@example.com",
//   "password": "password123",
//   "role": "athlete",           // optionnel
//   "dateOfBirth": "2000-01-01", // optionnel
//   "placeOfBirth": "Paris",     // optionnel
//   "country": "France",         // optionnel
//   "postalCode": "75001"        // optionnel
// }
router.post("/register", register);

// 🧩 Route de connexion
// Body attendu (JSON) : { "email": "...", "password": "..." }
router.post("/login", login);

// 🧩 Récupérer l'utilisateur courant (JWT nécessaire)
router.get("/me", verifyToken, getCurrentUser);

export default router;
