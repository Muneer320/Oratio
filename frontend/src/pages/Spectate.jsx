import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Hash, Users, Clock, Flame, ArrowLeft } from 'lucide-react';

function Spectate() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const reactions = ['🔥', '👏', '💡', '🎯', '💪', '🏆'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 animate-gradient"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white">SPECTATOR MODE</h1>
            </div>
            <p className="text-white/60">Watch • React • Support</p>
          </motion.div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <motion.div
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <form className="flex gap-4">
            <div className="flex-1 relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-center text-xl font-mono tracking-widest placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                placeholder="ROOM CODE"
                maxLength={6}
              />
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white">
              Watch
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Live Feed</h2>
                <motion.span
                  className="flex items-center gap-2 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-full font-bold"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  LIVE
                </motion.span>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6 mb-6">
                <p className="text-purple-400 text-sm font-bold mb-2">TOPIC</p>
                <p className="text-2xl font-bold text-white">AI will replace most jobs by 2030</p>
              </div>

              <div className="space-y-4 h-96 overflow-y-auto">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-white">Player 1</span>
                        <div className="flex gap-1">
                          {['L:85','C:78','R:92'].map((s,i) => (
                            <span key={i} className="text-xs bg-white/10 text-purple-400 px-2 py-1 rounded font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">AI automation is transforming industries...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Reactions</h3>
              <div className="grid grid-cols-3 gap-3">
                {reactions.map((emoji, i) => (
                  <motion.button
                    key={i}
                    className="text-4xl p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
              <div className="space-y-4">
                {[{l:'Watching',v:'127',i:Users},{l:'Reactions',v:'523',i:Flame},{l:'Duration',v:'12:34',i:Clock}].map((s,i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.i className="w-5 h-5 text-purple-400" />
                      <span className="text-white/60">{s.l}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{s.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Spectate;
