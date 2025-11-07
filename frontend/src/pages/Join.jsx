import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight } from 'lucide-react';

function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    console.log('Joining room:', roomCode, 'as', username);
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
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Room Code
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

            <motion.button
              type="submit"
              className="w-full group px-6 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
