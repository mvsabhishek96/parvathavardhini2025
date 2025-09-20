// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import DonationForm from "./components/DonationForm";
import Login from "./pages/Login";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { currentUser } = useAuth() || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return <Login />;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay (mobile only) */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content wrapper */}
      <div className="main-content-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/donation-form" element={<DonationForm />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
