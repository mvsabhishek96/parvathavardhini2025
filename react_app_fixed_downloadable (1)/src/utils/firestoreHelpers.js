// src/utils/firestoreHelpers.js
export function toDateOrNull(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  try {
    return new Date(ts);
  } catch {
    return null;
  }
}

export function normalizeDonationDoc(doc, typeHint = null, parentEmail = null) {
  // doc may be a Firestore DocumentSnapshot or a plain object
  const data = doc && doc.data ? doc.data() : doc || {};
  const id = doc && doc.id ? doc.id : data.id || null;
  const type = data.type || typeHint || (data.amount ? "cash" : "inkind");
  const timestamp = toDateOrNull(data.timestamp);
  const amount = data.amount !== undefined && data.amount !== null ? Number(data.amount) : 0;
  return {
    id,
    type,
    amount,
    name: data.name || data.donorName || "",
    phone: (data.phone || data.phoneNumber || data.mobile || "").toString(),
    city: data.city || "",
    gothra: data.gothra || "",
    description: data.description || "",
    committeeMember: data.committeeMember || parentEmail || "",
    committeeMemberName: data.committeeMemberName || "",
    timestamp,
    raw: data,
  };
}
