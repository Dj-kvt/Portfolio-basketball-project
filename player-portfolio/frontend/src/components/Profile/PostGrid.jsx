// frontend/src/components/Profile/PostGrid.jsx
import React from "react";
import UserPostCard from "./UserPostCard";

const PostGrid = ({ posts, profile }) => {
  if (!posts || posts.length === 0) {
    return (
      <p className="col-span-3 text-center text-gray-500 py-10">
        Aucune publication.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {posts.map((post) => (
        <UserPostCard key={post._id} post={post} profile={profile} />
      ))}
    </div>
  );
};

export default PostGrid;
