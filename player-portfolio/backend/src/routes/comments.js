// src/routes/comments.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// POST /api/comments
router.post("/", verifyToken, addComment);

// GET /api/comments/:mediaId
router.get("/:mediaId", getComments);

// DELETE /api/comments/:id
router.delete("/:id", verifyToken, deleteComment);

export default router;
