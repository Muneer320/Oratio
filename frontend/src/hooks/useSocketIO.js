import { useEffect, useState } from 'react';
import socketService from '../services/socketio';

export function useSocketIO(roomId) {
  const [isConnected, setIsConnected] = useState(false);
  const [newTurn, setNewTurn] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    // Connect to Socket.IO
    const socket = socketService.connect();
    setIsConnected(socket.connected);

    // Join the debate room
    socketService.joinRoom(roomId);

    // Listen for connection events
    const handleConnect = () => {
      setIsConnected(true);
      // Re-join room after reconnection
      socketService.joinRoom(roomId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Listen for new turns
    const handleNewTurn = (data) => {
      console.log('📨 New turn received:', data);
      setNewTurn(data);
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('new_turn', handleNewTurn);
    socketService.on('joined', (data) => {
      console.log('✅ Joined room:', data.room_id);
    });

    // Cleanup
    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('new_turn', handleNewTurn);
      socketService.leaveRoom(roomId);
    };
  }, [roomId]);

  return { isConnected, newTurn };
}
