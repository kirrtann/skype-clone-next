"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Wifi, WifiOff } from "lucide-react";
import { io, Socket } from "socket.io-client";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";

let socket: Socket | null = null;

interface MessageDetail {
  id: string | number;
  sender: string;
  receiver?: string;
  timestamp?: string | number;
  message?: string;
}

const MessageHistory = () => {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { selectedUser } = useMessageDetailStore();

  const [messages, setMessages] = useState<MessageDetail[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState("");

  const currentUserId = user?.id;
  const targetUserId = searchParams.get("id");
  const targetUserName = selectedUser?.name || targetUserId || "Unknown";

  useEffect(() => {
    if (currentUserId && targetUserId) {
      const roomId = [currentUserId, targetUserId].sort().join("-");
      setRoom(roomId);
    }
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    if (!currentUserId || !room) return;

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io("http://192.168.5.104:3002", {
      query: {
        userId: currentUserId,
        receiverId: targetUserId,
      },
      transports: ["polling", "websocket"],
      forceNew: true,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket?.emit("join-room", {
        room,
        receiverId: targetUserId,
        senderId: currentUserId,
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection failed:", error);
      setIsConnected(false);
    });

    socket.on("room-joined", (data) => {
      console.log("Room joined:", data);
    });

    socket.on("new-message", (data) => {
      if (data.sender !== currentUserId) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: data.sender,
            message: data.message,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        ]);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [currentUserId, room, targetUserId]);

  const sendMessage = () => {
    if (!messageInput.trim() || !socket?.connected) return;

    const message: MessageDetail = {
      id: Date.now(),
      sender: currentUserId!,
      message: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);

    socket.emit("send-message", {
      room,
      message: messageInput,
      receiverId: targetUserId,
      senderId: currentUserId,
    });

    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {targetUserName?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="font-semibold">{targetUserName}</h2>
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Connecting...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <h3 className="text-lg mb-2">Start your conversation</h3>
            <p>Send a message to {targetUserName}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.sender === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-white border shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(msg.timestamp!).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-center mt-2 text-gray-500">
          {isConnected ? "Press Enter to send" : "Connecting..."}
        </p>
      </div>
    </div>
  );
};

export default MessageHistory;
