import express from "express";
import { sendMessage, getMyMessages } from "../controllers/contactController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/contact : envoyer un message (recruiter ou athlete)
router.post("/", verifyToken, authorizeRoles("recruiter", "athlete"), sendMessage);

// GET /api/contact-me : récupérer tous les messages reçus pour l’utilisateur connecté
router.get("/me", verifyToken, getMyMessages);

export default router;
