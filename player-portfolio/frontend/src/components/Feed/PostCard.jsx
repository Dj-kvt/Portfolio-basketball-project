import React, { useState } from "react";
import { Link } from "react-router-dom";
import postApi from "../../api/postApi";
import { User } from "lucide-react"; // ✅ icône "bonhomme"

const Icon = ({ children }) => (
  <div className="w-8 h-8 flex items-center justify-center">{children}</div>
);

const PostCard = ({ post, currentUserId }) => {
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId) || false);
  const [likes, setLikes] = useState(post.likes?.length || 0);

  const author = post.author || {};
  const username = author.username || "unknown";
  const avatar = author.avatar; // ✅ on ne met plus de chemin par défaut ici

  const media = post.media;
  const mediaUrl = media?.fileUrl || "/assets/default-post.jpg";
  const mediaType = media?.fileType || "image";
  const caption = post.caption || "";

  const handleLike = async () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    try {
      await postApi.toggleLike(post._id);
    } catch (err) {
      console.error("❌ Like error:", err);
    }
  };

  return (
    <article className="mb-6 bg-black rounded-md border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author._id}`}>
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                <User className="text-gray-400 w-6 h-6" /> {/* ✅ Icône bonhomme */}
              </div>
            )}
          </Link>
          <div>
            <Link to={`/profile/${author._id}`} className="font-semibold text-white">
              {username}
            </Link>
            <div className="text-xs text-gray-400">{post.location || ""}</div>
          </div>
        </div>
        <button className="text-gray-300">Follow</button>
      </div>

      {/* Media */}
      <div className="w-full">
        {mediaType === "video" ? (
          <video controls className="w-full max-h-[70vh] object-cover">
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt={caption ? caption.slice(0, 50) : "post"}
            className="w-full h-auto object-cover max-h-[70vh]"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-2">
            <Icon>
              {liked ? (
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21s-6.716-4.35-9.5-7.03C-0.084 10.404 2.21 4.5 7.5 4.5c2.26 0 3.62 1.3 4.5 2.39C12.88 5.8 14.24 4.5 16.5 4.5c5.29 0 7.58 5.904 4.99 9.47C18.716 16.65 12 21 12 21z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.69l-1.06-1.08a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                  />
                </svg>
              )}
            </Icon>
            <span className="text-sm text-white">{likes}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-300">
            <Icon>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.71 9.71 0 01-4.9-1.25L3 20l1.25-3.1A7.72 7.72 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Icon>
          </button>
        </div>

        <div className="text-sm text-gray-400">
          {new Date(post.createdAt || Date.now()).toLocaleDateString()}
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-4 pb-4">
          <span className="font-semibold text-white mr-2">{username}</span>
          <span className="text-gray-300">{caption}</span>
        </div>
      )}
    </article>
  );
};

export default PostCard;
