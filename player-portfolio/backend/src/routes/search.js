// src/routes/search.js
import express from "express";
import { searchUserByUsername } from "../controllers/searchcontroller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/search?username=NomUtilisateur
router.get("/", verifyToken, searchUserByUsername);

export default router;