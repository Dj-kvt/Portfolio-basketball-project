import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    publicId: { type: String },
    fileType: { type: String, enum: ["image", "video"], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
