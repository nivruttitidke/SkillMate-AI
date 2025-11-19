import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // custom modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const loadUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out!");
    navigate("/login");
  };

  // handle delete after confirming
  const deleteAccountConfirmed = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Account deleted successfully");

      navigate("/signup");
    } catch (err) {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-white">Loading profile...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/interview-bg.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Profile Card */}
      <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-lg animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Name</label>
            <p className="text-lg font-bold">{user?.name}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <p className="text-lg font-bold">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={logout}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Logout
          </button>

          <button
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Delete Account
          </button>

          <button
            onClick={() => navigate("/change-password")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded"
          >
            Change Password
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/*  CUSTOM CONFIRM MODAL  */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-lg w-80 shadow-xl border-2 border-blue-600">

            <h2 className="text-xl font-bold mb-3 text-center text-blue-700">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={deleteAccountConfirmed}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
