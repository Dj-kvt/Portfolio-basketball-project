import express from "express";
import { sendMessage, getMessagesForPlayer } from "../controllers/contactController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Contact routes
router.post("/", verifyToken, sendMessage);                 // POST /api/contact
router.get("/:playerId", verifyToken, getMessagesForPlayer); // GET /api/contact/:playerId

export default router;
