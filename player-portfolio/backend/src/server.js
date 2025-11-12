// src/server.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import "./config/cloudinary.js"; // ✅ Configuration Cloudinary chargée ici

dotenv.config();

// 🔌 Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

// 🚀 Lancement du serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
