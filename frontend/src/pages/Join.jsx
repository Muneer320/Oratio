import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../services/api';

function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [team, setTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const joinData = {
        room_code: roomCode.toUpperCase(),
        team: team || null,
      };

      await api.post('/api/participants/join', joinData, true);
      
      navigate(`/debate/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError(err.message || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 noise-bg flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Join Debate</h1>
          <p className="text-slate-600">Enter your room code to participate</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Room Code *
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-center text-3xl font-bold tracking-[0.3em] placeholder-slate-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                placeholder="ABC123"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Team (Optional)
              </label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                placeholder="e.g., Team A"
              />
              <p className="mt-2 text-xs text-slate-500">Only needed for team debates</p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full group px-6 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Joining...' : 'Join Now'}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-slate-50 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 mb-2">Don't have a room code?</p>
            <button
              onClick={() => navigate('/host')}
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              Create Your Own Room →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Join;
