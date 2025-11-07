import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Hash, ArrowRight, Eye } from 'lucide-react';

function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    console.log('Joining room:', roomCode, 'as', username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Join Debate
          </h1>
          <p className="text-slate-600">
            Enter your room code to participate
          </p>
        </div>

        {/* Join Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
        >
          <form onSubmit={handleJoin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Room Code */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Room Code
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-2xl font-mono tracking-widest text-center transition-all"
                  placeholder="ABC123"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300"
              >
                Back
              </button>
            </div>
          </form>
        </motion.div>

        {/* Additional Options */}
        <motion.div 
          className="mt-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3">
              Don't have a room code?
            </p>
            <button
              onClick={() => navigate('/host')}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Create Your Own Room →
            </button>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <button
              onClick={() => navigate('/spectate')}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Watch as Spectator</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Join;
