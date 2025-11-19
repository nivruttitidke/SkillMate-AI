import React from "react";

export default function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`flex my-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed
          ${isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}`}
      >
        {text}
      </div>
    </div>
  );
}
