import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DoorOpen, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function JoinRoomByCode({ className = '' }) {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const room = await api.getRoomByCode(roomCode.trim().toUpperCase());
      if (!room) {
        setError('Room not found');
        setIsLoading(false);
        return;
      }

      if (room.status === 'upcoming') {
        navigate(`/upcoming/${roomCode.trim().toUpperCase()}`);
      } else if (room.status === 'ongoing') {
        navigate(`/debate/${roomCode.trim().toUpperCase()}`);
      } else {
        setError('This debate has ended');
      }
    } catch (err) {
      setError(err.message || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={handleJoinRoom} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="Enter Room Code"
            className="flex-1 px-5 py-4 bg-dark-elevated border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-teal/50 focus:ring-2 focus:ring-accent-teal/20 transition-all text-lg font-mono"
            maxLength={6}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={isLoading || !roomCode.trim()}
            className="px-6 py-4 bg-gradient-to-br from-accent-teal to-accent-teal/80 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={!isLoading && roomCode.trim() ? { scale: 1.03 } : {}}
            whileTap={!isLoading && roomCode.trim() ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <DoorOpen className="w-5 h-5" />
            )}
            Join
          </motion.button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm px-1"
          >
            {error}
          </motion.p>
        )}
      </form>
    </div>
  );
}
