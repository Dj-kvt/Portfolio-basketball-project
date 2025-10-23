import Post from "../models/Post.js";
import Media from "../models/Media.js";

/**
 * 📤 Créer un nouveau post
 * - L'utilisateur doit être connecté (token)
 * - Peut contenir un texte + un média (facultatif)
 */
export const createPost = async (req, res) => {
  try {
    const { caption, mediaId } = req.body;

    const newPost = await Post.create({
      author: req.user.id,
      caption,
      media: mediaId || null,
    });

    const populatedPost = await newPost.populate("author", "username role");

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    console.error("❌ Erreur création post:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la création du post." });
  }
};

/**
 * 📥 Récupérer tous les posts pour le feed (public)
 * - Trie par date décroissante
 * - Affiche auteur et média
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: "public" })
      .populate("author", "username role")
      .populate("media", "fileUrl fileType")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("❌ Erreur récupération posts:", error);
    res.status(500).json({ success: false, message: "Impossible de récupérer les posts." });
  }
};

/**
 * ❤️ Like / Unlike un post
 * - Si l'utilisateur a déjà liké → on retire son like
 * - Sinon → on ajoute son like
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post introuvable." });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ success: true, liked: !hasLiked, likeCount: post.likes.length });
  } catch (error) {
    console.error("❌ Erreur toggle like:", error);
    res.status(500).json({ success: false, message: "Erreur lors de l’action de like/unlike." });
  }
};

/**
 * 🗑️ Supprimer un post
 * - Seul l’auteur ou un admin peut le supprimer
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post introuvable." });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Action non autorisée." });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: "Post supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression post:", error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression du post." });
  }
};
