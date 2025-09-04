"use client";

import { MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-blue-100 p-6 rounded-full mb-6">
        <MessageCircle className="w-16 h-16 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome to chat-App
      </h1>
      <p className="text-gray-500 max-w-md mb-6">
        Start a new conversation or select an existing chat from the sidebar to
        begin messaging.
      </p>
    </div>
  );
}
