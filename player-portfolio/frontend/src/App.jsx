import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Welcome />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
  );
}

export default App;
