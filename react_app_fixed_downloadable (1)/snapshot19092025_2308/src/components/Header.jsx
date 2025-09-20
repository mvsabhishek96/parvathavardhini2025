import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig.js";

export default function Header({ onToggleSidebar }) {
  const { currentUser } = useAuth() || {};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // back to login
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <header className="header">
      {/* Hamburger button (mobile only) */}
      {currentUser && (
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      )}

      <h1 className="header-title">Parvathavardhini Admin</h1>

      {/* Logout button (desktop only; on mobile it’s in Sidebar) */}
      {currentUser && (
        <button className="logout-btn desktop-only" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}
