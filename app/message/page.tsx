"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = 'ws://192.168.5.124:3002';

// Move socket initialization outside component to prevent multiple instances
let socket: Socket | null = null;

const initSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      query: {
        userId: localStorage.getItem("UserId"),
      }
    });
  }
  return socket;
};

const ChatComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState(""); // Room ID for private chat
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<string[]>([]); // Track users in room

  useEffect(() => {
    // Initialize socket if not exists
    const socket = initSocket();

    const handleConnect = () => {
          setIsConnected(true);
    };

    const handleDisconnect = () => {
           setIsConnected(false);
    };

    const handlePrivateMessage = (data: { user: string; text: string }) => {
      console.log("New message received:", data);
      setMessages((prev) => [
        ...prev,
        {
          user: data.user === socket?.id ? "You" : data.user,
          text: data.text,
        },
      ]);
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("private-message", handlePrivateMessage);
    socket.on("user-update", (data: { users: string[] }) => {
      setUsers(data.users);
    });

    // If socket is already connected, update state
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socket?.off("private-message", handlePrivateMessage);
      socket?.off("user-update");
    };
  }, []);

  // **🟢 Join a private chat room**
  const joinRoom = () => {
    if (!isConnected) {
      console.log("Socket not connected, cannot join room");
      return;
    }
    if (room.trim() !== "") {
      socket?.emit("join-room", room); // Tell the server we want to join
      console.log("Joined Room:", room);

      // Wait for confirmation from the server
      socket?.on("room-joined", (usersInRoom: string[]) => {
        console.log("Users in Room:", usersInRoom);
        setUsers(usersInRoom); // Update users list
      });
    }
  };

  // **📩 Send a private message**
  const sendMessage = () => {
    if (!isConnected) {
      console.log("Socket not connected, cannot send message");
      return;
    }
    if (message.trim() !== "" && room !== "") {
      socket?.emit("private-message", { room, message });
  
      setMessage(""); // Clear input field after sending
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Private Chat</h2>

      {/* Enter Room Name */}
      <div className="w-full flex mb-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-md"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button className="bg-green-500 text-white p-2 rounded-r-md" onClick={joinRoom}>
          Join Room
        </button>
      </div>

      {/* Show Online Users in the Room */}
      <div className="w-full mb-2">
        <p className="text-gray-700 font-bold">Users in Room:</p>
        {users.length > 0 ? (
          users.map((user, index) => <p key={index} className="text-sm">{user}</p>)
        ) : (
          <p className="text-gray-500 text-sm">No users in the room</p>
        )}
      </div>

      {/* Chat Messages */}
      <div className="w-full h-64 border rounded-md p-2 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <p key={index} className={`p-1 ${msg.user === "You" ? "text-blue-600" : "text-black"}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex w-full mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white p-2 rounded-r-md" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
