import { Chat } from "@/api/servierce/chatservis";
import { useEffect, useState } from "react";
import { Search, MessageCircle, Users, Video, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
const ContactsPage = () => {
  interface User {
    id: string;
    contact_name: string;
    contact_email: string;
  }
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userId = localStorage.getItem("UserId");
      try {
        const response = await Chat(userId);
        const data = await response?.data;

        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-72 h-screen flex flex-col bg-white border-r border-gray-200">
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
            "flex-1 py-3 flex flex-col items-center text-xs font-medium",
            activeTab === "contacts"
              ? "text-[#0078d4] border-b-2 border-[#0078d4]"
              : "text-gray-500 hover:text-[#0078d4]"
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
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center text-white font-semibold">
                  {user.contact_name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {user.contact_name}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ContactsPage;
