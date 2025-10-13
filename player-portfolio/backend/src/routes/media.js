import express from "express";
import multer from "multer";
import { uploadMedia, getFeed, deleteMedia } from "../controllers/mediaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🧩 Media routes
router.post("/upload", verifyToken, upload.single("file"), uploadMedia); // POST /api/media/upload
router.get("/feed", getFeed);                                            // GET /api/media/feed
router.delete("/:id", verifyToken, deleteMedia);                         // DELETE /api/media/:id

export default router;
