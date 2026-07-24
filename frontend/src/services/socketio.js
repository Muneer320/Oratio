import { io } from 'socket.io-client';
import api from './api';

// Use production API URL or fall back to current origin
const SOCKET_URL = import.meta.env.VITE_API_URL || window.location.origin;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: (callback) => callback({ token: api.getToken() }),
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('join_room', { room_id: roomId });
      console.log(`👥 Joining room: ${roomId}`);
    }
  }

  leaveRoom(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', { room_id: roomId });
      console.log(`👋 Leaving room: ${roomId}`);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
