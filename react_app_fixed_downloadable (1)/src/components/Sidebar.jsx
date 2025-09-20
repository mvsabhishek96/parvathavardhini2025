// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Sidebar({ isOpen, onClose }) {
  const { profile } = useAuth() || {};
  const isMaster = profile?.isMaster === true || profile?.isMaster === "true";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="sidebar-title">Parvathavardhini Admin</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={onClose}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/donations" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={onClose}>
            Donations
          </NavLink>
        </li>
        <li>
          <NavLink to="/donation-form" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={onClose}>
            New Donation
          </NavLink>
        </li>
        {isMaster && (
          <li>
            <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={onClose}>
              Analytics
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={onClose}>
            Profile
          </NavLink>
        </li>
        {isMaster && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active-link" : "")} onClick={onClose}>
              Admin
            </NavLink>
          </li>
        )}
      </ul>

      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
