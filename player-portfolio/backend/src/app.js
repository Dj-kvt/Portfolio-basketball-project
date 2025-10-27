// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import mediaRoutes from './routes/media.js';
import contactRoutes from './routes/contact.js';
import postRoutes from './routes/posts.js';
import commentRoutes from "./routes/comments.js";
import storyRoutes from "./routes/stories.js";

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/stories", storyRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Player Portfolio API is running ✅');
});

// Error handling middleware
app.use(errorHandler);

export default app;
