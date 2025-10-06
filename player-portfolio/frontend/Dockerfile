# Étape 1 : Image de base
FROM node:20-alpine

# Étape 2 : Répertoire de travail
WORKDIR /app

# Étape 3 : Copier package.json et installer dépendances
COPY package*.json ./
RUN npm install

# Étape 4 : Copier le reste du code
COPY . .

# Étape 5 : Construire le projet (pour production)
RUN npm run build

# Étape 6 : Exposer le port (Vite par défaut = 5173)
EXPOSE 5173

# Étape 7 : Commande par défaut
CMD ["npm", "run", "dev"]
