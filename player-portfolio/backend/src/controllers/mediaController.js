// src/controllers/mediaController.js
import Media from "../models/Media.js";
import { uploadToCloudinary } from "../services/uploadService.js";

/**
 * Upload un média (image/vidéo)
 * - Athlètes, recruteurs et fans peuvent uploader
 * - Fichier stocké sur Cloudinary
 */
export const uploadMedia = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "Aucun fichier fourni." });
    }

    // Envoi sur Cloudinary
    const result = await uploadToCloudinary(file.path);

    // Création d’un document Media
    const media = await Media.create({
      fileUrl: result.secure_url,
      fileType: file.mimetype.startsWith("video") ? "video" : "image",
      uploadedBy: req.user.id, // ID de l'utilisateur connecté
      role: req.user.role, // "athlete", "recruiter" ou "fan"
      uploadedAt: new Date(),
    });

    res.status(201).json({ success: true, media });
  } catch (error) {
    console.error("Erreur upload media:", error);
    res.status(500).json({ success: false, message: "Erreur lors de l’upload du média." });
  }
};

/**
 * Récupérer tous les médias pour le feed public
 * - Accessible à tous les rôles (fans, recruteurs, athlètes)
 * - Tri par date décroissante
 */
export const getAllMedia = async (req, res) => {
  try {
    const medias = await Media.find().populate("uploadedBy", "username role").sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, medias });
  } catch (error) {
    console.error("Erreur récupération médias:", error);
    res.status(500).json({ success: false, message: "Impossible de récupérer les médias." });
  }
};

/**
 * Supprimer un média (seulement pour le propriétaire ou un admin)
 */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: "Média introuvable." });

    // Vérifie si l’utilisateur est le propriétaire
    if (media.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Action non autorisée." });
    }

    await media.deleteOne();
    res.status(200).json({ success: true, message: "Média supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression média:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression du média." });
  }
};
