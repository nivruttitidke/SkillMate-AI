import React from "react";

export default function TypingDots() {
  return (
    <div className="flex gap-1 p-2">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
    </div>
  );
}
