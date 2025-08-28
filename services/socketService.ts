<<<<<<< HEAD
import { io, Socket } from 'socket.io-client';
=======
import { io, Socket } from "socket.io-client";
>>>>>>> master

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  async connect(options = {}): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    const userId = localStorage.getItem("UserId");
    if (!userId) {
<<<<<<< HEAD
      throw new Error('User ID not found');
    }

    this.socket = io('http://192.168.5.124:3002', {
      transports: ['websocket'],
=======
      throw new Error("User ID not found");
    }

    this.socket = io("http://192.168.5.124:3002", {
      transports: ["websocket"],
>>>>>>> master
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 5000,
      query: { userId },
<<<<<<< HEAD
      ...options
=======
      ...options,
>>>>>>> master
    });

    return new Promise((resolve, reject) => {
      if (!this.socket) {
<<<<<<< HEAD
        reject(new Error('Socket initialization failed'));
        return;
      }

      this.socket.on('connect', () => {
        console.log('Socket connected with userId:', userId);
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
=======
        reject(new Error("Socket initialization failed"));
        return;
      }

      this.socket.on("connect", () => {
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
>>>>>>> master
        reject(error);
      });

      // Set timeout for initial connection
      setTimeout(() => {
        if (!this.socket?.connected) {
<<<<<<< HEAD
          reject(new Error('Connection timeout'));
=======
          reject(new Error("Connection timeout"));
>>>>>>> master
        }
      }, 5000);
    });
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SocketService;
