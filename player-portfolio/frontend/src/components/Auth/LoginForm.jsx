// frontend/src/components/Auth/LoginForm.jsx
import { useState } from "react";
import { loginUser } from "../../api/authApi";
import InputField from "../Common/InputField";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // état pour œil

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(credentials);
      localStorage.setItem("token", res.token);
      setMessage("Login successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <InputField
        label="Email"
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Your email"
        inputClassName="bg-white text-black" // texte noir
      />

      {/* Password avec œil */}
      <div className="relative">
        <InputField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={credentials.password}
          onChange={handleChange}
          placeholder="Your password"
          inputClassName="bg-white text-black" // texte noir
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-[38px] right-2 text-gray-500"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition"
      >
        {loading ? "Connecting..." : "Login"}
      </button>

      {message && (
        <p
          className={`text-center text-sm mt-2 ${
            message.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
