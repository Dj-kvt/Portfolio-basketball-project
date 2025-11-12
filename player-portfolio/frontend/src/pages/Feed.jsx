import { useEffect, useState, useRef } from "react";
import postApi from "../api/postApi";
import mediaApi from "../api/mediaApi";
import Loader from "../components/Common/Loader";
import BottomNav from "../components/Navigation/BottomNav";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef();
  const videoRefs = useRef([]); // 🎥 Références de toutes les vidéos

  // 🔹 Charger le feed des posts + médias
  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      try {
        const [postsRes, mediasRes] = await Promise.all([
          postApi.getFeed(),
          mediaApi.getFeed(),
        ]);

        const posts = Array.isArray(postsRes)
          ? postsRes
          : postsRes.posts || [];
        const medias = Array.isArray(mediasRes)
          ? mediasRes
          : mediasRes.medias || [];

        const feed = [
          ...posts.map((p) => ({
            id: p._id,
            type: p.media?.fileType || "image",
            url: p.media?.fileUrl || "/assets/default-post.jpg",
            caption: p.caption || "",
            likes: Array.isArray(p.likes) ? p.likes.length : 0,
            createdAt: p.createdAt || 0,
          })),
          ...medias.map((m) => ({
            id: m._id,
            type: m.fileType || "image",
            url: m.fileUrl,
            caption: m.caption || "",
            likes: 0,
            createdAt: m.createdAt || 0,
          })),
        ];

        feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeedItems(feed);
      } catch (err) {
        console.error("❌ Erreur chargement du feed :", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  // 🔹 Gérer la lecture/pause auto comme TikTok
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentIndex) {
        video.play().catch(() => {}); // ignore si pas autorisé
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  // 🔹 Détection du média actif
  const handleScroll = () => {
    if (!containerRef.current) return;
    const elements = Array.from(containerRef.current.children);
    const midScreen = window.innerHeight / 2;

    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i].getBoundingClientRect();
      if (rect.top <= midScreen && rect.bottom >= midScreen) {
        setCurrentIndex(i);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white">
      <div ref={containerRef}>
        {feedItems.length === 0 ? (
          <div className="h-screen flex items-center justify-center text-gray-500">
            Aucun contenu pour le moment 🎬
          </div>
        ) : (
          feedItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="h-screen w-full snap-start flex items-center justify-center relative"
            >
              <div className="relative h-[85vh] w-full max-w-[400px] flex items-center justify-center rounded-2xl overflow-hidden shadow-lg">
                {/* 🎬 Lecture automatique TikTok-like */}
                {item.type === "video" ? (
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={item.url}
                    className="h-full w-full object-contain bg-black"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption ? item.caption.slice(0, 50) : "media"}
                    className="h-full w-full object-contain bg-black"
                  />
                )}
              </div>

              {/* 📝 Légende */}
              {item.caption && (
                <div className="absolute bottom-24 left-6 max-w-[60%]">
                  <p className="font-semibold text-white text-lg drop-shadow-lg">
                    {item.caption}
                  </p>
                </div>
              )}

              {/* ❤️ Icônes actions */}
              <div className="absolute right-6 bottom-24 flex flex-col items-center gap-6 text-white text-xl">
                <button className="flex flex-col items-center hover:scale-110 transition">
                  <Heart className="w-7 h-7 text-white/90 hover:text-red-500" />
                  <span className="text-sm mt-1">{item.likes || 0}</span>
                </button>
                <button className="hover:scale-110 transition">
                  <MessageCircle className="w-7 h-7 text-white/90 hover:text-blue-400" />
                </button>
                <button className="hover:scale-110 transition">
                  <Share2 className="w-7 h-7 text-white/90 hover:text-green-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Feed;
