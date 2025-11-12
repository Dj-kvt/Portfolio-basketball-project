import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Common/Loader";

const Contact = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const recipientId = query.get("recipientId");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch messages reçus uniquement
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/contact/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  // 🔹 Fetch email du destinataire
  useEffect(() => {
    const fetchRecipient = async () => {
      if (!recipientId) return;

      try {
        const res = await axiosInstance.get(`/profiles/${recipientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipientEmail(res.data.user.email);
      } catch (err) {
        console.error("Erreur fetch destinataire:", err);
      }
    };
    fetchRecipient();
  }, [recipientId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientEmail) return setFeedback("Destinataire introuvable.");

    try {
      const res = await axiosInstance.post(
        "/contact",
        {
          recipientEmail,
          subject,
          message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback(res.data.message || "Message envoyé avec succès !");
      setSubject("");
      setMessage("");
    } catch (err) {
      setFeedback(err.response?.data?.message || "Erreur d’envoi.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Messages reçus</h2>

      {messages.length === 0 && (
        <p className="text-gray-400 mb-4">Vous n’avez reçu aucun message.</p>
      )}

      <ul className="space-y-4 mb-6">
        {messages.map((msg) => (
          <li
            key={msg._id}
            className="border border-gray-700 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <p>
              <span className="font-bold">{msg.sender.username}</span> ({msg.sender.role})
            </p>
            {msg.subject && <p className="italic text-gray-400">{msg.subject}</p>}
            <p className="mt-1">{msg.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              Envoyé le {new Date(msg.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {recipientId && (
        <div className="mt-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-3">
            Envoyer un message à {recipientEmail}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Sujet"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <textarea
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 h-32 rounded text-black"
            />
            <button className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
              Envoyer
            </button>
          </form>
          {feedback && <p className="mt-2 text-sm">{feedback}</p>}
        </div>
      )}
    </div>
  );
};

export default Contact;
