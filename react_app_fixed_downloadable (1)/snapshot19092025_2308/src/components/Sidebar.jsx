// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig.js";

export default function Sidebar({ isOpen, onClose }) {
  const { profile } = useAuth() || {};
  const isMaster = profile?.isMaster === true || profile?.isMaster === "true";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // force reload to login
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "open" : ""
        } md:translate-x-0 md:static md:block`}
      >
        <div className="sidebar-title">
          Parvathavardhini Admin
          <button
            className="close-btn md:hidden"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <ul>
          <li>
            <NavLink to="/" end onClick={onClose}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/donations" onClick={onClose}>
              Donations
            </NavLink>
          </li>
          <li>
            <NavLink to="/donation-form" onClick={onClose}>
              New Donation
            </NavLink>
          </li>
          {isMaster && (
            <li>
              <NavLink to="/analytics" onClick={onClose}>
                Analytics
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile" onClick={onClose}>
              Profile
            </NavLink>
          </li>
          {isMaster && (
            <li>
              <NavLink to="/admin" onClick={onClose}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        {/* Logout button (mobile only, since desktop has in Header) */}
        <div className="sidebar-logout md:hidden">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
