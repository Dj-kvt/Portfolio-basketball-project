// src/controllers/contactController.js
import ContactMessage from "../models/ContactMessage.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

/**
 * ✉️ Envoi d’un message (recruteur ou joueur)
 * On peut envoyer un message à un utilisateur identifié par son username ou son email.
 */
export const sendMessage = async (req, res) => {
  try {
    const { recipientUsername, recipientEmail, subject, message } = req.body;

    // Vérification des champs obligatoires
    if (!message || (!recipientUsername && !recipientEmail)) {
      return res
        .status(400)
        .json({ message: "Le destinataire et le message sont obligatoires." });
    }

    // 🔍 Recherche du destinataire
    const recipient =
      (await User.findOne({ username: recipientUsername })) ||
      (await User.findOne({ email: recipientEmail }));

    if (!recipient) {
      return res.status(404).json({ message: "Destinataire introuvable." });
    }

    // 💾 Enregistrement du message dans la base
    const contact = new ContactMessage({
      sender: req.user.id,
      receiver: recipient._id,
      subject,
      message,
    });

    await contact.save();

    // 📬 Envoi d’un email via le service configuré (Mailjet / Nodemailer)
    await sendEmail(
      recipient.email,
      subject || `Nouveau message de ${req.user.username}`,
      message
    );

    res.status(201).json({ message: "Message envoyé avec succès." });
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi du message:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📥 Récupérer les messages reçus pour un joueur (par username)
 */
export const getMessagesForPlayer = async (req, res) => {
  try {
    const username = req.params.username;

    // Recherche du joueur
    const player = await User.findOne({ username });
    if (!player) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    // Récupération des messages reçus
    const messages = await ContactMessage.find({ receiver: player._id })
      .populate("sender", "username role email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des messages:", err);
    res.status(500).json({ message: err.message });
  }
};
