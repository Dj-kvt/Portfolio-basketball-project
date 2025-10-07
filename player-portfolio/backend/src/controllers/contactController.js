// src/controllers/contactController.js
import ContactMessage from '../models/ContactMessage.js';
import { sendEmail } from '../services/emailService.js';

/**
 * Envoi d’un message (coach → joueur)
 */
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, subject, message } = req.body;

    const contact = new ContactMessage({
      sender: req.user.id,
      recipient: recipientId,
      subject,
      message,
    });

    await contact.save();

    // Envoi d’un email via le service
    await sendEmail({
      to: req.body.recipientEmail,
      subject,
      text: message,
    });

    res.status(201).json({ message: 'Message envoyé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupérer les messages reçus (pour les joueurs)
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ recipient: req.user.id })
      .populate('sender', 'username role email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
