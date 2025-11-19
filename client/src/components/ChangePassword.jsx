import React, { useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        "/api/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully!");
      navigate("/profile");

    } catch (err) {
      console.error("Change Password Error:", err);
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex justify-center items-center p-6"
      style={{ backgroundImage: "url('/interview-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>

        <input
          type="password"
          className="w-full p-3 border rounded mb-4"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          className="w-full mt-3 text-blue-700 underline"
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
