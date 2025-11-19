// client/src/components/HistoryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; 
import api from "../api";
export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  //  dd/mm/yyyy
  const formatDate = (iso) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    let hours = d.getHours();
    let minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${day}/${month}/${year} — ${hours}:${minutes} ${ampm}`;
  };

  // LOAD HISTORY
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("History fetch error:", err);
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

     //DELETE SINGLE — toast confirmation
  
  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div>
          <p className="font-semibold">Delete this record?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setDeleting(true);

                try {
                  const token = localStorage.getItem("token");

                  await api.delete(`/api/user/history/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  setHistory((prev) => prev.filter((h) => h._id !== id));
                  toast.success("Record deleted!");
                } catch (err) {
                  console.error("Delete error:", err);
                  toast.error("Failed to delete item");
                } finally {
                  setDeleting(false);
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

     //DELETE ALL — toast confirmation
 
  const handleDeleteAll = async () => {
    toast(
      (t) => (
        <div>
          <p className="font-semibold">Delete ALL history?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setDeleting(true);

                try {
                  const token = localStorage.getItem("token");

                  await api.delete(`/api/user/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  setHistory([]);
                  toast.success("All history deleted!");
                } catch (err) {
                  console.error("Delete all error:", err);
                  toast.error("Failed to delete all history");
                } finally {
                  setDeleting(false);
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  if (loading)
    return (
      <div className="p-6 text-center text-white animate-fade-in">
        Loading history...
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center relative animate-fade-in"
      style={{ backgroundImage: "url('/interview-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-10 animate-fade-in">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 text-white animate-scale-in">
          <h1 className="text-3xl font-extrabold">Interview History</h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Back to Dashboard
            </button>

            {history.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
              >
                {deleting ? "Deleting..." : "Delete All"}
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="p-6 bg-white/20 backdrop-blur-md rounded text-white text-lg text-center animate-scale-in">
              No interview history found.
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={item._id}
                className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow flex justify-between items-center border border-white/40 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <p className="text-lg font-bold text-black">{item.category}</p>
                  <p className="text-sm text-gray-700">{formatDate(item.date)}</p>
                  <p className="mt-1 text-black">
                    Score: <b>{item.score}%</b>
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}