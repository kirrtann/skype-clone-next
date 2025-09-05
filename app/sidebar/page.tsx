"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { getUserChatList } from "@/api/servierce/chatservis";
import { useRouter } from "next/navigation";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";

interface ChatList {
  userId: string;
  userName: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

const getInitials = (name?: string): string =>
  name ? name.charAt(0).toUpperCase() : "?";

function ChatList() {
  const [search, setSearch] = useState("");
  const [chat, setChat] = useState<ChatList[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const { goToMessageDetail } = useMessageDetailStore();

  const UserChatList = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await getUserChatList(user.id);
      setChat(response?.data || []);
    } catch (error) {
      console.error("fetch error", error);
    }
  }, [user?.id]);

  useEffect(() => {
    UserChatList();
  }, [UserChatList]);

  const filteredChats = chat.filter((c) =>
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  const renderChatItem = (c: ChatList) => (
    <div
      key={c.userId}
      onClick={() =>
        goToMessageDetail({ id: c.userId, name: c.userName }, router)
      }
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors"
    >
      <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
        {getInitials(c.userName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{c.userName}</p>
        <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
      </div>
      <div className="text-[10px] text-gray-400 whitespace-nowrap">
        {c.lastMessageAt
          ? new Date(c.lastMessageAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </div>
    </div>
  );

  return (
    <div className="w-72 h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200">
      <div className="p-4 flex items-center gap-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(user?.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">
            {user?.name || "User"}
          </div>
        </div>
      </div>
      <div className="relative p-4 border-b border-gray-200 bg-gray-50">
        <Search className="absolute left-7 top-7 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-2 py-2 bg-white text-gray-800 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm shadow-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No chats yet
          </div>
        ) : (
          filteredChats.map(renderChatItem)
        )}
      </div>
    </div>
  );
}

export default ChatList;
