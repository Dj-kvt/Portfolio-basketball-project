import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  CameraIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import profileApi from "../api/profileApi";
import postApi from "../api/postApi";
import Loader from "../components/Common/Loader";
import BottomNav from "../components/Navigation/BottomNav";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: "", position: "", team: "" });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data =
          id && id !== "me"
            ? await profileApi.getProfileById(id)
            : await profileApi.getMyProfile();

        setProfile(data);
        setIsCurrentUser(!id || id === "me");
        setFormData({
          bio: data.bio || "",
          position: data.position || "",
          team: data.team || "",
        });
        setFollowersCount(data.followers?.length || 0);
        setIsFollowing(data.isFollowing || false);

        const userId = data.user?._id;
        if (userId) {
          const userPosts = await postApi.getUserPosts(userId);
          setPosts(userPosts);
        }
      } catch (err) {
        console.error("❌ Erreur profil :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await profileApi.uploadAvatar(file);
      if (res.success) setProfile(res.profile);
    } catch (err) {
      console.error("Erreur upload avatar:", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await profileApi.updateProfile(profile._id, formData);
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch (err) {
      console.error("Erreur update profil:", err);
    }
  };

  const handleFollow = async () => {
    try {
      await profileApi.followUser(profile._id);
      setIsFollowing(!isFollowing);
      setFollowersCount((c) => (isFollowing ? c - 1 : c + 1));
    } catch (err) {
      console.error("Erreur follow:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirection vers <Welcome />
  };

  const handleContact = () => {
    navigate(`/contact?recipientId=${profile.user._id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-xl mx-auto px-5 py-8">
        {/* HEADER PROFIL */}
        <div className="flex items-center gap-5 border-b border-gray-800 pb-6">
          <div className="relative">
            {profile.avatar || profile.user?.avatar ? (
              <img
                src={profile.avatar || profile.user?.avatar}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                <UserCircleIcon className="w-16 h-16 text-gray-500" />
              </div>
            )}

            {isCurrentUser && (
              <>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-indigo-600 p-1.5 rounded-full text-white hover:bg-indigo-700"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{profile.user?.username}</h2>
            <p className="text-sm text-gray-400">{profile.user?.role}</p>
            <p className="text-gray-300 mt-2">{profile.bio || "Aucune bio"}</p>

            {isCurrentUser ? (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditing((e) => !e)}
                  className="bg-indigo-600 px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-indigo-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  {editing ? "Annuler" : "Éditer"}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-red-700"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleFollow}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    isFollowing
                      ? "bg-gray-700 text-gray-200"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isFollowing ? "Abonné ✓" : "Suivre"}
                </button>

                {/* Bouton Contact Me uniquement pour athlete ou recruiter */}
                {(profile.user.role === "recruiter" || profile.user.role === "athlete") && (
                  <button
                    onClick={handleContact}
                    className="px-3 py-1 rounded-md text-sm bg-green-600 hover:bg-green-700 flex items-center gap-1"
                  >
                    <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                    Contact Me
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="flex justify-around text-center mt-6 border-t border-gray-800 pt-4">
          <div>
            <span className="font-bold text-lg">{posts.length}</span>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div>
            <span className="font-bold text-lg">{followersCount}</span>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div>
            <span className="font-bold text-lg">
              {profile.following?.length || 0}
            </span>
            <p className="text-xs text-gray-400">Following</p>
          </div>
        </div>

        {/* EDIT BIO */}
        {editing && isCurrentUser && (
          <div className="mt-5 bg-gray-900 p-4 rounded-xl space-y-3 border border-gray-700">
            <input
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Bio"
              className="w-full p-2 bg-gray-800 rounded text-white outline-none"
            />
            <input
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Position"
              className="w-full p-2 bg-gray-800 rounded text-white outline-none"
            />
            <input
              value={formData.team}
              onChange={(e) =>
                setFormData({ ...formData, team: e.target.value })
              }
              placeholder="Équipe"
              className="w-full p-2 bg-gray-800 rounded text-white outline-none"
            />
            <button
              onClick={handleSaveProfile}
              className="bg-green-600 w-full py-2 rounded-md hover:bg-green-700"
            >
              Sauvegarder
            </button>
          </div>
        )}

        {/* POSTS */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {posts.length > 0 ? (
            posts.map((post) => {
              const postImage = post.media?.url || post.media?.[0]?.url || "/assets/default-post.jpg";
              return (
                <img
                  key={post._id}
                  src={postImage}
                  alt="post"
                  className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition"
                />
              );
            })
          ) : (
            <p className="col-span-3 text-center text-gray-500 py-10">
              Aucune publication.
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;