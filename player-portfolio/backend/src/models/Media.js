// src/models/Media.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    caption: {
      type: String,
      maxlength: 300,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["athlete", "recruiter", "fan"],
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
