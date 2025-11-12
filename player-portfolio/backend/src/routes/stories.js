// src/routes/stories.js
import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadStory, getStories, deleteStory } from "../controllers/storyController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // stockage temporaire

// 📤 Upload d'une story
router.post("/upload", verifyToken, upload.single("image"), uploadStory);

// 📥 Récupérer toutes les stories actives
router.get("/", getStories);

// 🗑️ Supprimer une story
router.delete("/:id", verifyToken, deleteStory);

export default router;
