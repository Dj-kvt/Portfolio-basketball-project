# Player Portfolio Web — Rôle des fichiers et dossiers

Ce document explique le rôle de chaque fichier et dossier dans ton projet **Player Portfolio Web**, pour que toi et ton équipe sachiez exactement où placer et chercher le code.

---

## 1️⃣ Backend (`backend/`)

### `src/config/`

* **db.js** : configuration de la connexion MongoDB.
* **cloudinary.js** : configuration pour l’upload des médias vers Cloudinary.
* **jwt.js** : configuration et secret pour JWT (authentification).

### `src/controllers/`

* Contient la **logique métier** pour chaque ressource.
* **authController.js** : login, register.
* **profileController.js** : création, lecture, update de profils joueurs.
* **mediaController.js** : upload et récupération des médias.
* **contactController.js** : gestion des messages recruteur → joueur.

### `src/middleware/`

* Fonctions intermédiaires qui s’exécutent entre la requête et le controller.
* **authMiddleware.js** : vérifie le JWT et le rôle de l’utilisateur.
* **errorHandler.js** : gère les erreurs globales.
* **validateRequest.js** : valide les données entrantes.

### `src/models/`

* Définition des **schémas MongoDB**.
* **User.js** : utilisateurs (athlètes, recruteurs, fans).
* **Profile.js** : informations détaillées sur les joueurs.
* **Media.js** : images et vidéos uploadées.
* **ContactMessage.js** : messages envoyés par les recruteurs.

### `src/routes/`

* Définit les **endpoints API REST**.
* **auth.js** : `/api/auth/...`
* **profiles.js** : `/api/profiles/...`
* **media.js** : `/api/media/...`
* **contact.js** : `/api/contact`

### `src/services/`

* Contient des services externes ou utilitaires.
* **emailService.js** : envoi d’emails via SendGrid ou Nodemailer.
* **uploadService.js** : gestion des uploads vers Cloudinary.

### `src/utils/`

* Fonctions utilitaires partagées.
* **validators.js** : fonctions de validation (email, password, etc.)
* **helpers.js** : fonctions génériques (ex: formattage date).

### `src/app.js`

* Point d’entrée Express : initialise middlewares, routes, erreurs.

### `src/server.js`

* Lance le serveur Node.js sur le port défini.

### `tests/`

* Contient tests unitaires et d’intégration.
* **auth.test.js, profiles.test.js, media.test.js** : tests spécifiques à chaque module.

### `package.json`

* Dépendances backend et scripts NPM.

### `Dockerfile`

* Instructions pour construire l’image Docker du backend.

### `.env.example`

* Variables d’environnement à configurer (Mongo URI, JWT secret, Cloudinary keys).

---

## 2️⃣ Frontend (`frontend/`)

### `public/`

* Fichiers statiques.
* **index.html** : point d’entrée HTML.
* Favicon, images statiques.

### `src/assets/`

* Images, logos, icônes, fichiers statiques spécifiques à React.

### `src/components/`

* Composants réutilisables.
* Exemples : Navbar.jsx, Footer.jsx, Button.jsx.

### `src/features/`

* Fonctions spécifiques regroupées par domaine.
* **auth/** : Login.jsx, Register.jsx
* **dashboard/** : Dashboard.jsx, EditProfileForm.jsx
* **profiles/** : ProfilePage.jsx
* **feed/** : Feed.jsx

### `src/hooks/`

* Hooks React personnalisés (ex: `useAuth.js`).

### `src/layouts/`

* Layouts globaux pour les pages.
* PublicLayout.jsx : layout public.
* DashboardLayout.jsx : layout interne connecté.

### `src/pages/`

* Pages principales du site.
* Home.jsx, Contact.jsx, etc.

### `src/services/`

* Fichier central pour les appels API au backend.
* **api.js** : toutes les fonctions axios/fetch pour login, register, profiles, media.

### `src/store/`

* Gestion du state global (Redux Toolkit ou Context API).
* index.js : configuration store
* authSlice.js : state/auth actions

### `src/styles/`

* CSS global ou modules, Tailwind config si besoin.

### `App.jsx`

* Composant racine React : routes, providers, layout global.

### `main.jsx`

* Point d’entrée React, rend App.jsx dans DOM.

### `package.json`

* Dépendances frontend et scripts NPM.

### `Dockerfile`

* Instructions pour construire l’image Docker du frontend.

### `.env.example`

* Variables d’environnement frontend (ex: REACT_APP_API_URL).

---

## 3️⃣ DB (`db/`)

### `mongo-init.js`

* Script optionnel pour initialiser MongoDB local (users de test, index).

---

## 4️⃣ Docker / DevOps

### `docker-compose.yml`

* Orchestration multi-container : backend + frontend + db.
* Définit volumes, ports, dépendances.

### CI/CD (optionnel)

* Fichier workflow GitHub Actions (tests + build + déploiement).

---

## 5️⃣ Documentation (`docs/`)

* **technical-doc.md** : documentation technique complète, architecture, user stories.
* **api-reference.md** : description endpoints API REST.
* **architecture-diagram.png** : diagramme de l’architecture (frontend/backend/db).

---

> Avec cette documentation, chaque examinateur sait exactement **où se trouve quoi** et **le rôle de chaque fichier/dossier** dans le projet Player Portfolio Web.
