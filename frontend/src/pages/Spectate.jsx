import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Hash, Users, Clock, Flame, ArrowLeft } from 'lucide-react';

function Spectate() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const handleJoinSpectate = (e) => {
    e.preventDefault();
    console.log('Spectating room:', roomCode);
  };

  const sendReaction = (emoji) => {
    console.log('Sending reaction:', emoji);
  };

  const reactions = ['🔥', '👏', '💡', '🎯', '💪', '🏆'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Spectator Mode</h1>
            </div>
            <p className="text-slate-600">Watch debates and support your favorite debater</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Join Input */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8"
        >
          <form onSubmit={handleJoinSpectate} className="flex gap-4">
            <div className="flex-1 relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xl font-mono tracking-widest text-center transition-all"
                placeholder="ROOM CODE"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all"
            >
              <Eye className="w-5 h-5" />
              Watch
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Live Feed</h2>
                <motion.span
                  className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  LIVE
                </motion.span>
              </div>

              {/* Topic */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-purple-600 mb-1">Topic</p>
                <p className="text-lg font-bold text-slate-900">
                  AI will replace most jobs by 2030
                </p>
              </div>

              {/* Stream */}
              <div className="space-y-4 h-96 overflow-y-auto">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-900">Player 1</span>
                        <div className="flex gap-1">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold">L:85</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">C:78</span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">R:92</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        AI automation is already transforming industries...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Reactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Send Reaction</h3>
              <div className="grid grid-cols-3 gap-3">
                {reactions.map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-4xl p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-purple-50 hover:border-purple-200 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Watching', value: '127', icon: Users },
                  { label: 'Reactions', value: '523', icon: Flame },
                  { label: 'Duration', value: '12:34', icon: Clock }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Audience Support</h3>
              <div className="space-y-4">
                {[
                  { player: 'Player 1', percent: 65 },
                  { player: 'Player 2', percent: 35 }
                ].map((data) => (
                  <div key={data.player}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900">{data.player}</span>
                      <span className="font-bold text-indigo-600">{data.percent}%</span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-indigo-600 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${data.percent}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spectate;
