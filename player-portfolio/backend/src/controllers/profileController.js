// src/controllers/profileController.js
import Profile from "../models/Profile.js";
import Post from "../models/Post.js"; // ✅ FIX manquant
import User from "../models/User.js";

/**
 * Créer ou mettre à jour un profil
 */
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      data,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupérer tous les profils
 */
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "username role");
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupérer un profil spécifique
 */
export const getProfileById = async (req, res) => {
  try {
    let userId = req.params.id;

    // ✅ Si "me" → profil personnel
    if (userId === "me") {
      if (!req.user) return res.status(401).json({ message: "Non authentifié" });
      userId = req.user.id;
    }

    const profile = await Profile.findOne({ user: userId })
      .populate("user", "username role email");

    if (!profile) return res.status(404).json({ message: "Profil introuvable" });

    // ✅ Récupération des posts
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

    res.json({ ...profile.toObject(), posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Récupérer le profil connecté
 */
export const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate("user");

    // ✅ Si le profil n’existe pas, on le crée automatiquement
    if (!profile) {
      profile = new Profile({ user: req.user.id });
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error("Erreur getMyProfile:", error.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};


/**
 * Mettre à jour un profil
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      data,
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profil introuvable" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/controllers/profileController.js
export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id; // ID de l'utilisateur connecté
    const targetProfileId = req.params.id; // ID du profil cible (celui à suivre)

    // Récupérer les profils
    const currentProfile = await Profile.findOne({ user: currentUserId });
    const targetProfile = await Profile.findById(targetProfileId);

    if (!currentProfile || !targetProfile) {
      return res.status(404).json({ message: "Profil introuvable." });
    }

    // ⚠️ Vérifie si on essaie de se suivre soi-même
    if (currentProfile.user.toString() === targetProfile.user.toString()) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même." });
    }

    // Vérifie si on suit déjà ce profil
    const isFollowing = currentProfile.following.includes(targetProfile.user);

    if (isFollowing) {
      // Unfollow
      currentProfile.following = currentProfile.following.filter(
        (id) => id.toString() !== targetProfile.user.toString()
      );
      targetProfile.followers = targetProfile.followers.filter(
        (id) => id.toString() !== currentProfile.user.toString()
      );
    } else {
      // Follow
      currentProfile.following.push(targetProfile.user);
      targetProfile.followers.push(currentProfile.user);
    }

    await currentProfile.save();
    await targetProfile.save();

    return res.status(200).json({
      success: true,
      following: !isFollowing,
      message: isFollowing ? "Unfollowed" : "Followed",
    });
  } catch (error) {
    console.error("❌ Erreur followUser:", error.message);
    return res.status(500).json({ message: "Erreur serveur lors du follow/unfollow." });
  }
};
