// src/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

/**
 *  Inscription d’un utilisateur
 * - Tous les champs requis (pas d'utilisateur incomplet)
 */
export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      dateOfBirth,
      placeOfBirth,
      country,
      postalCode,
    } = req.body;

    //  Vérification stricte : tous les champs sont requis
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !dateOfBirth ||
      !placeOfBirth ||
      !country ||
      !postalCode
    ) {
      return res.status(400).json({
        message:
          "Tous les champs sont requis : username, email, password, role, dateOfBirth, placeOfBirth, country, postalCode.",
      });
    }

    //  Vérifie si l'utilisateur existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    //  Hash sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Création du nouvel utilisateur
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      dateOfBirth,
      placeOfBirth,
      country,
      postalCode,
    });

    await user.save();

    return res.status(201).json({
      message: "Compte créé avec succès.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        placeOfBirth: user.placeOfBirth,
        country: user.country,
        postalCode: user.postalCode,
      },
    });
  } catch (err) {
    console.error("Erreur inscription:", err);
    res.status(500).json({ message: "Erreur lors de la création du compte." });
  }
};

/**
 * 🔐 Connexion utilisateur
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie que les champs sont fournis
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe sont requis." });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Vérifie le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect." });

    // Génère un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        placeOfBirth: user.placeOfBirth,
        country: user.country,
        postalCode: user.postalCode,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error("Erreur connexion:", err);
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

/**
 *  Récupérer les infos de l’utilisateur courant
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.json(user);
  } catch (err) {
    console.error("Erreur récupération utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};
