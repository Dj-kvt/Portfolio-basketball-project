import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 📬 Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true pour 465, false pour les autres
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envoie un email
 * @param {string} to - Adresse du destinataire
 * @param {string} subject - Sujet de l’email
 * @param {string} text - Contenu texte brut
 * @param {string} html - Contenu HTML optionnel
 */
export const sendEmail = async (to, subject, text, html = "") => {
  try {
    const mailOptions = {
      from: `"Player Portfolio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Erreur d’envoi d’email:", error);
    throw new Error("Impossible d’envoyer l’email");
  }
};
