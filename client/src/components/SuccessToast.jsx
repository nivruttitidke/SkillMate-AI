import React from "react";

export default function SuccessToast({ message }) {
  return (
    <div
      className="
        fixed top-4 right-4
        bg-green-600 text-white
        px-5 py-3 rounded-lg shadow-lg
        animate-slide-in
      "
      style={{ zIndex: 9999 }}
    >
       {message}
    </div>
  );
}
