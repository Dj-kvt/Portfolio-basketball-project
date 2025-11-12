import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../utils/axiosInstance";

const NavButton = ({ to, icon, label }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={`flex-1 text-center py-2 ${
        active ? "text-white" : "text-gray-400"
      }`}
    >
      <div className="mx-auto w-6 h-6">{icon}</div>
      {label && <div className="text-xs mt-1">{label}</div>}
    </Link>
  );
};

const HomeIcon = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" />
  </svg>
);

const SearchIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M10.5 18A7.5 7.5 0 1010.5 3a7.5 7.5 0 000 15z"
    />
  </svg>
);

const AddIcon = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5z" />
  </svg>
);

const ReelsIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7v8l6-4-6-4zM4 6h8v12H4z"
    />
  </svg>
);

const BottomNav = () => {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        const user = res.data?.user;
        if (user?.avatar) setAvatar(user.avatar);
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

  const ProfileIcon = avatar ? (
    <img
      src={avatar}
      alt="profile"
      className="w-6 h-6 rounded-full object-cover border border-gray-600"
    />
  ) : (
    <UserCircleIcon className="w-6 h-6 text-gray-400" />
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-gray-800">
      <div className="max-w-2xl mx-auto flex items-center">
        <NavButton to="/home" icon={HomeIcon} label="" />
        <NavButton to="/search" icon={SearchIcon} label="" />
        <NavButton to="/create" icon={AddIcon} label="" />
        <NavButton to="/reels" icon={ReelsIcon} label="" />
        <NavButton to="/profile/me" icon={ProfileIcon} label="" />
      </div>
    </nav>
  );
};

export default BottomNav;
