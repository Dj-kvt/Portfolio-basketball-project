// src/routes/profiles.js
import express from "express";
import {
  createProfile,
  getProfileById,
  updateProfile,
  getAllProfiles,
  getMyProfile,
  followUser
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createProfile);
router.get("/", getAllProfiles);

router.get("/me", verifyToken, getMyProfile);

router.get("/:id", verifyToken, getProfileById);
router.put("/:id", verifyToken, updateProfile);
router.post("/:id/follow", verifyToken, followUser);

export default router;
