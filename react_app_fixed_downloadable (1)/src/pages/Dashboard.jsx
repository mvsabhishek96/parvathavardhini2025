// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { currentUser, profile } = useAuth() || {};
  const isMaster = profile?.isMaster === true;
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        let docs = [];

        if (isMaster) {
          // Master: all members’ submissions
          const membersSnap = await getDocs(collection(db, "CommitteeMembers"));
          for (const member of membersSnap.docs) {
            const email = member.id;

            const subsRef = collection(db, "CommitteeMembers", email, "Submissions");
            const inKindRef = collection(db, "CommitteeMembers", email, "InKindDonations");

            const [subsSnap, inKindSnap] = await Promise.all([
              getDocs(subsRef),
              getDocs(inKindRef),
            ]);

            docs = docs.concat(subsSnap.docs, inKindSnap.docs);
          }
        } else if (currentUser?.email) {
          // Normal user: only their own
          const subsRef = collection(db, "CommitteeMembers", currentUser.email, "Submissions");
          const inKindRef = collection(db, "CommitteeMembers", currentUser.email, "InKindDonations");

          const [subsSnap, inKindSnap] = await Promise.all([
            getDocs(subsRef),
            getDocs(inKindSnap),
          ]);

          docs = docs.concat(subsSnap.docs, inKindSnap.docs);
        }

        let total = 0;
        docs.forEach((d) => {
          const a = Number(d.data().amount) || 0;
          total += a;
        });

        if (mounted) setStats({ total, count: docs.length });
      } catch (err) {
        console.error("dashboard stats error", err);
      }
    }
    loadStats();
    return () => (mounted = false);
  }, [currentUser, isMaster]);

  if (!currentUser) return <p className="p-4">Please log in</p>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-maroon mb-6">
        {isMaster ? "📊 Master Dashboard" : "🙏 Your Dashboard"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        <div className="p-4 sm:p-6 rounded-xl shadow bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <p className="text-sm sm:text-base">Total Donations</p>
          <h2 className="text-xl sm:text-2xl font-bold">
            ₹{stats.total.toLocaleString()}
          </h2>
        </div>
        <div className="p-4 sm:p-6 rounded-xl shadow bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <p className="text-sm sm:text-base">Submission Records</p>
          <h2 className="text-xl sm:text-2xl font-bold">{stats.count}</h2>
        </div>
      </div>

      {isMaster && (
        <p className="mt-6 text-center text-sm sm:text-base text-gray-700">
          ✅ You are logged in as <strong>Master</strong>.
        </p>
      )}
    </div>
  );
}
