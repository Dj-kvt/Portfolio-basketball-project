// src/models/Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: { type: String, maxlength: 500 },
    position: String,
    team: String,
    stats: {
      height: Number,
      weight: Number,
      age: Number,
      nationality: String,
    },
    socialLinks: {
      instagram: String,
      twitter: String,
      tiktok: String,
      youtube: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
