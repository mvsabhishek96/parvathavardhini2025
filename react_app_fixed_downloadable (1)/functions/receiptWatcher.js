// src/utils/receiptWatcher.js
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export function watchForReceipt(docPath, donorName, donorPhone, amount, callback, timeoutMs = 30000) {
  const parts = docPath.split("/").filter(Boolean);
  const docRef = doc(db, ...parts);
  const start = Date.now();

  const unsubscribe = onSnapshot(docRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    if (data?.receiptUrl) {
      const msg = `🙏 ధన్యవాదాలు ${donorName} గారు 🙏\nమీరు దానం చేసిన ₹${amount} భక్తి స్ఫూర్తిగా నమోదు చేయబడింది.\nమీ రుసీదు ఇక్కడ ఉంది:\n${data.receiptUrl}\n-- ${data.committeeMemberName || ""}`;
      const waLink = `https://wa.me/91${donorPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waLink, "_blank");
      if (callback) callback(data.receiptUrl);
      unsubscribe();
    } else if (Date.now() - start > timeoutMs) {
      const msg = `🙏 ధన్యవాదాలు ${donorName} గారు 🙏\nమీరు దానం చేసిన ₹${amount} భక్తి స్ఫూర్తిగా నమోదు చేయబడింది.\nరుసీదు కొద్ది సమయంలో పంపబడుతుంది.\n-- ${""}`;
      const waLink = `https://wa.me/91${donorPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waLink, "_blank");
      if (callback) callback(null);
      unsubscribe();
    }
  });

  return unsubscribe;
}
