import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, maxlength: 500, trim: true, default: "" },
    media: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    visibility: { type: String, enum: ["public", "private"], default: "public" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

postSchema.methods.isLikedBy = function (userId) {
  if (!userId) return false;
  return this.likes.some((id) => id.toString() === userId.toString());
};

postSchema.methods.isPublic = function () {
  return this.visibility === "public";
};

export default mongoose.model("Post", postSchema);
