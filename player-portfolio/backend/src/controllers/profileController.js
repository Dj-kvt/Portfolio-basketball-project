// src/controllers/profileController.js
import Profile from '../models/Profile.js';

/**
 * Créer ou mettre à jour un profil de joueur
 */
export const upsertProfile = async (req, res) => {
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
 * Récupérer tous les profils (visible pour tous)
 */
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'username role');
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
    const profile = await Profile.findById(req.params.id).populate('user', 'username role');
    if (!profile) return res.status(404).json({ message: 'Profil introuvable' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
