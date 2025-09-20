import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const { currentUser } = useAuth();
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    async function fetchMember() {
      if (currentUser?.email) {
        const ref = doc(db, "CommitteeMembers", currentUser.email);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setMemberData(snap.data());
        }
      }
    }
    fetchMember();
  }, [currentUser]);

  if (!currentUser) return <p className="p-4">Please log in</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Profile</h2>

      <div className="space-y-3 text-sm sm:text-base">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Name:</span>
          <span>{memberData?.name || currentUser.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Email:</span>
          <span className="break-all">{currentUser.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Master:</span>
          <span>{memberData?.isMaster ? "Yes ✅" : "No ❌"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Mobile:</span>
          <span>{memberData?.mobile || "—"}</span>
        </div>
      </div>
    </div>
  );
}
