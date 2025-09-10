"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Trash, MoreHorizontal } from "lucide-react";
import { deletechat, getUserChatList } from "@/api/servierce/chatservis";
import { useRouter } from "next/navigation";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";
import CustomPopup from "@/app/components/custommodel";
import { toast } from "react-toastify";
import { SearchUser } from "@/api/servierce/user";

interface UserType {
  id: string;
  name?: string;
}

interface Chatlist {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
}

const getInitials = (name?: string): string =>
  name ? name.charAt(0).toUpperCase() : "?";

function ChatList() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [chat, setChat] = useState<Chatlist[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();
  const { goToMessageDetail } = useMessageDetailStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
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
    if (!user?.id || !selectedChatId) return;
    try {
      const response = await deletechat({
        userId: user.id,
        otherUserId: selectedChatId,
      });
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
      setSelectedChatId(null);
      setOpenMenuId(null);
    }
  };

  const handleUserClick = (u: UserType) => {
    goToMessageDetail(u, router);
    setActiveChat(u.id);
    setSearch("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const renderUserItem = (u: UserType) => (
    <div
      key={u.id}
      onClick={() => handleUserClick(u)}
      className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition ${
        activeChat === u.id ? "bg-[#0078d4]/10 " : "hover:bg-gray-100"
      }`}
    >
      <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-bold shadow">
        {getInitials(u.name)}
      </div>
      <p className="font-medium text-gray-800 truncate">{u.name}</p>
    </div>
  );

  const renderChatItem = (c: Chatlist) => (
    <li
      key={c.userId}
      onClick={() => {
        goToMessageDetail({ id: c.userId, name: c.userName }, router);
        setActiveChat(c.userId);
      }}
      className={`group relative flex items-center gap-3 p-3 cursor-pointer rounded-lg transition ${
        activeChat === c.userId ? "bg-[#0078d4]/10 " : "hover:bg-gray-100"
      }`}
    >
      <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-bold shadow">
        {getInitials(c.userName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{c.userName}</p>
        <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
      </div>
      <div className="text-[11px] text-gray-400 whitespace-nowrap">
        {c.lastMessageAt
          ? new Date(c.lastMessageAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </div>
      <div
        className="absolute right-3 top-1 opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(openMenuId === c.userId ? null : c.userId);
        }}
      >
        <MoreHorizontal size={18} className="text-gray-500 hover:text-black" />
      </div>
      {openMenuId === c.userId && (
        <div
          className="absolute right-6 top-10 bg-white border rounded-xl shadow-lg w-36 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setSelectedChatId(c.userId);
              setShowPopup(true);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      )}
    </li>
  );

  return (
    <div className="w-80 h-screen flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 flex items-center  border-b border-gray-200">
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold shadow">
            {getInitials(name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">View profile</p>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0078d4] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-2">
        {showSearchResults ? (
          searchResults.length > 0 ? (
            <ul className="space-y-1">{searchResults.map(renderUserItem)}</ul>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              {isSearching ? "Searching..." : "No results found"}
            </div>
          )
        ) : chat.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No chats yet
          </div>
        ) : (
          <ul className="space-y-1">{chat.map(renderChatItem)}</ul>
        )}
      </div>

      {showPopup && (
        <CustomPopup
          Action="Delete"
          message="Are you sure you want to delete this chat?"
          oktest="Delete"
          onOk={handleDelete}
          onCancel={() => {
            setShowPopup(false);
            setSelectedChatId(null);
          }}
        />
      )}
    </div>
  );
}

export default ChatList;
