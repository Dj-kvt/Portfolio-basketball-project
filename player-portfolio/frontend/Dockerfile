# Étape 1 : Image de base légère
FROM node:20-alpine

# Étape 2 : Répertoire de travail
WORKDIR /app

# Étape 3 : Copier package.json et installer dépendances
COPY package*.json ./
RUN npm install


# Étape 4 : Copier le reste du code
COPY . .

# Étape 5 : Exposer le port de Vite
EXPOSE 5173

# Étape 6 : Lancer Vite en mode dev avec accès réseau
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
