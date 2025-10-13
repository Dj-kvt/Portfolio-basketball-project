import express from "express";
import {
  createProfile,
  getProfileById,
  updateProfile,
  getAllProfiles
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Profile routes
router.post("/", verifyToken, createProfile);        // POST /api/profiles
router.get("/", getAllProfiles);                     // GET /api/profiles
router.get("/:id", getProfileById);                  // GET /api/profiles/:id
router.put("/:id", verifyToken, updateProfile);      // PUT /api/profiles/:id

export default router;
