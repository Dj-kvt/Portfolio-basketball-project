import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  toggleLike,
} from "../controllers/postController.js";
import { getUserPosts } from "../controllers/postController.js";

const router = express.Router();

// 📤 Créer un post (protégé)
router.post("/", verifyToken, createPost);

// 📥 Récupérer tous les posts (feed public)
router.get("/", verifyToken, getAllPosts);

router.get("/user/:id", verifyToken, getUserPosts);

// ❤️ Like / Unlike un post
router.patch("/:id/like", verifyToken, toggleLike);


export default router;
