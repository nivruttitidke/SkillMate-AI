import React from "react";

export default function Toast({ message }) {
  return (
    <div className="fixed top-5 right-5 z-50 animate-fadeIn">
      <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
