import Post from "../models/Post.js";
import Media from "../models/Media.js";

/**
 * 📤 Créer un nouveau post
 */
export const createPost = async (req, res) => {
  try {
    const { caption, mediaId, visibility } = req.body;

    const post = await Post.create({
      author: req.user.id,
      caption,
      media: mediaId || null,
      visibility: visibility || "public",
    });

    // Peupler les infos liées
    await post.populate([
      { path: "author", select: "username role" },
      { path: "media" },
    ]);

    res.status(201).json({
      success: true,
      post,
    });
  } catch (err) {
    console.error("❌ Erreur création post:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

/**
 * 📥 Récupérer tous les posts (feed public)
 */
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const posts = await Post.find({
      $or: [
        { visibility: "public" },
        userId ? { author: userId } : {}, // si connecté : aussi ses posts privés
      ],
    })
      .populate([
        { path: "author", select: "username role" },
        { path: "media" },
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.error("❌ Erreur récupération posts:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

/**
 * ❤️ Like / Unlike un post
 */
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post non trouvé" });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    await post.populate([{ path: "author", select: "username role" }, { path: "media" }]);

    res.status(200).json({
      success: true,
      liked: index === -1,
      likeCount: post.likes.length,
      post,
    });
  } catch (err) {
    console.error("❌ Erreur like/unlike:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

/**
 * 🗑️ Supprimer un post
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post non trouvé" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Non autorisé à supprimer ce post" });
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post supprimé" });
  } catch (err) {
    console.error("❌ Erreur suppression post:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// backend/controllers/postController.js
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Normalisation
    const formatted = posts.map((p) => ({
      ...p,
      media: Array.isArray(p.media)
        ? p.media.map((m) => ({
            fileUrl: m?.fileUrl || "/assets/default-post.jpg",
            fileType: m?.fileType || "image",
          }))
        : {
            fileUrl: p.media?.fileUrl || "/assets/default-post.jpg",
            fileType: p.media?.fileType || "image",
          },
      author: {
        ...p.author,
        avatar: p.author?.avatar || "/assets/default-avatar.png",
      },
    }));

    res.json({ success: true, posts: formatted });
  } catch (err) {
    console.error("❌ Erreur récupération posts user:", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des publications utilisateur",
      error: err.message,
    });
  }
};
