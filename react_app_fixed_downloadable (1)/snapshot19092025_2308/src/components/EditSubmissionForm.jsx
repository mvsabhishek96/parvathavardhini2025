import React, { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNotification } from "../contexts/NotificationContext.jsx";

export default function EditSubmissionForm({ record, onSaved, onCancel }) {
  const { showNotification } = useNotification();

  // ✅ Guard against null/undefined record
  if (!record) {
    return (
      <div className="p-6 bg-white rounded shadow-md">
        <p className="text-gray-600 mb-4">No record selected.</p>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Close
        </button>
      </div>
    );
  }

  const [form, setForm] = useState({
    name: record.name || "",
    phone: record.phone || "",
    amount: record.amount || "",
    city: record.city || "",
    gothra: record.gothra || "",
    description: record.description || "",
  });
  const [saving, setSaving] = useState(false);

  if (record.type === "inkind") {
    return (
      <div className="relative z-60 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Edit not allowed</h3>
        <p className="text-sm text-gray-600 mb-4">
          In-Kind donation editing is disabled. You may view the record only.
        </p>
        <button
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          onClick={onCancel}
        >
          Back
        </button>
      </div>
    );
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async () => {
    try {
      setSaving(true);
      if (!record.committeeMember || !record.id)
        throw new Error("Missing identifiers for update");

      const docRef = doc(
        db,
        "CommitteeMembers",
        record.committeeMember,
        record.type === "cash" ? "Submissions" : "InKindDonations",
        record.id
      );

      await updateDoc(docRef, {
        name: form.name,
        phone: form.phone,
        amount: Number(form.amount || 0),
        city: form.city,
        gothra: form.gothra,
        description: form.description,
        updatedAt: serverTimestamp(),
      });

      showNotification("success", "Record updated");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Update failed", err);
      showNotification("error", "Update failed: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative z-60 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Edit Donation</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Donor Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            name="city"
            value={form.city}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gothra</label>
          <input
            name="gothra"
            value={form.gothra}
            onChange={onChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          disabled={saving}
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full sm:w-auto disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
