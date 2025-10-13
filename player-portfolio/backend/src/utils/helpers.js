// src/utils/helpers.js

import crypto from 'crypto';

/**
 * Génère un identifiant unique aléatoire (utile pour médias ou tokens)
 */
export const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Formate une date pour affichage lisible
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Crée un objet de réponse d’erreur standardisé
 */
export const createErrorResponse = (message, code = 400) => {
  return {
    success: false,
    code,
    message,
  };
};

/**
 * Nettoie les objets sensibles avant envoi au frontend
 */
export const sanitizeUser = (user) => {
  const { passwordHash, __v, ...safeData } = user.toObject();
  return safeData;
};
