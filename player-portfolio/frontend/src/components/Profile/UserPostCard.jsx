// frontend/src/components/Profile/UserPostCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const UserPostCard = ({ post, profile }) => {
  const avatar =
    profile?.avatar ||
    "/assets/default-avatar.png"; // fallback vers image locale
  const username = profile?.username || "unknown";

  const media = post?.media;
  const mediaUrl =
    media?.fileUrl ||
    (Array.isArray(media) && media[0]?.fileUrl) ||
    "/assets/default-post.jpg";
  const mediaType = media?.fileType || "image";
  const caption = post?.caption || "";

  return (
    <article className="mb-6 bg-black rounded-md border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${profile?._id}`}>
            {avatar && avatar !== "/assets/default-avatar.png" ? (
              <img
                src={avatar}
                alt={username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-800"
                onError={(e) => (e.target.src = "/assets/default-avatar.png")}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                {/* 👤 Icône de bonhomme par défaut */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                  />
                </svg>
              </div>
            )}
          </Link>
          <div>
            <Link
              to={`/profile/${profile?._id}`}
              className="font-semibold text-white"
            >
              {username}
            </Link>
            <div className="text-xs text-gray-400">
              {new Date(post.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="w-full">
        {mediaType.startsWith("video") ? (
          <video controls className="w-full max-h-[70vh] object-cover">
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt={caption ? caption.slice(0, 50) : "post"}
            className="w-full h-auto object-cover max-h-[70vh]"
            onError={(e) => (e.target.src = "/assets/default-post.jpg")}
          />
        )}
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

export default UserPostCard;
