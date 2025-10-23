// frontend/src/pages/Welcome.jsx
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">

      {/* 🎞️ Background GIF */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="/assets/background.mp4" // 🔹 Mets ton GIF ou MP4 ici (ex: /assets/bg.mp4)
        autoPlay
        loop
        muted
      />

      {/* 🌟 Contenu principal */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide">
          👋 Welcome to <span className="text-indigo-500">SportConnect</span>
        </h1>
        <p className="text-gray-300 mb-10 text-lg">
          Connect athletes, recruiters, and fans — all in one place.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Logo si tu veux une image */}
      {/* <img src="/assets/logo.png" alt="Logo" className="absolute top-8 left-8 w-16 h-16" /> */}
    </div>
  );
};

export default Welcome;
