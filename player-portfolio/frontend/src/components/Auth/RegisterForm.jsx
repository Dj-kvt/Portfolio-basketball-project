// frontend/src/components/Auth/RegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import InputField from "../Common/InputField";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "fan",
    dateOfBirth: "",
    placeOfBirth: "",
    country: "",
    postalCode: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(form);
      setMessage(res.message || "Account created successfully!");

      // Redirection après 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <InputField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Your username"
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your email"
      />

      {/* Password */}
      <div className="relative">
        <InputField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          placeholder="Your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-[38px] right-2 text-gray-500"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)} // <-- même état
          className="absolute top-[38px] right-2 text-gray-500"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <div className="flex flex-col mb-3">
        <label className="text-sm font-medium mb-1">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="athlete">Athlete</option>
          <option value="recruiter">Recruiter</option>
          <option value="fan">Fan</option>
        </select>
      </div>

      <InputField
        label="Date of birth"
        type="date"
        name="dateOfBirth"
        value={form.dateOfBirth}
        onChange={handleChange}
      />
      <InputField
        label="Place of birth"
        name="placeOfBirth"
        value={form.placeOfBirth}
        onChange={handleChange}
        placeholder="City"
      />
      <InputField
        label="Country"
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
      />
      <InputField
        label="Postal code"
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        placeholder="Postal code"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      {message && (
        <p
          className={`text-center text-sm mt-2 ${
            message.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
