// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Homes from "./pages/Homes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import CreateStory from "./pages/CreateStory";
import Search from "./pages/Search";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Welcome />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homes />} />
        <Route path="/register" element={<Register />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Posts & Stories */}
        <Route path="/reels" element={<Feed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/stories/create" element={<CreateStory />} />

        {/* Profile */}
        <Route path="/profile/me" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;