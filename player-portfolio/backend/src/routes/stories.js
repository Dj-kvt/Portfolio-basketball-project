import express from "express";
import multer from "multer";
import { uploadStory, getStories, deleteStory } from "../controllers/storyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🧩 Story routes
router.post("/upload", verifyToken, upload.single("image"), uploadStory); // POST /api/stories/upload
router.get("/", verifyToken, getStories);                                 // GET /api/stories
router.delete("/:id", verifyToken, deleteStory);                          // DELETE /api/stories/:id

export default router;
