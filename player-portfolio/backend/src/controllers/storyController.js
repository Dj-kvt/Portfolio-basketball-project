// src/controllers/storyController.js
import Story from "../models/Story.js";
import Media from "../models/Media.js";
import { uploadToCloudinary } from "../services/uploadService.js";

// 📤 Upload + création d'une story
export const uploadStory = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Aucun fichier reçu." });
    }

    console.log("📸 Fichier reçu :", req.file.path);

    // ✅ On récupère toutes les infos depuis Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path, "stories");

    console.log("☁️ Cloudinary upload réussi :", uploadResult);

    // ✅ Création du média (on utilise les champs corrects)
    const media = await Media.create({
      fileUrl: uploadResult.secure_url, // ✅ on stocke seulement l’URL publique
      publicId: uploadResult.public_id, // utile si on veut le supprimer plus tard
      fileType: uploadResult.resource_type || "image",
      owner: req.user.id,
      visibility: "public",
    });

    console.log("🧩 Média créé :", media._id);

    // ✅ Création de la story
    const story = await Story.create({
      user: req.user.id,
      media: media._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });

    console.log("✅ Story créée :", story._id);

    // ✅ Peupler les données liées
    const populatedStory = await story.populate([
      { path: "user", select: "username role" },
      { path: "media", select: "fileUrl fileType" },
    ]);

    res.status(201).json({ success: true, story: populatedStory });
  } catch (err) {
    console.error("❌ Erreur détaillée :", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la story.",
      error: err.message,
    });
  }
};

// 📥 Récupérer toutes les stories actives
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate({ path: "user", select: "username role" })
      .populate({ path: "media", select: "fileUrl fileType" })
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (err) {
    console.error("❌ Erreur récupération stories:", err);
    res
      .status(500)
      .json({ success: false, message: "Erreur de récupération des stories." });
  }
};

// 🗑️ Supprimer une story
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story introuvable." });
    }

    if (story.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Action non autorisée." });
    }

    await story.deleteOne();
    res.json({ success: true, message: "Story supprimée." });
  } catch (err) {
    console.error("❌ Erreur suppression story:", err);
    res
      .status(500)
      .json({ success: false, message: "Erreur suppression story." });
  }
};
