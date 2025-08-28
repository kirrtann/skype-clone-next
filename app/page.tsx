"use client";
<<<<<<< HEAD
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar/page";
import ChatComponent from "./message/page";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (<>
    <div className="flex">
      <Sidebar />

    {/* <div><ChatComponent /></div> */}

    </div>
  </>
  );
}
=======

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import useUser from "./zustand/useUser";
import { searchUsers } from "@/api/servierce/chatservis";

const ChatList = () => {
  const { user } = useUser();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  // Search for users
  const handleSearch = async (query: string) => {
    if (!query || !user?.id) return;

    try {
      const response = await searchUsers({
        query: query,
        currentUserId: user.id,
      });
      setUsers(response?.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Start new chat
  const startNewChat = (userEmail: string, userName: string) => {
    setShowModal(false);
    router.push(`/messagedetail?email=${userEmail}&name=${userName}`);
  };

  return (
    <div className="p-4">
      {/* Simple Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chats</h1>

        {/* ✅ New Chat Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* ✅ Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">New Chat</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full p-3 border rounded-lg mb-4"
            />

            {/* User Results */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => startNewChat(user.email, user.name)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
>>>>>>> master
