"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat, SearchUser } from "@/api/servierce/chatservis";
import { useRouter } from "next/navigation";
import useUser from "../zustand/useUser";
import { useMessageDetailStore } from "../zustand/MessageUser";

interface User {
  id: string;
  contact_name: string;
  contact_email: string;
  name?: string;
  email?: string;
}

const getInitials = (name?: string): string =>
  name ? name.charAt(0).toUpperCase() : "?";

function SkypeSidebar() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [name, setName] = useState("");

  const { user } = useUser();
  const router = useRouter();
  const { goToMessageDetail } = useMessageDetailStore();

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

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

  // Handle search with debounce
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

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (showSearchResults) return searchResults;
    if (activeTab === "contacts") return users;
    if (search.trim()) {
      return users.filter((u) =>
        u.contact_name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return users;
  }, [activeTab, search, users, searchResults, showSearchResults]);

  // Render user item
  const renderUserItem = useCallback(
    (user: User) => (
      <div
        key={user.id}
        onClick={() => goToMessageDetail(user, router)}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {getInitials(user.name || user.contact_name)}
        </div>
        <div>
          <p className="font-medium">{user.name || user.contact_name}</p>
        </div>
      </div>
    ),
    [goToMessageDetail, router]
  );

  return (
    <div className="w-72 h-screen flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-3 border-t border-gray-200 flex items-center gap-3 bg-gray-50">
        <div className="w-9 h-9 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800 text-[20px] truncate">
            {name || "User"}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative p-4 border-b border-gray-200">
        <Search className="absolute left-6 top-7 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search Skype"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-2 py-2 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm"
        />
        {isSearching && (
          <div className="absolute right-6 top-7">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-[#0078d4] rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Content */}
      {showSearchResults ? (
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">
              RESULTS
            </div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(renderUserItem)
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                {isSearching ? "Searching..." : "No results found"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200">
            <button
              onClick={() => setActiveTab("chats")}
              className={cn(
                "flex-1 py-3 flex flex-col items-center text-xs font-medium transition-colors",
                activeTab === "chats"
                  ? "text-[#0078d4] border-b-2 border-[#0078d4]"
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
                  ? "text-[#0078d4] border-b-2 border-[#0078d4]"
                  : "text-gray-500 hover:text-[#0078d4]"
              )}
            >
              <Users size={20} />
              <span className="mt-1">Contacts</span>
            </button>
          </div>

          {/* Users */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {activeTab === "chats" ? "No chats found" : "No contacts found"}
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

export default SkypeSidebar;
