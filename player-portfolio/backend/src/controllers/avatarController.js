// backend/src/controllers/avatarController.js
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import Media from "../models/Media.js";
import { uploadToCloudinary } from "../services/uploadService.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "Aucun fichier reçu." });

    // 🔹 Upload Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path, "avatars");
    if (!uploadResult?.secure_url)
      throw new Error("Cloudinary n'a pas renvoyé d'URL sécurisée.");

    // 🔹 Sauvegarder le média
    const media = await Media.create({
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: uploadResult.resource_type || "image",
      owner: req.user.id,
      visibility: "private",
    });

    // 🔹 Mettre à jour le user et le profil
    await User.findByIdAndUpdate(req.user.id, { avatar: media.fileUrl });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { avatar: media.fileUrl },
      { new: true, upsert: true }
    ).populate("user", "username email role avatar");

    res.status(201).json({
      success: true,
      message: "Avatar mis à jour avec succès.",
      avatar: media.fileUrl,
      profile,
    });
  } catch (err) {
    console.error("❌ Erreur upload avatar :", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'avatar.",
      error: err.message,
    });
  }
};
