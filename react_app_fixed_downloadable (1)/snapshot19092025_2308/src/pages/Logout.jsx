import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("✅ User signed out");
        navigate("/login"); // redirect after logout
      })
      .catch((error) => {
        console.error("Logout error:", error);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg text-gray-600">Logging out...</p>
    </div>
  );
}
