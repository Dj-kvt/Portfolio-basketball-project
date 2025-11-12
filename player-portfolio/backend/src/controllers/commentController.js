// src/controllers/commentController.js
import Comment from "../models/Comment.js";

/**
 * Ajouter un commentaire à un média
 */
export const addComment = async (req, res) => {
  try {
    const { mediaId, text } = req.body;

    if (!text) return res.status(400).json({ success: false, message: "Comment text is required." });

    const comment = await Comment.create({
      text,
      user: req.user.id,
      media: mediaId,
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment." });
  }
};

/**
 * Récupérer les commentaires d’un média
 */
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ media: req.params.mediaId })
      .populate("user", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Unable to fetch comments." });
  }
};

/**
 * Supprimer un commentaire
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized action." });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Failed to delete comment." });
  }
};
