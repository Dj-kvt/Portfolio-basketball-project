import ContactMessage from "../models/ContactMessage.js";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

/**
 * ✉️ Envoyer un message à un utilisateur
 * Accessible pour recruiter ou athlete
 */
export const sendMessage = async (req, res) => {
  try {
    let { recipientId, recipientEmail, message, subject } = req.body;

    if (!recipientId && !recipientEmail) {
      return res.status(400).json({ message: "Aucun destinataire spécifié." });
    }

    if (!message) {
      return res.status(400).json({ message: "Le message est obligatoire." });
    }

    // 🔍 Trouver le destinataire soit par ID, soit par email
    const recipient = recipientId
      ? await User.findById(recipientId)
      : await User.findOne({ email: recipientEmail });

    if (!recipient) {
      return res.status(404).json({ message: "Destinataire introuvable." });
    }

    // ✅ Créer le message
    const contact = new ContactMessage({
      sender: req.user.id,
      receiver: recipient._id,
      subject,
      message,
    });
    await contact.save();

    // ✅ Envoi de l’email via Mailjet
    await sendEmail(
      recipient.email,
      subject || `Nouveau message de ${req.user.username}`,
      message
    );

    return res.status(201).json({
      success: true,
      message: "Message envoyé avec succès.",
    });
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi du message:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📥 Récupérer tous les messages reçus pour l’utilisateur connecté
 */
export const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await ContactMessage.find({ receiver: userId })
      .populate("sender", "username role email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("❌ Erreur récupération messages:", err);
    res.status(500).json({ message: err.message });
  }
};
