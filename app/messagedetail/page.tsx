"use client"

import { getmeassage } from '@/api/servierce/chatservis'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SocketService from '@/services/socketService'


enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

interface Message {
  id: number;
  room_id: string;
  sender: string;
  message: string;
  created_at: string;
  sender_name: string;
}

const Messagehistory = () => {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [messageInput, setMessageInput] = useState('')
  const [room, setRoom] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<string[]>([]);
  const currentUserId = localStorage.getItem("UserId")

  useEffect(() => {
    let mounted = true;
    const socketService = SocketService.getInstance();

    const initializeSocket = async () => {
      try {
        setConnectionStatus(ConnectionStatus.CONNECTING);
        const socket = await socketService.connect();

        if (!mounted) return;

        // Handle initial connection
        socket.on('connect', () => {
          console.log('Socket connected');
          setConnectionStatus(ConnectionStatus.CONNECTED);
          setError(null);
        });

        // Join room once connected
        const targetUserId = searchParams.get('email');
        if (targetUserId && currentUserId && socket.connected) {
          const roomId = [currentUserId, targetUserId].sort().join('-');
          console.log('Attempting to join room:', roomId);
          socket.emit('join-room', roomId);
        }

        // Handle room joined confirmation
        socket.on('room-joined', (data) => {
          console.log('Successfully joined room:', data);
          setRoom(data.roomId);
          if (data.users) {
            setUsers(data.users);
          }
        });

        // Handle user updates in room
        socket.on('user-update', (data) => {
          console.log('Users update:', data);
          setUsers(data.users);
        });

        // Handle private messages
        socket.on('private-message', (data) => {
          console.log('Received message:', data);
          setMessages(prev => [...prev, {
            id: Date.now(),
            room_id: data.room,
            sender: data.userId,
            message: data.text,
            created_at: new Date().toISOString(),
            sender_name: data.userId === currentUserId ? 'You' : 'Other'
          }]);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
          setError(error.message);
        });

      } catch (error: any) {
        if (!mounted) return;
        setConnectionStatus(ConnectionStatus.ERROR);
        setError(error.message || 'Failed to establish connection');
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
      socketService.disconnect();
    };
  }, [searchParams, currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const credentials = {
          otherUserEmail: searchParams.get('email'),
          UserId: localStorage.getItem("UserId"),
        };

        const response = await getmeassage(credentials)
        if (response?.data) {
          setMessages(response.data)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [searchParams])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !room) return;
    
    const socketService = SocketService.getInstance();
    const socket = socketService.getSocket();
    
    if (!socket) {
      setError('Socket connection not available');
      return;
    }

    try {
      socket.emit('private-message', {
        room,
        message: messageInput,
      }, (acknowledgement: any) => {
        if (acknowledgement?.error) {
          console.error('Message send error:', acknowledgement.error);
          setError(acknowledgement.error);
        } else {
          console.log('Message sent successfully');
          setMessageInput('');
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError('Failed to send message');
    }
  };

  if (connectionStatus === ConnectionStatus.ERROR || error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {error || 'Connection error occurred'}
      </div>
    )
  }

  if (loading) return <div className="flex-1 flex items-center justify-center">Loading...</div>

  return (
    <div className="flex flex-col h-screen">
      {/* Add users list */}
      <div className="bg-gray-100 p-4 border-b">
        <h3 className="text-sm font-medium text-gray-600">Users in Room:</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {users.map((user, index) => (
            <span key={index} className="px-2 py-1 bg-white rounded-full text-xs shadow-sm">
              {user}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <>
          <div> 
            
          </div>
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.sender === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === currentUserId
                  ? 'bg-[#0078d4] text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              {message.sender !== currentUserId && (
                <div className="text-xs font-medium mb-1 text-gray-500">
                  {message.sender_name}
                </div>
              )}
              <p className="text-sm">{message.message}</p>
              <span className="text-xs mt-1 block opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
          </>
        ))}

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
          />
          <button 
            onClick={handleSendMessage}
            className="px-4 py-2 bg-[#0078d4] text-white rounded-full hover:bg-[#006abc]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Messagehistory
