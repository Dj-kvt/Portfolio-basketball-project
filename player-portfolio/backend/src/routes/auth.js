import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Auth routes
router.post("/register", register);     // POST /api/auth/register
router.post("/login", login);           // POST /api/auth/login
router.get("/me", verifyToken, getCurrentUser); // GET /api/auth/me

export default router;
