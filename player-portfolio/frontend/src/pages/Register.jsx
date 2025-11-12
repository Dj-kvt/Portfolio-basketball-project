import RegisterForm from "../components/Auth/RegisterForm";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">

      {/* 🎞️ Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="/assets/login-bg.mp4" // 🟣 Même vidéo que pour le login
        autoPlay
        loop
        muted
      />

      {/* 🌟 Contenu principal */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 tracking-wider text-gradient bg-clip-text text-transparent bg-[linear-gradient(90deg,#facc15,#6366f1)]">
          Create an Account 🏀
        </h2>

        <RegisterForm />

        <p className="text-sm text-center mt-6 text-gray-200">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
