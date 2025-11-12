import LoginForm from "../components/Auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">

      {/* 🎞️ Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="/assets/login-bg.mp4"
        autoPlay
        loop
        muted
      />

      {/* 🌟 Contenu principal */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h2>

        <LoginForm />

        <p className="text-sm text-center mt-6 text-gray-200">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
