"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Wifi, WifiOff } from "lucide-react";
import { io, Socket } from "socket.io-client";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";
import { getmeassage } from "@/api/servierce/chatservis";

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = user?.id;
  const targetUserId = searchParams.get("id");
  const targetUserName = selectedUser?.name || targetUserId || "Unknown";

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate room ID
  useEffect(() => {
    if (currentUserId && targetUserId) {
      const roomId = [currentUserId, targetUserId].sort().join("-");
      setRoom(roomId);
    }
  }, [currentUserId, targetUserId]);

  // Setup socket
  useEffect(() => {
    if (!currentUserId || !room) return;

    if (!socket) {
      socket = io("http://192.168.5.104:3002", {
        query: { userId: currentUserId, receiverId: targetUserId },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        setIsConnected(true);
        socket?.emit("join-room", {
          room,
          receiverId: targetUserId,
          senderId: currentUserId,
        });
      });

      socket.on("disconnect", () => setIsConnected(false));

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
              id: data.id || Date.now(),
              sender: data.sender,
              message: data.message,
              timestamp: data.timestamp || new Date().toISOString(),
            },
          ]);
        }
      });
    }

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [currentUserId, room, targetUserId]);

  // Send message
  const sendMessage = () => {
    if (!messageInput.trim() || !socket?.connected) return;

    const newMessage: MessageDetail = {
      id: Date.now(),
      sender: currentUserId!,
      message: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("send-message", {
      room,
      message: messageInput,
      receiverId: targetUserId,
      senderId: currentUserId,
    });

    setMessageInput("");
  };
  useEffect(() => {
    if (!currentUserId || !targetUserId) return;

    const fetchHistory = async () => {
      try {
        const res = await getmeassage({
          userId: currentUserId,
          otherUserID: targetUserId,
        });
        const data = res?.data || [];
        console.log(data);

        const formatted = data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          receiver: msg.receiver,
          message: msg.message,
          timestamp: msg.created_at,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [currentUserId, targetUserId]);
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {targetUserName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">{targetUserName}</h2>
          <div className="flex items-center gap-1 text-xs">
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-red-500" />
                <span className="text-red-600">Connecting...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <h3 className="text-lg mb-1">Start your conversation</h3>
            <p className="text-sm">Send a message to {targetUserName}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm ${
                  msg.sender === currentUserId
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100  text-gray-900 rounded-bl-none"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-[10px] opacity-70 block mt-1 text-right">
                  {new Date(msg.timestamp!).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border text-black rounded-full"
          />
          <button
            onClick={sendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;
