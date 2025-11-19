import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import CategoryForm from "./components/CategoryForm";
import ChatBox from "./components/ChatBox";
import UserDashboard from "./components/UserDashboard";
import HistoryPage from "./components/HistoryPage";
import ProfilePage from "./components/ProfilePage";
import { Toaster } from "react-hot-toast";

// Protect private routes
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      {/* Global Toast Notification */}
      <Toaster position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(30, 41, 59, 0.85)", 
            color: "#fff",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          },

          success: {
            iconTheme: {
              primary: "#4ade80", 
              secondary: "#ffffff",
            },
            style: {
              background: "rgba(22, 101, 52, 0.85)", 
            },
          },

          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#ffffff",
            },
            style: {
              background: "rgba(127, 29, 29, 0.85)", 
            },
          },
        }} 
      />

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* START INTERVIEW PAGE */}
        <Route
          path="/start"
          element={
            <ProtectedRoute>
              <CategoryForm />
            </ProtectedRoute>
          }
        />

        {/* INTERVIEW CHAT PAGE */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <ChatBox />
            </ProtectedRoute>
          }
        />

        {/* HISTORY PAGE */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* PROFILE PAGE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
