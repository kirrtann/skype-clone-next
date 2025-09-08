"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat, getUserChatList, SearchUser } from "@/api/servierce/chatservis";
import { useRouter } from "next/navigation";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";

interface User {
  id: string;
  name?: string;
  email?: string;
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
  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [name, setName] = useState("");
  const [chat, setChat] = useState<ChatList[]>([]);
  const { user } = useUser();
  const router = useRouter();
  const { goToMessageDetail } = useMessageDetailStore();

  // set logged in user name
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  // fetch contacts
  const fetchUsers = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await Chat(user.id);
      setUsers(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // fetch chat list
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

  // search with debounce
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

  // filtered contacts
  const filteredUsers = useMemo(() => {
    if (showSearchResults) return searchResults;
    if (activeTab === "contacts") return users;
    if (search.trim()) {
      return users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return users;
  }, [activeTab, search, users, searchResults, showSearchResults]);

  // render contact item
  const renderUserItem = useCallback(
    (u: User) => (
      <div
        key={u.id}
        onClick={() => goToMessageDetail(u, router)}
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors"
      >
        <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
          {getInitials(u.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{u.name}</p>
          <p className="text-xs text-gray-500 truncate">{u.email}</p>
        </div>
      </div>
    ),
    [goToMessageDetail, router]
  );

  // render chat item
  const renderChatItem = useCallback(
    (c: ChatList) => (
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
    ),
    [goToMessageDetail, router]
  );

  return (
    <div className="w-72 h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">
            {name || "User"}
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Content */}
      {showSearchResults ? (
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 tracking-wide">
              RESULTS
            </div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(renderUserItem)
            ) : (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                {isSearching ? "Searching..." : "No results found"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab("chats")}
              className={cn(
                "flex-1 py-3 flex flex-col items-center text-xs font-medium transition-colors",
                activeTab === "chats"
                  ? "text-[#0078d4] border-b-2 border-[#0078d4] font-semibold"
                  : "text-gray-500 hover:text-[#0078d4]"
              )}
            >
              <MessageCircle size={20} />
              <span className="mt-1">Chats</span>
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={cn(
                "flex-1 py-3 flex flex-col items-center text-xs font-medium transition-colors",
                activeTab === "contacts"
                  ? "text-[#0078d4] border-b-2 border-[#0078d4] font-semibold"
                  : "text-gray-500 hover:text-[#0078d4]"
              )}
            >
              <Users size={20} />
              <span className="mt-1">Contacts</span>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {activeTab === "chats" ? (
              chat.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No chats yet
                </div>
              ) : (
                chat.map(renderChatItem)
              )
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No contacts
              </div>
            ) : (
              filteredUsers.map(renderUserItem)
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ChatList;
