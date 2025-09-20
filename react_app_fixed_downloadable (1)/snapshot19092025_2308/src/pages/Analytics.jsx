// src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { saveAs } from "file-saver";

export default function Analytics() {
  const { profile } = useAuth() || {};   
  const isMaster = profile?.isMaster === true || profile?.isMaster === "true";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#9b1c31", "#d97706", "#2563eb", "#16a34a", "#9333ea", "#dc2626"];

  useEffect(() => {
    if (!isMaster) return;
    const fetchAll = async () => {
      setLoading(true);
      const results = [];

      const cashSnap = await getDocs(collectionGroup(db, "Submissions"));
      cashSnap.forEach((doc) => {
        const d = doc.data();
        results.push({
          id: doc.id,
          type: "cash",
          amount: parseFloat(d.amount || 0),
          donor: d.name || "",
          phone: d.phone || "",
          city: d.city || "",
          gothra: d.gothra || "",
          collector: d.collector || "",
          notes: d.notes || "",
          timestamp: d.timestamp?.toDate?.() || new Date(),
        });
      });

      const kindSnap = await getDocs(collectionGroup(db, "InKindDonations"));
      kindSnap.forEach((doc) => {
        const d = doc.data();
        results.push({
          id: doc.id,
          type: "inkind",
          amount: 0,
          donor: d.name || "",
          phone: d.phone || "",
          city: d.city || "",
          gothra: d.gothra || "",
          collector: d.collector || "",
          notes: d.notes || "",
          timestamp: d.timestamp?.toDate?.() || new Date(),
        });
      });

      setData(results);
      setLoading(false);
    };

    fetchAll();
  }, [isMaster]);

  if (!isMaster) return <p className="p-6 text-red-600">🚫 Master access only</p>;
  if (loading) return <p className="p-6">Loading analytics...</p>;

  const totalCash = data.filter(d => d.type === "cash").reduce((a, b) => a + b.amount, 0);
  const totalInKind = data.filter(d => d.type === "inkind").length;
  const totalDonors = new Set(data.map(d => d.phone)).size;
  const totalCollectors = new Set(data.map(d => d.collector)).size;

  const daily = {};
  data.forEach(d => {
    const day = d.timestamp.toLocaleDateString("en-IN");
    if (!daily[day]) daily[day] = 0;
    daily[day] += d.amount || 0;
  });
  const timeSeries = Object.entries(daily).map(([day, amt]) => ({ day, amount: amt }));

  const collectors = {};
  data.forEach(d => {
    if (!collectors[d.collector]) collectors[d.collector] = { collector: d.collector, total: 0, count: 0 };
    collectors[d.collector].total += d.amount || 0;
    collectors[d.collector].count += 1;
  });
  const collectorBoard = Object.values(collectors).sort((a, b) => b.total - a.total);

  const cityAgg = {};
  data.forEach(d => {
    if (!cityAgg[d.city]) cityAgg[d.city] = 0;
    cityAgg[d.city] += d.amount || 0;
  });
  const cityData = Object.entries(cityAgg).map(([city, amt]) => ({ city, amount: amt }));

  const gothraAgg = {};
  data.forEach(d => {
    if (!gothraAgg[d.gothra]) gothraAgg[d.gothra] = 0;
    gothraAgg[d.gothra] += d.amount || 0;
  });
  const gothraData = Object.entries(gothraAgg).map(([g, amt]) => ({ gothra: g, amount: amt }));

  const exportCSV = () => {
    const headers = "Type,Amount,Donor,Phone,City,Gothra,Collector,Notes,Date\n";
    const rows = data.map(d =>
      `${d.type},${d.amount},${d.donor},${d.phone},${d.city},${d.gothra},${d.collector},${d.notes},${d.timestamp}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `donations_${Date.now()}.csv`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-maroon">📊 Master Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 rounded-2xl shadow bg-gradient-to-r from-red-700 to-yellow-600 text-white">
          <p className="text-base sm:text-lg">💰 Total Cash</p>
          <h2 className="text-xl sm:text-2xl font-bold">₹{totalCash.toLocaleString()}</h2>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl shadow bg-gradient-to-r from-green-700 to-emerald-500 text-white">
          <p className="text-base sm:text-lg">🎁 In-kind</p>
          <h2 className="text-xl sm:text-2xl font-bold">{totalInKind}</h2>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl shadow bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <p className="text-base sm:text-lg">🙏 Donors</p>
          <h2 className="text-xl sm:text-2xl font-bold">{totalDonors}</h2>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl shadow bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <p className="text-base sm:text-lg">🏛 Collectors</p>
          <h2 className="text-xl sm:text-2xl font-bold">{totalCollectors}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow">
          <h3 className="font-bold mb-2">📈 Cash Inflow (Daily)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#9b1c31" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow">
          <h3 className="font-bold mb-2">🏙 City Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={cityData} dataKey="amount" nameKey="city" cx="50%" cy="50%" outerRadius={100} label>
                {cityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow">
          <h3 className="font-bold mb-2">🕉 Gothra Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gothraData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gothra" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow overflow-x-auto">
          <h3 className="font-bold mb-2">🏆 Collector Leaderboard</h3>
          <table className="w-full text-sm sm:text-base text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Collector</th>
                <th className="pr-4">Total ₹</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {collectorBoard.map((c, i) => (
                <tr key={c.collector} className={i < 3 ? "font-bold text-maroon" : ""}>
                  <td className="py-2 pr-4">{c.collector || "Unknown"}</td>
                  <td className="pr-4">₹{c.total.toLocaleString()}</td>
                  <td>{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={exportCSV}
        className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-maroon text-white rounded-xl shadow hover:bg-red-800"
      >
        📤 Export CSV
      </button>
    </div>
  );
}
