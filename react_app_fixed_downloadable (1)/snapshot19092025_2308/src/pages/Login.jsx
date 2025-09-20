import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notify("లాగిన్ విజయవంతం!", "success");
      navigate("/");
    } catch (err) {
      notify("తప్పు ఈమెయిల్ లేదా పాస్‌వర్డ్", "error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-300">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-maroon mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border-gray-300 focus:border-maroon focus:ring-maroon text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border-gray-300 focus:border-maroon focus:ring-maroon text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 rounded-md bg-maroon text-white font-semibold hover:bg-red-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
