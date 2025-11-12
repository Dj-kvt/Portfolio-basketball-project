import Media from "../models/Media.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/uploadService.js";

/**
 * Upload d'un média (image ou vidéo)
 * - Vérifie que le fichier est présent
 * - Upload sur Cloudinary
 * - Sauvegarde dans MongoDB avec owner
 */
export const uploadMedia = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "Aucun fichier fourni." });
    }

    const result = await uploadToCloudinary(file.path, "media");

    const media = await Media.create({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: file.mimetype.startsWith("video") ? "video" : "image",
      owner: req.user.id,
      uploadedAt: new Date(),
    });

    res.status(201).json({ success: true, media });
  } catch (error) {
    console.error("Erreur upload media:", error);
    res.status(500).json({ success: false, message: "Erreur lors de l’upload du média." });
  }
};

/**
 * Récupération du feed public
 * - Trie par date décroissante
 * - Popule les infos de l'owner
 */
export const getFeed = async (req, res) => {
  try {
    const medias = await Media.find()
      .populate("owner", "username role")
      .sort({ uploadedAt: -1 });

    res.status(200).json({ success: true, medias });
  } catch (error) {
    console.error("Erreur récupération médias:", error);
    res.status(500).json({ success: false, message: "Impossible de récupérer les médias." });
  }
};

/**
 * Suppression d'un média
 * - Vérifie que l'utilisateur est owner ou admin
 * - Supprime le média sur Cloudinary si publicId existant
 * - Supprime le document MongoDB
 */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Média introuvable." });
    }

    if (media.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Action non autorisée." });
    }

    if (media.publicId) {
      await deleteFromCloudinary(media.publicId);
    }

    await media.deleteOne();
    res.status(200).json({ success: true, message: "Média supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression média:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression du média." });
  }
};
