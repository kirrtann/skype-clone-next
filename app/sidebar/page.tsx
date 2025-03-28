"use client"

import { useState } from "react"
import { Search, MessageCircle, Users, Video, Bell, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

function SkypeSidebar() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("chats")

  const users = [
    { id: 1, name: "Mitesh", status: "online", unread: 3, time: "2m" },
    { id: 2, name: "Mitul", status: "away", unread: 0, time: "1h" },
    { id: 3, name: "Mehul", status: "offline", time: "5h" },
    { id: 4, name: "David", status: "online", time: "Yesterday" },
  ]

  // Filter users based on search
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
const Name  = localStorage.getItem("name");
  return (
    <div className="w-72 h-screen flex flex-col bg-white border-r border-gray-200">
       {/* User Profile */}
       <div className="p-3 border-t border-gray-200 flex items-center gap-3 bg-gray-50">
        <div className="w-9 h-9 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
          Y 
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800">{Name}</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Online
          </div>
        </div>
      </div>
      {/* Header */}
     

      {/* Search Bar */}
      <div className="relative p-4 border-b border-gray-200">
        <Search className="absolute left-6 top-7 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="People, groups, messages"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-2 py-2 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm"
        />
      </div>

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
        <button
          onClick={() => setActiveTab("calls")}
          className={cn(
            "flex-1 py-3 flex flex-col items-center text-xs font-medium",
            activeTab === "calls" ? "text-[#0078d4] border-b-2 border-[#0078d4]" : "text-gray-500 hover:text-[#0078d4]",
          )}
        >
          <Video size={20} />
          <span className="mt-1">Calls</span>
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
                  {user.name.charAt(0)}
                </div>
                <div
                  className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                    user.status === "online"
                      ? "bg-green-500"
                      : user.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Last message preview...</p>
              </div>
              {user.unread > 0 && (
                <div className="min-w-5 h-5 bg-[#0078d4] rounded-full flex items-center justify-center text-white text-xs">
                  {user.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>

     
    </div>
  )
}

export default SkypeSidebar

