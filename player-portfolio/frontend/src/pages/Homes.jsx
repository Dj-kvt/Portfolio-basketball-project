import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StoryBar from "../components/Feed/StoryBar";
import PostCard from "../components/Feed/PostCard";
import BottomNav from "../components/Navigation/BottomNav";
import postApi from "../api/postApi";
import storyApi from "../api/storyApi";
import Loader from "../components/Common/Loader";
import axiosInstance from "../utils/axiosInstance";

const Homes = () => {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setCurrentUser(res.data.user);
      } catch (err) {
        console.warn("Token invalide ou expiré :", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const loadFeed = async () => {
      setLoading(true);
      setError("");
      try {
        const [storiesRes, postsRes] = await Promise.all([
          storyApi.getStories(),
          postApi.getFeed(),
        ]);

        if (!mounted) return;

        const storiesList = Array.isArray(storiesRes)
          ? storiesRes
          : storiesRes.stories || [];

        setStories(storiesList);
        setPosts(Array.isArray(postsRes) ? postsRes : postsRes.posts || []);
      } catch (err) {
        console.error("❌ Feed load error:", err);
        setError("Impossible de charger le fil pour le moment.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFeed();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h1 className="text-xl font-bold">For you</h1>
          <div className="flex items-center gap-3">
            <button aria-label="likes" className="p-1">
              <svg
                className="w-6 h-6 text-white/90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.42 4.58a5.5 5.5 0 00-7.78 0L12 5.21l-0.64-0.63a5.5 5.5 0 10-7.78 7.78L12 21.23l8.42-8.42a5.5 5.5 0 000-7.83z"
                />
              </svg>
            </button>
            <Link to="/contact" aria-label="messages" className="relative p-1">
              <svg
                className="w-6 h-6 text-white/90 hover:text-indigo-400 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1">
                8
              </span>
            </Link>
          </div>
        </header>

        {/* 📸 Stories */}
        <div className="px-2 py-3">
          <StoryBar
            stories={stories}
            loading={loading}
            currentUser={{
              _id: currentUser?._id,
              avatar: currentUser?.avatar,
              username: currentUser?.username,
            }}
          />
        </div>

        <main>
          {loading ? (
            <div className="py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-400">{error}</div>
          ) : posts.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              Aucune publication pour le moment.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={{
                  ...post,
                  media: {
                    ...post.media,
                    style: "object-contain",
                  },
                }}
              />
            ))
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Homes;
