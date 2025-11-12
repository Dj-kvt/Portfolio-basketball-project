// src/models/Story.js
import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

// 🧹 Supprime automatiquement les stories expirées
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Story", storySchema);
