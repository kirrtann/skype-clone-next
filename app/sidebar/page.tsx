"use client"

import { useEffect, useState } from "react"
import { Search, MessageCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Chat, Newcontact, SearchUser } from "@/api/servierce/chatservis"

interface User {
  id: string;
  contact_name: string;
  contact_email: string;
  name? : string;
  email? : string;
}

const getInitials = (name: string | undefined) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

function SkypeSidebar() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("chats")
  const [users, setUsers] = useState<User[]>([])
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const userId = localStorage.getItem("UserId")
      try {
        const response = await Chat(userId)
        const data = await response?.data
        console.log("Fetched users:", data);

        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (search.trim()) {
        handleSearch();
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setIsSearching(true);
    try {
      const response = await SearchUser(search);
      if (response?.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  }

  const filteredUsers = activeTab === "contacts"
    ? (search ? searchResults : users)
    : users.filter((user) => user.contact_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-72 h-screen flex flex-col bg-white border-r border-gray-200">
      {/* User Profile */}
      <div className="p-3 border-t border-gray-200 flex items-center gap-3 bg-gray-50">
        {/* <div className="w-9 h-9 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
          {Name?.charAt(0)}
        </div> */}
        {/* <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800 text-[20px]">{Name}</div>
        </div> */}
      </div>

      {/* Search Bar */}
      <div className="relative p-4 border-b border-gray-200">
        <Search className="absolute left-6 top-7 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search Skype"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-2 py-2 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm"
        />
      </div>

      {/* Search Results or Regular Content */}
      {showSearchResults ? (
        <div className="flex-1 overflow-y-auto">
          {/* Chat Results */}
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">CHATS</div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(user?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{user?.contact_name || 'Unknown User'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No chats found</div>
            )}
          </div>

          {/* People Results */}
          <div className="py-2 border-t border-gray-200">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">PEOPLE</div>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(user?.contact_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{user?.name || 'Unknown User'}</div>
                    <div className="text-xs text-gray-500">{user?.email || 'No email'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No people found</div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200">
            <button
              onClick={() => setActiveTab("chats")}
              className={cn(
                "flex-1 py-3 flex flex-col items-center text-xs font-medium",
                activeTab === "chats" ? "text-[#0078d4] border-b-2 border-[#0078d4]" : "text-gray-500 hover:text-[#0078d4]",
              )}
            >
              <MessageCircle size={20} />
              <span className="mt-1">Chats</span>
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={cn(
                "flex-1 py-3 flex flex-col items-center text-xs font-medium",
                activeTab === "contacts"
                  ? "text-[#0078d4] border-b-2 border-[#0078d4]"
                  : "text-gray-500 hover:text-[#0078d4]",
              )}
            >
              <Users size={20} />
              <span className="mt-1">Contacts</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No contacts found</div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(user?.contact_name)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{user?.contact_name || 'Unknown User'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SkypeSidebar

