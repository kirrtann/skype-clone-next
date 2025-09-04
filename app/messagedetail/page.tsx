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
  message: string;
  created_at?: string | number;
  sender: {
    id: string;
    name: string;
  };
  receiver: {
    id: string;
    name: string;
  };
}

const MessageHistory = () => {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { selectedUser } = useMessageDetailStore();

  const [messages, setMessages] = useState<MessageDetail[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState("");
  const [typingStatus, setTypingStatus] = useState<{
    userId: string;
    isTyping: boolean;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  let typingTimeout: NodeJS.Timeout;

  const currentUserId = user?.id;
  const targetUserId = searchParams.get("id");
  const targetUserName = selectedUser?.name || targetUserId || "Unknown";

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set room based on sorted user IDs
  useEffect(() => {
    if (currentUserId && targetUserId) {
      const roomId = [currentUserId, targetUserId].sort().join("-");
      setRoom(roomId);
    }
  }, [currentUserId, targetUserId]);

  // Initialize socket connection
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

      socket.on("new-message", (data) => {
        if (data.sender?.id !== currentUserId) {
          setMessages((prev) => [
            ...prev,
            {
              id: data.id || Date.now(),
              message: data.message,
              timestamp: data.timestamp || new Date().toISOString(),
              sender: { id: data.sender.id, name: data.sender.name },
              receiver: { id: data.receiver.id, name: data.receiver.name },
            },
          ]);
        }
      });
      socket.on(
        "user-typing",
        (data: { userId: string; room: string; isTyping: boolean }) => {
          if (data.room === room && data.userId !== currentUserId) {
            setTypingStatus(
              data.isTyping ? { userId: data.userId, isTyping: true } : null
            );
          }
        }
      );
    }

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [currentUserId, room, targetUserId]);

  // Fetch chat history from server
  useEffect(() => {
    if (!currentUserId || !targetUserId) return;

    const fetchHistory = async () => {
      try {
        const res = await getmeassage({
          userId: currentUserId,
          otherUserId: targetUserId,
        });
        const data = res?.data || [];
        const formatted = data.map((msg: MessageDetail) => ({
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          sender: { id: msg.sender?.id, name: msg.sender?.name },
          receiver: { id: msg.receiver?.id, name: msg.receiver?.name },
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [currentUserId, targetUserId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (!socket || !room) return;

    socket.emit("typing-start", { room });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("typing-stop", { room });
    }, 1000);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socket?.connected) return;
    const newMessage: MessageDetail = {
      id: Date.now(),
      message: messageInput,
      created_at: new Date().toISOString(),
      sender: { id: currentUserId!, name: user?.name || "You" },
      receiver: { id: targetUserId!, name: targetUserName },
    };
    setMessages((prev) => [...prev, newMessage]);

    socket.emit("send-message", {
      room,
      message: messageInput,
      receiverId: targetUserId,
      senderId: currentUserId,
    });
    socket.emit("typing-stop", { room });
    setMessageInput("");
  };

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
                msg.sender.id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm ${
                  msg.sender.id === currentUserId
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-[10px] opacity-70 block mt-1 text-right">
                  {new Date(msg.created_at!).toLocaleTimeString([], {
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

      {typingStatus?.isTyping && (
        <div className="px-4 text-sm text-gray-500 mb-1">typing...</div>
      )}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
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
