import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

function sanitizePhone(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  return digits.slice(-10);
}

export default function DonationForm() {
  const { currentUser, profile } = useAuth() || {};
  const { notify } = useNotification();
  const [form, setForm] = useState({
    type: "cash",
    name: "",
    phone: "",
    city: "",
    gothra: "",
    amount: "",
    description: "",
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePreview = () => {
    if (!form.name || !sanitizePhone(form.phone)) {
      notify("error", "Please enter valid donor name and phone.");
      return;
    }
    setPreview(true);
  };

  const saveAndSend = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const collName = form.type === "cash" ? "Submissions" : "InKindDonations";
      const payload = {
        ...form,
        phone: sanitizePhone(form.phone),
        amount: form.type === "cash" ? Number(form.amount) : undefined,
        committeeMember: currentUser.email,
        committeeMemberName: profile?.name || currentUser.email,
        committeeMemberMobile: profile?.mobile || "",
        timestamp: serverTimestamp(),
        type: form.type,
      };
      await addDoc(
        collection(db, "CommitteeMembers", currentUser.email, collName),
        payload
      );
      notify("success", "Donation saved successfully!");

      // WhatsApp message in Telugu
      const msg = `🙏 ధన్యవాదాలు ${form.name} గారు 🙏
మీరు అందించిన ${
        form.type === "cash" ? "₹" + form.amount + " నగదు" : form.description
      } 
భక్తి స్ఫూర్తిగా నమోదు చేయబడింది.
-- ${profile?.name || currentUser.email}`;
      window.open(
        `https://wa.me/91${sanitizePhone(form.phone)}?text=${encodeURIComponent(
          msg
        )}`,
        "_blank"
      );

      setForm({
        type: "cash",
        name: "",
        phone: "",
        city: "",
        gothra: "",
        amount: "",
        description: "",
      });
      setPreview(false);
    } catch (err) {
      console.error("Save failed", err);
      notify("error", "Failed to save donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
        New Donation
      </h2>

      <form className="space-y-5">
        {/* Type */}
        <div>
          <label className="block font-medium mb-1">Donation Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-maroon"
          >
            <option value="cash">Cash</option>
            <option value="inkind">In-Kind</option>
          </select>
        </div>

        {/* Donor Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Donor Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* City & Gothra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Gothra</label>
            <input
              type="text"
              name="gothra"
              value={form.gothra}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Amount / Description */}
        {form.type === "cash" ? (
          <div>
            <label className="block font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        ) : (
          <div>
            <label className="block font-medium mb-1">In-Kind Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              rows={3}
            />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="p-4 border rounded-md bg-gray-50 space-y-1">
            <p>
              <strong>Preview:</strong> {form.name} — {form.phone}
            </p>
            <p>
              {form.type === "cash"
                ? `₹${form.amount}`
                : `In-Kind: ${form.description}`}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handlePreview}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={saveAndSend}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full sm:w-auto disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Send WhatsApp"}
          </button>
        </div>
      </form>
    </div>
  );
}
