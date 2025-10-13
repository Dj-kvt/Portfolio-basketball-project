import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ⚙️ Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload un fichier sur Cloudinary
 * @param {string} filePath - chemin temporaire du fichier local
 * @param {string} folder - dossier Cloudinary (ex: 'athletes', 'fans')
 */
export const uploadToCloudinary = async (filePath, folder = "media") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // détecte automatiquement image/vidéo
    });

    return result.secure_url; // retourne l’URL publique
  } catch (error) {
    console.error("❌ Erreur upload Cloudinary:", error);
    throw new Error("Échec de l’upload du média");
  }
};

/**
 * Supprime un fichier de Cloudinary (optionnel)
 * @param {string} publicId - identifiant du fichier sur Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Média supprimé: ${publicId}`);
  } catch (error) {
    console.error("❌ Erreur suppression Cloudinary:", error);
    throw new Error("Échec suppression média");
  }
};
