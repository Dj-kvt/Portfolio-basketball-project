// src/services/emailService.js
import Mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

/**
 * Envoie un email via l'API Mailjet
 * @param {string} toEmail - Email du destinataire
 * @param {string} subject - Sujet de l’email
 * @param {string} message - Contenu du message (texte)
 */
export const sendEmail = async (toEmail, subject, message) => {
  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: "Player Portfolio",
          },
          To: [
            {
              Email: toEmail,
            },
          ],
          Subject: subject,
          TextPart: message,
          HTMLPart: `<p>${message}</p>`,
        },
      ],
    });

    console.log(`✅ Email envoyé à ${toEmail}:`, response.body.Messages[0].To[0].Email);
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l’envoi du mail:", error.message);
    throw new Error("Impossible d’envoyer l’email via Mailjet API");
  }
};
