import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-green-400 font-mono"
              style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}>
              [SPECTATOR_MODE]
            </h1>
            <p className="text-gray-400 font-mono">OBSERVE • REACT • SUPPORT</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-black border-2 border-green-500 text-green-500 px-6 py-2 font-bold font-mono hover:bg-green-500 hover:text-black transition-all duration-300"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)' }}
          >
            EXIT
          </button>
        </motion.div>

        {/* Join Input */}
        <motion.div
          className="bg-black border-2 border-green-500 p-6 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
        >
          <form onSubmit={handleJoinSpectate} className="flex gap-4">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 bg-black border-2 border-green-500 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-300 font-mono text-center text-xl tracking-[0.5em]"
              placeholder="ROOM_CODE"
              maxLength={6}
              style={{ boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)' }}
            />
            <button
              type="submit"
              className="bg-green-500 text-black px-8 py-3 font-bold hover:bg-green-400 transition-all duration-300 font-mono"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
              }}
            >
              CONNECT
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Feed */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-400 font-mono">
                  [LIVE_FEED]
                </h2>
                <motion.span
                  className="flex items-center gap-2 bg-red-500 bg-opacity-20 text-red-400 px-3 py-1 border border-red-500 font-mono text-sm"
                  animate={{
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  LIVE
                </motion.span>
              </div>

              {/* Topic */}
              <div className="bg-gray-900 border border-green-500 p-4 mb-6">
                <p className="text-sm font-bold text-green-500 mb-1 font-mono">TOPIC:</p>
                <p className="text-xl font-bold text-green-400 font-mono">
                  AI will replace most jobs by 2030
                </p>
              </div>

              {/* Stream */}
              <div className="space-y-4 h-96 overflow-y-auto custom-scrollbar">
                <motion.div
                  className="bg-gray-900 bg-opacity-50 border border-green-500 p-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 w-10 h-10 flex items-center justify-center text-black font-bold font-mono">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-green-400 font-mono">Player_1</span>
                        <div className="flex gap-1 text-xs">
                          <span className="bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 border border-green-500 font-mono">
                            L:85
                          </span>
                          <span className="bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 border border-green-500 font-mono">
                            C:78
                          </span>
                          <span className="bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 border border-green-500 font-mono">
                            R:92
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">
                        AI automation is already transforming industries...
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Reactions */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [REACTIONS]
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['🔥', '👏', '💡', '🎯', '💪', '🏆'].map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-4xl p-3 bg-gray-900 border border-green-500 hover:bg-green-500 hover:border-green-400 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)' }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [STATS]
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'WATCHING', value: '127', icon: '👥' },
                  { label: 'REACTIONS', value: '523', icon: '🔥' },
                  { label: 'DURATION', value: '12:34', icon: '⏱️' }
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono text-sm">
                      {stat.icon} {stat.label}
                    </span>
                    <span className="text-green-400 font-bold text-xl font-mono"
                      style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [SUPPORT]
              </h3>
              <div className="space-y-3">
                {[
                  { player: 'P1', percent: 65 },
                  { player: 'P2', percent: 35 }
                ].map((data) => (
                  <div key={data.player}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-green-400 font-bold font-mono">{data.player}</span>
                      <span className="text-green-400 font-bold font-mono">{data.percent}%</span>
                    </div>
                    <div className="bg-gray-900 h-2">
                      <motion.div 
                        className="h-2 bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${data.percent}%` }}
                        transition={{ duration: 1 }}
                        style={{ boxShadow: '0 0 10px #00FF00' }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
          border: 1px solid #00FF00;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00FF00;
          box-shadow: 0 0 10px #00FF00;
        }
      `}</style>
    </div>
  );
}

export default Spectate;
