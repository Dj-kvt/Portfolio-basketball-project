import { Link } from "react-router-dom";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const StoryBar = ({ stories = [], loading, currentUser }) => {
  const [activeStories, setActiveStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return <div className="text-gray-400 px-4">Chargement des stories...</div>;
  }

  // 🔹 Regrouper les stories par utilisateur
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user?._id || story.user?.id;
    if (!userId) return acc;
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(story);
    return acc;
  }, {});

  const storiesArray = Object.values(groupedStories);

  const handleNext = () => {
    if (currentIndex < activeStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setActiveStories([]);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <>
      <div className="flex overflow-x-auto gap-4 px-3 py-2 no-scrollbar">
        {/* ➕ Cercle pour créer une story */}
        <Link
          to="/stories/create"
          className="relative flex flex-col items-center"
        >
          <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] rounded-full">
            <div className="bg-black rounded-full p-[2px]">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Votre avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center">
                  <UserCircleIcon className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-1">Add story</p>
        </Link>

        {/* 🔹 Cercles pour les autres utilisateurs */}
        {storiesArray.map((userStories) => {
          const story = userStories[0];
          const user = story.user || {};
          const avatarUrl =
            user.avatar?.startsWith("http")
              ? user.avatar
              : story.media?.fileUrl || "/assets/default-story.jpg";

          const username = user.username || "Utilisateur";

          return (
            <button
              key={user._id || story._id}
              onClick={() => {
                setActiveStories(userStories);
                setCurrentIndex(0);
              }}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] rounded-full">
                <div className="bg-black rounded-full p-[2px]">
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-300 mt-1 truncate max-w-[70px]">
                {username}
              </p>
            </button>
          );
        })}
      </div>

      {/* 🟣 Modal pour afficher les stories */}
      {activeStories.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <button
            onClick={() => setActiveStories([])}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>

          {activeStories[currentIndex]?.media?.fileType?.startsWith("video") ? (
            <video
              src={activeStories[currentIndex].media.fileUrl}
              controls
              autoPlay
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
            />
          ) : (
            <img
              src={activeStories[currentIndex].media?.fileUrl}
              alt="story"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
            />
          )}

          {activeStories[currentIndex]?.caption && (
            <p className="text-gray-300 mt-3 text-center px-4">
              {activeStories[currentIndex].caption}
            </p>
          )}

          {/* Navigation entre stories */}
          <div className="absolute inset-0 flex justify-between items-center px-4">
            <button onClick={handlePrev} className="text-white text-3xl px-2">
              ‹
            </button>
            <button onClick={handleNext} className="text-white text-3xl px-2">
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryBar;
