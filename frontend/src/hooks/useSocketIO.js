import { useEffect, useState } from 'react';
import socketService from '../services/socketio';

export function useSocketIO(roomId) {
  const [isConnected, setIsConnected] = useState(false);
  const [newTurn, setNewTurn] = useState(null);
  const [debateEnded, setDebateEnded] = useState(false);

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
    socketService.on('turn_removed', handleNewTurn);
    const handleDebateEnded = () => setDebateEnded(true);
    socketService.on('debate_ended', handleDebateEnded);
    socketService.on('joined', (data) => {
      console.log('✅ Joined room:', data.room_id);
    });

    // Cleanup
    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('new_turn', handleNewTurn);
      socketService.off('turn_removed', handleNewTurn);
      socketService.off('debate_ended', handleDebateEnded);
      socketService.leaveRoom(roomId);
    };
  }, [roomId]);

  return { isConnected, newTurn, debateEnded };
}
