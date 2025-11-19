import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-hot-toast";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

   //Reload when tab becomes visible
  
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

     // LOAD DASHBOARD DATA
  
  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const profileRes = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(profileRes.data.user);

      const historyRes = await axios.get("/api/user/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(historyRes.data.history || []);

    } catch (err) {
      console.error("Dashboard load error:", err);
      toast.error("Failed to load dashboard!");

      setProfile(JSON.parse(localStorage.getItem("user") || "{}"));
    }

    setLoading(false);
  };

  /* Load on first mount */
  useEffect(() => {
    loadData();
  }, []);

     // DELETE CONFIRM MODAL
  
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

      //DELETE HISTORY ITEM
 
  const confirmDelete = async () => {
    try {
      setDeletingId(deleteId);
      const token = localStorage.getItem("token");

      await axios.delete(`/api/user/history/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory((prev) => prev.filter((item) => item._id !== deleteId));
      toast.success("Record deleted!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record!");

    } finally {
      setDeletingId(null);
      setShowModal(false);
      setDeleteId(null);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  const displayName =
    profile?.name ||
    JSON.parse(localStorage.getItem("user") || "{}")?.name ||
    "User";

  return (
    <>
      {showModal && (
        <ConfirmModal
          title="Delete History Record"
          message="Are you sure you want to delete this?"
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: "url('/interview-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 p-6 min-h-screen">
          <div className="max-w-6xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 text-white">
              <div>
                <h1 className="text-3xl font-extrabold">Welcome, {displayName}</h1>
                <p className="text-sm text-gray-200 mt-1">
                  Practice interviews. Improve your skills. Get hired.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/start")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  Start New Interview
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    toast.success("Logged out!");
                    navigate("/login");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <GlassCard title="Total Interviews" value={history.length} />
              <GlassCard title="Average Score" value={`${avgScore(history)}%`} />
              <GlassCard title="Best Category" value={bestCategory(history)} />
            </div>

            {/* RECENT */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 mb-6">
              <h2 className="text-xl font-bold text-black mb-3">Recent Interviews</h2>

              {history.length === 0 ? (
                <p className="text-gray-800">No history found.</p>
              ) : (
                history.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between p-3 bg-white/40 shadow rounded-lg mb-2"
                  >
                    <div>
                      <p className="font-semibold text-black">{item.category}</p>
                      <p className="text-sm text-gray-700">
                        {formatDateTime(item.date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-blue-700">
                        {item.score}%
                      </span>

                      <button
                        onClick={() => openDeleteModal(item._id)}
                        disabled={deletingId === item._id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        {deletingId === item._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CHART */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 mb-6">
              <h2 className="text-xl font-bold text-black mb-3">Performance Chart</h2>

              <div className="h-64 bg-white/40 p-3 rounded-lg">
                {history.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-700">
                    No data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={history.map((h) => ({
                        category: h.category,
                        score: h.score,
                      }))}
                    >
                      <XAxis dataKey="category" stroke="black" />
                      <YAxis domain={[0, 100]} stroke="black" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/history")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                View Full History
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Profile
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

/* GlassCard */
function GlassCard({ title, value }) {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-5 shadow">
      <p className="text-sm font-semibold text-black/80">{title}</p>
      <p className="text-3xl font-extrabold text-black mt-3">{value}</p>
    </div>
  );
}

/* Helpers */
function avgScore(history) {
  if (!history.length) return 0;
  return Math.round(
    history.reduce((sum, h) => sum + (h.score || 0), 0) / history.length
  );
}

function bestCategory(history) {
  if (!history.length) return "N/A";

  const map = {};
  history.forEach((h) => {
    if (!map[h.category]) map[h.category] = [];
    map[h.category].push(h.score);
  });

  let best = "N/A";
  let highest = -1;

  Object.entries(map).forEach(([cat, arr]) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (avg > highest) {
      highest = avg;
      best = cat;
    }
  });

  return best;
}

function formatDateTime(dateString) {
  const date = new Date(dateString);

  //  DD/MM/YYYY
  const dmy = date.toLocaleDateString("en-GB");

  // Format: 04:32 PM
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${dmy} – ${time}`;
}
