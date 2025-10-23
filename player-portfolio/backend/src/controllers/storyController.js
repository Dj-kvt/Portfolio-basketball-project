import Story from "../models/Story.js";
import { uploadToCloudinary } from "../services/uploadService.js";

/**
 * Créer une story
 */
export const uploadStory = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "Aucune image fournie." });
    }

    const result = await uploadToCloudinary(file.path, "stories");

    const story = await Story.create({
      userId: req.user.id,
      imageUrl: result.secure_url,
    });

    res.status(201).json({ success: true, story });
  } catch (error) {
    console.error("Erreur upload story:", error);
    res.status(500).json({ success: false, message: "Erreur lors de l’upload de la story." });
  }
};

/**
 * Récupérer toutes les stories valides (non expirées)
 */
export const getStories = async (req, res) => {
  try {
    const now = new Date();
    const stories = await Story.find({ expiresAt: { $gt: now } })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, stories });
  } catch (error) {
    console.error("Erreur récupération stories:", error);
    res.status(500).json({ success: false, message: "Impossible de récupérer les stories." });
  }
};

/**
 * Supprimer une story
 */
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: "Story introuvable." });
    }

    if (story.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Action non autorisée." });
    }

    await story.deleteOne();
    res.status(200).json({ success: true, message: "Story supprimée avec succès." });
  } catch (error) {
    console.error("Erreur suppression story:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression de la story." });
  }
};
