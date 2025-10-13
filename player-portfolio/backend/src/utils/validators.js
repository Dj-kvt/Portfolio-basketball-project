// src/utils/validators.js

/**
 * Vérifie si un email a un format valide
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Vérifie la force d’un mot de passe
 * Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
 */
export const isStrongPassword = (password) => {
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passRegex.test(password);
};

/**
 * Vérifie que le rôle utilisateur est valide
 */
export const isValidRole = (role) => {
  const allowedRoles = ['athlete', 'recruiter', 'fan'];
  return allowedRoles.includes(role);
};

/**
 * Vérifie si le type de média est accepté
 */
export const isValidMediaType = (mimetype) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
  return allowedTypes.includes(mimetype);
};
