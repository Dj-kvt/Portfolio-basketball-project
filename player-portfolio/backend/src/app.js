// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import mediaRoutes from "./routes/media.js";
import contactRoutes from "./routes/contact.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import storyRoutes from "./routes/stories.js";
import avatarRoutes from "./routes/avatarRoutes.js";
import userRoutes from "./routes/users.js";
import searchRoutes from "./routes/search.js";

import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// 🌐 Configuration CORS
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// ⚙️ Middleware — IMPORTANT : laisser multer gérer les uploads
// Ces parsers ne doivent pas intercepter les requêtes multipart !
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 100000, // augmente le nombre max de paramètres
  })
);

app.use(morgan("dev"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/posts", postRoutes); // multer gère ici dans la route elle-même
app.use("/api/comments", commentRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Player Portfolio API is running ✅");
});

// 🧱 Gestion globale des erreurs
app.use(errorHandler);

export default app;
