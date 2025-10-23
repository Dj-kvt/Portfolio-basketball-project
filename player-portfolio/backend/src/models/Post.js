import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media", // 🔗 Lien vers ton modèle Media existant
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Qui a liké ce post
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// méthode pour vérifier si un user a liké
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId);
};

export default mongoose.model("Post", postSchema);
