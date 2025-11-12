// src/services/uploadService.js
import cloudinary from "../config/cloudinary.js";

/**
 * Upload un fichier sur Cloudinary
 * @param {string} filePath - chemin temporaire du fichier local
 * @param {string} folder - dossier Cloudinary (ex: "posts", "profiles", "stories")
 */
export const uploadToCloudinary = async (filePath, folder = "media") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // auto: image ou vidéo
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error);
    throw new Error("Échec de l’upload sur Cloudinary");
  }
};

/**
 * Supprime un fichier de Cloudinary
 * @param {string} publicId - identifiant public du fichier
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Média supprimé de Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Erreur suppression Cloudinary:", error);
    throw new Error("Échec de la suppression sur Cloudinary");
  }
};
