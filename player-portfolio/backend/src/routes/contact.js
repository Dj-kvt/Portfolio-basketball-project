import express from "express";
import { sendMessage, getMessagesForPlayer } from "../controllers/contactController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Seuls les recruteurs & joueurs peuvent envoyer un message
router.post("/", verifyToken, authorizeRoles("recruiter", "athlete"), sendMessage);

// Tous les utilisateurs connectés peuvent voir leurs messages
router.get("/:username", verifyToken, getMessagesForPlayer);

export default router;
