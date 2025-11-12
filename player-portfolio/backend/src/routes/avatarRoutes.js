import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../controllers/avatarController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // stockage temporaire local avant Cloudinary

// 📸 Upload avatar
router.post("/upload", verifyToken, upload.single("avatar"), uploadAvatar);

export default router;
