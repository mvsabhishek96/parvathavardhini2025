// src/components/SubmissionModal.jsx
import React from "react";
import EditSubmissionForm from "./EditSubmissionForm";

export default function SubmissionModal({
  isOpen,
  onClose,
  record,
  isEditing,
  onSaved,
  setIsEditing,
}) {
  if (!isOpen) return null;

  // ✅ Guard: prevent crashes if record is missing
  if (!record) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <p className="text-gray-600">No record selected.</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {isEditing ? (
          <EditSubmissionForm
            record={record}
            onSaved={() => {
              if (onSaved) onSaved();
              setIsEditing(false);
              onClose();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Donation Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Donor:</strong> {record.name}
              </p>
              <p>
                <strong>Phone:</strong> {record.phone}
              </p>
              {record.type === "cash" && (
                <p>
                  <strong>Amount:</strong> ₹{record.amount}
                </p>
              )}
              <p>
                <strong>City:</strong> {record.city}
              </p>
              <p>
                <strong>Gothra:</strong> {record.gothra}
              </p>
              <p>
                <strong>Description:</strong> {record.description}
              </p>
              <p>
                <strong>Collected By:</strong> {record.committeeMemberName}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {record.timestamp
                  ? record.timestamp.toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {record.type === "cash" ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                  Edit
                </button>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Editing not allowed for in-kind donations
                </p>
              )}
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
