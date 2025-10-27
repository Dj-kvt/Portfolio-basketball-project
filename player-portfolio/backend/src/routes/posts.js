import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  toggleLike,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// 📤 Créer un post (protégé)
router.post("/", verifyToken, createPost);

// 📥 Récupérer tous les posts (feed public)
router.get("/", getAllPosts);

// ❤️ Like / Unlike un post
router.patch("/:id/like", verifyToken, toggleLike);

// 🗑️ Supprimer un post
router.delete("/:id", verifyToken, deletePost);

export default router;
