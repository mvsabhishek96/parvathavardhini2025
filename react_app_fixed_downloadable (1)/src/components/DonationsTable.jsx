// src/components/DonationsTable.jsx
import React, { useState } from "react";

function formatDate(d) {
  if (!d) return "-";
  try {
    return d.toLocaleString("en-IN");
  } catch {
    return String(d);
  }
}

export default function DonationsTable({
  donations = [],
  onView,
  onEdit,
  onDelete,
  currentUserEmail,
  isMaster,
}) {
  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 10;

  if (!donations || donations.length === 0) {
    return <div className="card">No donation records to display.</div>;
  }

  // Paginate donations
  const start = page * pageSize;
  const end = start + pageSize;
  const pagedDonations = donations.slice(start, end);
  const totalPages = Math.ceil(donations.length / pageSize);

  return (
    <div className="w-full">
      {/* ✅ Desktop / Laptop view */}
      <div className="desktop-only overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Donor</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">City</th>
              <th className="px-3 py-2 text-left">Gothra</th>
              <th className="px-3 py-2 text-left">Collector</th>
              <th className="px-3 py-2 text-left">Notes</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedDonations.map((d) => (
              <tr
                key={`${d.committeeMember || "unknown"}-${d.id}`}
                className="border-b"
              >
                <td className="px-3 py-2">{formatDate(d.timestamp)}</td>
                <td className="px-3 py-2">{d.type}</td>
                <td className="px-3 py-2">
                  {d.amount ? Number(d.amount).toLocaleString("en-IN") : "-"}
                </td>
                <td className="px-3 py-2">{d.name}</td>
                <td className="px-3 py-2">{d.phone}</td>
                <td className="px-3 py-2">{d.city}</td>
                <td className="px-3 py-2">{d.gothra}</td>
                <td className="px-3 py-2">
                  {d.committeeMemberName || d.committeeMember}
                </td>
                <td className="px-3 py-2 max-w-[200px] whitespace-pre-wrap">
                  {d.description}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="secondary-btn"
                      onClick={() => onView && onView(d)}
                    >
                      View
                    </button>
                    {(isMaster || currentUserEmail === d.committeeMember) && (
                      <>
                        <button
                          className="secondary-btn"
                          onClick={() => onEdit && onEdit(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="secondary-btn"
                          onClick={() => onDelete && onDelete(d)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls (desktop) */}
        <div className="flex justify-between items-center mt-3 px-3">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="secondary-btn disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            className="secondary-btn disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ✅ Mobile view: card layout */}
      <div className="mobile-only space-y-4">
        {pagedDonations.map((d) => (
          <div
            key={`${d.committeeMember || "unknown"}-${d.id}`}
            className="donation-card"
          >
            <div className="text-sm text-gray-600">
              {formatDate(d.timestamp)}
            </div>
            <div><span>Type:</span> {d.type}</div>
            {d.amount && (
              <div>
                <span>Amount:</span>{" "}
                {Number(d.amount).toLocaleString("en-IN")}
              </div>
            )}
            <div><span>Donor:</span> {d.name}</div>
            <div><span>Phone:</span> {d.phone}</div>
            <div><span>City:</span> {d.city}</div>
            <div><span>Gothra:</span> {d.gothra}</div>
            <div>
              <span>Collector:</span>{" "}
              {d.committeeMemberName || d.committeeMember}
            </div>
            {d.description && (
              <div><span>Notes:</span> {d.description}</div>
            )}
            <div className="flex gap-2 flex-wrap pt-2">
              <button
                className="secondary-btn"
                onClick={() => onView && onView(d)}
              >
                View
              </button>
              {(isMaster || currentUserEmail === d.committeeMember) && (
                <>
                  <button
                    className="secondary-btn"
                    onClick={() => onEdit && onEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => onDelete && onDelete(d)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Pagination controls (mobile) */}
        <div className="flex justify-between items-center mt-2 px-1">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="secondary-btn disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            className="secondary-btn disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
