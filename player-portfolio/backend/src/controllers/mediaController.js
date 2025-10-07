// src/controllers/mediaController.js
import Media from '../models/Media.js';
import { uploadToCloudinary } from '../services/uploadService.js';

/**
 * Upload d’un média (joueurs et fans)
 */
export const uploadMedia = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ message: 'Aucun fichier uploadé' });

    const result = await uploadToCloudinary(file.path);

    const media = new Media({
      user: req.user.id,
      url: result.secure_url,
      type: result.resource_type,
      caption: req.body.caption || '',
    });
    await media.save();

    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Feed public : accessible à tous
 */
export const getPublicFeed = async (req, res) => {
  try {
    const media = await Media.find()
      .populate('user', 'username role')
      .sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
