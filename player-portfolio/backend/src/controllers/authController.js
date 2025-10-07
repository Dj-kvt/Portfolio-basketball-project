// src/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Inscription d’un utilisateur
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Vérification basique
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Vérifie si l'utilisateur existe déjà
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'fan', // fan par défaut
    });
    await user.save();

    return res.status(201).json({ message: 'Compte créé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Connexion utilisateur
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Mot de passe incorrect.' });

    // Génère un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
