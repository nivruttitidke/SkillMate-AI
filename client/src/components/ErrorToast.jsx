import React from "react";

export default function ErrorToast({ message }) {
  return (
    <div
      className="
        fixed top-4 right-4
        bg-red-600 text-white
        px-5 py-3 rounded-lg shadow-lg
        animate-slide-in
      "
      style={{ zIndex: 9999 }}
    >
       {message}
    </div>
  );
}
