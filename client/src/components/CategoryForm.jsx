//categoryform.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";

export default function CategoryForm() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [count, setCount] = useState("");

  // NEW STATE
  const [language, setLanguage] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 2500);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const categories = [
    "React", "JavaScript", "Python", "Java",
    "DSA", "SQL", "Node.js", "System Design", "HR",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const counts = Array.from({ length: 50 }, (_, i) => i + 1);

  //  NEW LANGUAGE OPTIONS
  const languages = ["English", "Hindi", "Marathi"];

  const handleSubmit = async () => {
    if (!category || !level || !count || !language) {
      showError("Please select all fields including language");
      return;
    }

    //  updated config: now includes language
    const config = { category, level, count: Number(count), language };

    try {
      const res = await axios.post("/api/chat/start", config);

      const practice = {
        ...config,
        questions: res.data.questions,
      };

      // Save language also
      localStorage.setItem("practice", JSON.stringify(practice));

      showSuccess("Interview started successfully!");

      setTimeout(() => {
        navigate("/interview");
      }, 1500);

    } catch (err) {
      console.log("START ERROR:", err);
      showError("Failed to start interview");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-cover bg-center p-6 relative"
  style={{ backgroundImage: "url('/interview-bg.jpg')" }}>
     <div className="absolute inset-0 bg-black/40"></div>
      {successMsg && <SuccessToast message={successMsg} />}
      {errorMsg && <ErrorToast message={errorMsg} />}

      <div className="w-full max-w-3xl relative z-10">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome, {user?.name || "User"} 
            </h2>
            <p className="text-sm text-white">
              Choose what you want to practice
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Start Interview Practice</h3>

          {/* CATEGORY */}
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="flex gap-2 mb-4">
            <select
              className="w-1/2 p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="text"
              className="w-1/2 p-2 border rounded"
              placeholder="Or type your own"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* LEVEL */}
          <label className="block text-sm font-medium mb-1">Difficulty Level</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Select level</option>
            {levels.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* COUNT */}
          <label className="block text-sm font-medium mb-1">Number of Questions</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          >
            <option value="">Select count</option>
            {counts.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/*  LANGUAGE SELECTOR */}
          <label className="block text-sm font-medium mb-1">Interview Language</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}

