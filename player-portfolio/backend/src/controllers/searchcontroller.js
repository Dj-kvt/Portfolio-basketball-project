// src/controllers/searchController.js
import User from "../models/User.js";
import Profile from "../models/Profile.js";

/**
 * Rechercher des utilisateurs par username (recherche floue, non sensible à la casse)
 */
export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Le paramètre 'username' est requis." });
    }

    // 🔍 Recherche floue avec regex
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });

    if (!users.length) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    // Récupérer les profils associés
    const profiles = await Profile.find({ user: { $in: users.map(u => u._id) } })
      .populate("user", "username email role")
      .limit(10);

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("❌ Erreur searchUserByUsername:", error.message);
    return res.status(500).json({ message: "Erreur serveur lors de la recherche." });
  }
};
