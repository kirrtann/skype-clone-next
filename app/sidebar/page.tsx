"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, MessageCircle, Trash, MoreHorizontal } from "lucide-react";
import {
  deletechat,
  getUserChatList,
  SearchUser,
} from "@/api/servierce/chatservis";
import { useRouter } from "next/navigation";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";
import CustomPopup from "@/app/components/custommodel";
import { toast } from "react-toastify";

interface User {
  id: string;
  name?: string;
}

interface ChatList {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
}

const getInitials = (name?: string): string =>
  name ? name.charAt(0).toUpperCase() : "?";

function ChatList() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [chat, setChat] = useState<ChatList[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const { goToMessageDetail } = useMessageDetailStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const name = user?.name || "User";
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

  // search users
  const handleSearch = useCallback(async () => {
    if (!search.trim()) return;
    setIsSearching(true);
    try {
      const response = await SearchUser(search);
      setSearchResults(response?.data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        handleSearch();
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, handleSearch]);

  const handleDelete = async () => {
    const data = {
      userId: "dasdas",
      otherUserId: "asadasdsa",
    };
    try {
      const response = await deletechat(data);
      if (response?.success) {
        toast.success("Chat deleted successfully");
        UserChatList();
      } else {
        toast.error(response?.message || "Failed to delete chat");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setShowPopup(false);
    }
  };

  const renderUserItem = (u: User) => (
    <div
      key={u.id}
      onClick={() => goToMessageDetail(u, router)}
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors"
    >
      <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
        {getInitials(u.name)}
      </div>
      <p className="font-medium text-gray-800 truncate">{u.name}</p>
    </div>
  );

  const renderChatItem = (c: ChatList) => (
    <li
      key={c.userId}
      className="group relative flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors"
      onClick={() =>
        goToMessageDetail({ id: c.userId, name: c.userName }, router)
      }
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
      <div
        className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(openMenuId === c.userId ? null : c.userId);
        }}
      >
        <MoreHorizontal size={20} className="text-gray-500 hover:text-black" />
      </div>
      {openMenuId === c.userId && (
        <div
          className="absolute right-6 top-8 bg-white border rounded-lg shadow-md w-28 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      )}
    </li>
  );

  return (
    <div className="w-72 h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200">
      <div className="p-4 flex items-center gap-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">
            {name}
          </div>
        </div>
      </div>
      <div className="relative p-4 border-b border-gray-200 bg-gray-50">
        <Search className="absolute left-7 top-7 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search chats or contacts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-2 py-2 bg-white text-gray-800 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm shadow-sm"
        />
        {isSearching && (
          <div className="absolute right-6 top-7">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0078d4] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {showSearchResults ? (
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 tracking-wide">
              RESULTS
            </div>
            {searchResults.length > 0 ? (
              <ul>{searchResults.map(renderUserItem)}</ul>
            ) : (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                {isSearching ? "Searching..." : "No results found"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start border-b border-gray-200 bg-white">
            <div className="flex-1 py-3 flex flex-col items-center text-xs text-[#0078d4] border-b-2 border-[#0078d4] font-semibold">
              <MessageCircle size={20} />
              <span className="mt-1">Chats</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {chat.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No chats yet
              </div>
            ) : (
              <ul>{chat.map(renderChatItem)}</ul>
            )}
          </div>
        </>
      )}
      {showPopup && (
        <CustomPopup
          Action="Delete"
          message="Are you sure you want to delete this chat?"
          oktest="Delete"
          onOk={handleDelete}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default ChatList;
