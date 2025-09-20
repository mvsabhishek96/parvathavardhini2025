// src/pages/Donations.jsx
import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext.jsx";
import DonationsTable from "../components/DonationsTable";
import SubmissionModal from "../components/SubmissionModal";
import EditSubmissionForm from "../components/EditSubmissionForm";
import { normalizeDonationDoc } from "../utils/firestoreHelpers";

function sanitizePhone(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  return digits.slice(-10);
}

export default function Donations() {
  const { currentUser, profile } = useAuth() || {};
  const isMaster = profile?.isMaster === true;
  const { notify } = useNotification();

  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    member: "all",
    type: "all",
    q: "",
    from: "",
    to: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecord, setModalRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      if (!currentUser?.email) return;
      setLoading(true);
      try {
        let fetched = [];
        if (isMaster) {
          const membersSnap = await getDocs(collection(db, "CommitteeMembers"));
          const memberDocs = membersSnap.docs.map((d) => ({ id: d.id, data: d.data() }));
          if (!mounted) return;
          setMembers(memberDocs);

          const allPromises = memberDocs.map(async (m) => {
            const subs = await getDocs(collection(db, "CommitteeMembers", m.id, "Submissions"));
            const inks = await getDocs(collection(db, "CommitteeMembers", m.id, "InKindDonations"));
            return [
              ...subs.docs.map((docSnap) => normalizeDonationDoc(docSnap, "cash", m.id)),
              ...inks.docs.map((docSnap) => normalizeDonationDoc(docSnap, "inkind", m.id)),
            ];
          });

          const nested = await Promise.all(allPromises);
          fetched = nested.flat();
        } else {
          const subs = await getDocs(collection(db, "CommitteeMembers", currentUser.email, "Submissions"));
          const inks = await getDocs(collection(db, "CommitteeMembers", currentUser.email, "InKindDonations"));
          fetched = [
            ...subs.docs.map((d) => normalizeDonationDoc(d, "cash", currentUser.email)),
            ...inks.docs.map((d) => normalizeDonationDoc(d, "inkind", currentUser.email)),
          ];
        }

        fetched = fetched.map((f) => ({
          ...f,
          phone: sanitizePhone(f.phone || ""),
          amount: f.amount ? Number(f.amount) : 0,
        }));

        if (mounted) setDonations(fetched);
      } catch (err) {
        console.error("Failed to load donations", err);
        notify("error", "Failed to load donations: " + (err.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => (mounted = false);
  }, [currentUser?.email, isMaster, notify]);

  const filtered = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase();
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;
    let arr = donations.slice();

    if (filters.member && filters.member !== "all")
      arr = arr.filter((d) => d.committeeMember === filters.member);
    if (filters.type && filters.type !== "all")
      arr = arr.filter((d) => d.type === filters.type);

    if (q) {
      arr = arr.filter((d) => {
        return (
          (d.name || "").toLowerCase().includes(q) ||
          (d.phone || "").toLowerCase().includes(q) ||
          (d.description || "").toLowerCase().includes(q) ||
          (d.committeeMemberName || "").toLowerCase().includes(q)
        );
      });
    }
    if (from) arr = arr.filter((d) => d.timestamp && d.timestamp >= from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      arr = arr.filter((d) => d.timestamp && d.timestamp <= end);
    }

    const sortFns = {
      newest: (a, b) => (b.timestamp ? +b.timestamp : 0) - (a.timestamp ? +a.timestamp : 0),
      oldest: (a, b) => (a.timestamp ? +a.timestamp : 0) - (b.timestamp ? +a.timestamp : 0),
      amount_desc: (a, b) => (b.amount || 0) - (a.amount || 0),
      amount_asc: (a, b) => (a.amount || 0) - (b.amount || 0),
    };
    arr.sort(sortFns[filters.sort] || sortFns.newest);
    return arr;
  }, [donations, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = (rows, name = "donations_export.csv") => {
    if (!rows || rows.length === 0) {
      notify("warning", "No rows to export");
      return;
    }
    const headers = [
      "timestamp",
      "type",
      "amount",
      "name",
      "phone",
      "city",
      "gothra",
      "collectorEmail",
      "collectorName",
      "description",
    ];
    const csv = [headers.join(",")];
    for (const r of rows) {
      const row = [
        r.timestamp ? r.timestamp.toISOString() : "",
        r.type,
        r.amount,
        `"${(r.name || "").replace(/"/g, '""')}"`,
        r.phone,
        `"${(r.city || "").replace(/"/g, '""')}"`,
        `"${(r.gothra || "").replace(/"/g, '""')}"`,
        r.committeeMember,
        `"${(r.committeeMemberName || "").replace(/"/g, '""')}"`,
        `"${(r.description || "").replace(/"/g, '""')}"`,
      ].join(",");
      csv.push(row);
    }
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    notify("success", "CSV exported");
  };

  const handleView = (rec) => {
    setModalRecord(rec);
    setModalOpen(true);
  };

  const handleEdit = (rec) => {
    setEditingRecord(rec);
    setModalOpen(false);
  };

  const handleDelete = async (rec) => {
    if (!confirm("Delete this record? This action cannot be undone.")) return;
    try {
      notify("info", "Deleting...");
      if (!rec.committeeMember || !rec.id) throw new Error("missing identifiers");
      const col = rec.type === "cash" ? "Submissions" : "InKindDonations";
      const ref = doc(db, "CommitteeMembers", rec.committeeMember, col, rec.id);
      await deleteDoc(ref);
      setDonations((prev) =>
        prev.filter((p) => !(p.committeeMember === rec.committeeMember && p.id === rec.id))
      );
      notify("success", "Record deleted");
    } catch (err) {
      console.error("Delete failed", err);
      notify("error", "Delete failed: " + (err.message || err));
    }
  };

  const onSavedAfterEdit = () => {
    (async function reloadSingle() {
      try {
        setLoading(true);
        if (isMaster) {
          const membersSnap = await getDocs(collection(db, "CommitteeMembers"));
          const memberDocs = membersSnap.docs.map((d) => ({ id: d.id }));
          const nested = await Promise.all(
            memberDocs.map(async (m) => {
              const subs = await getDocs(collection(db, "CommitteeMembers", m.id, "Submissions"));
              const inks = await getDocs(collection(db, "CommitteeMembers", m.id, "InKindDonations"));
              return [
                ...subs.docs.map((docSnap) => normalizeDonationDoc(docSnap, "cash", m.id)),
                ...inks.docs.map((docSnap) => normalizeDonationDoc(docSnap, "inkind", m.id)),
              ];
            })
          );
          const fetched = nested
            .flat()
            .map((f) => ({ ...f, phone: sanitizePhone(f.phone || ""), amount: Number(f.amount || 0) }));
          setDonations(fetched);
        } else {
          const subs = await getDocs(collection(db, "CommitteeMembers", currentUser.email, "Submissions"));
          const inks = await getDocs(collection(db, "CommitteeMembers", currentUser.email, "InKindDonations"));
          const fetched = [
            ...subs.docs.map((d) => normalizeDonationDoc(d, "cash", currentUser.email)),
            ...inks.docs.map((d) => normalizeDonationDoc(d, "inkind", currentUser.email)),
          ].map((f) => ({ ...f, phone: sanitizePhone(f.phone || ""), amount: Number(f.amount || 0) }));
          setDonations(fetched);
        }
        notify("success", "List updated");
      } catch (err) {
        console.error("Reload failed", err);
        notify("error", "Reload failed: " + (err.message || err));
      } finally {
        setLoading(false);
        setEditingRecord(null);
      }
    })();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Donations</h2>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4">
              {isMaster && (
                <select
                  value={filters.member}
                  onChange={(e) => {
                    setFilters({ ...filters, member: e.target.value });
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="all">All collectors</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.data?.name || m.id}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters({ ...filters, type: e.target.value });
                  setPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="all">All types</option>
                <option value="cash">Cash</option>
                <option value="inkind">In-Kind</option>
              </select>

              <div className="flex items-center gap-2">
                <label className="text-sm">From</label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => {
                    setFilters({ ...filters, from: e.target.value });
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">To</label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => {
                    setFilters({ ...filters, to: e.target.value });
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>

              <input
                placeholder="search name / phone / notes"
                className="border rounded px-2 py-1 flex-1 min-w-[180px]"
                value={filters.q}
                onChange={(e) => {
                  setFilters({ ...filters, q: e.target.value });
                  setPage(1);
                }}
              />

              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount_desc">Amount (high → low)</option>
                <option value="amount_asc">Amount (low → high)</option>
              </select>

              <button
                className="secondary-btn"
                onClick={() => exportCSV(filtered)}
              >
                Export CSV (all)
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  exportCSV(pageData, `donations_page_${page}.csv`)
                }
              >
                Export CSV (page)
              </button>
            </div>

            {/* Table */}
            <div className="mt-4">
              <DonationsTable
                donations={pageData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserEmail={currentUser?.email}
                isMaster={isMaster}
              />
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-between">
              <div className="flex gap-2">
                <button
                  className="secondary-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  className="secondary-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
              <span className="text-sm sm:text-base">
                Page {page} / {totalPages} — {filtered.length} results
              </span>
            </div>
          </>
        )}
      </div>

      <SubmissionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={modalRecord}
        onEdit={(r) => {
          setModalOpen(false);
          setEditingRecord(r);
        }}
        onDelete={handleDelete}
        isMaster={isMaster}
        currentUserEmail={currentUser?.email}
      />

      {editingRecord && (
        <div className="mt-6">
          <EditSubmissionForm
            record={editingRecord}
            onSaved={onSavedAfterEdit}
            onCancel={() => setEditingRecord(null)}
          />
        </div>
      )}
    </div>
  );
}
