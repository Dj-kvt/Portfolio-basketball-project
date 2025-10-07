// backend/src/config/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // temps d'expiration
  });
};

module.exports = generateToken;
