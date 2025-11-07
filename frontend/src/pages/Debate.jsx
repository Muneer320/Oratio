import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

function Debate() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [argument, setArgument] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const pulseRef = useRef(null);

  useEffect(() => {
    if (pulseRef.current && isRecording) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power1.out'
      });
    }
  }, [isRecording]);

  const handleSubmitTurn = () => {
    console.log('Submitting turn:', argument);
    setArgument('');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid background */}
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
              DEBATE ARENA
            </h1>
            <p className="text-gray-400 font-mono">
              ROOM: <span className="font-mono font-bold text-green-500">{roomCode || 'ABC123'}</span>
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/')}
            className="bg-black border-2 border-green-500 text-green-500 px-6 py-2 font-bold font-mono hover:bg-green-500 hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)' }}
          >
            EXIT
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-black border-2 border-green-500 p-6 sticky top-6"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.05)'
              }}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono">
                [LIVE_SCORES]
              </h2>
              
              {/* Player 1 */}
              <div className="mb-6 pb-6 border-b border-green-500">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400 font-bold text-lg font-mono">P1</span>
                  <span className="text-green-400 font-bold text-3xl font-mono"
                    style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}>
                    85
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'LOGIC', value: 85, color: '#00FF00' },
                    { label: 'CRED', value: 78, color: '#00CC00' },
                    { label: 'RHET', value: 92, color: '#00FF66' }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 font-mono text-sm">{stat.label}</span>
                        <span className="text-green-400 font-bold font-mono">{stat.value}</span>
                      </div>
                      <div className="bg-gray-900 h-1">
                        <motion.div 
                          className="h-1"
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          style={{ 
                            backgroundColor: stat.color,
                            boxShadow: `0 0 10px ${stat.color}`
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player 2 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400 font-bold text-lg font-mono">P2</span>
                  <span className="text-green-400 font-bold text-3xl font-mono"
                    style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}>
                    82
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'LOGIC', value: 88, color: '#00FF00' },
                    { label: 'CRED', value: 75, color: '#00CC00' },
                    { label: 'RHET', value: 83, color: '#00FF66' }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 font-mono text-sm">{stat.label}</span>
                        <span className="text-green-400 font-bold font-mono">{stat.value}</span>
                      </div>
                      <div className="bg-gray-900 h-1">
                        <motion.div 
                          className="h-1"
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          style={{ 
                            backgroundColor: stat.color,
                            boxShadow: `0 0 10px ${stat.color}`
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)'
              }}
            >
              <h3 className="text-sm font-bold text-green-500 mb-2 font-mono">
                [TOPIC]
              </h3>
              <p className="text-2xl font-bold text-green-400 font-mono">
                AI will replace most jobs by 2030
              </p>
            </motion.div>

            {/* Turn History */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6 h-96 overflow-y-auto custom-scrollbar"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 10px rgba(0, 255, 0, 0.05)'
              }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [TRANSMISSION_LOG]
              </h3>
              
              <AnimatePresence>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="mb-4 bg-gray-900 bg-opacity-50 border border-green-500 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 w-10 h-10 flex items-center justify-center text-black font-bold font-mono">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-green-400 font-mono">Player_1</span>
                        <span className="text-sm text-gray-500 font-mono">2:34</span>
                      </div>
                      <p className="text-gray-300 font-mono text-sm leading-relaxed">
                        AI automation is already transforming industries. Studies show 47% of jobs 
                        are at high risk of automation within the next two decades...
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 font-mono border border-green-500">
                          L:85
                        </span>
                        <span className="text-xs bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 font-mono border border-green-500">
                          C:78
                        </span>
                        <span className="text-xs bg-green-500 bg-opacity-20 text-green-400 px-2 py-1 font-mono border border-green-500">
                          R:92
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Input Area */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
              }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [YOUR_TURN]
              </h3>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-300 h-32 resize-none mb-4 font-mono"
                placeholder="> Type your argument..."
                style={{ boxShadow: 'inset 0 0 15px rgba(0, 255, 0, 0.1)' }}
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={handleSubmitTurn}
                  className="flex-1 bg-green-500 text-black px-6 py-3 font-bold hover:bg-green-400 transition-all duration-300 font-mono"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                    clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                  }}
                >
                  TRANSMIT
                </motion.button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`relative px-6 py-3 font-bold transition-all duration-300 font-mono ${
                    isRecording 
                      ? 'bg-red-500 text-black border-2 border-red-500' 
                      : 'bg-black text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-black'
                  }`}
                  style={{
                    boxShadow: isRecording ? '0 0 30px rgba(255, 0, 0, 0.6)' : '0 0 20px rgba(0, 255, 0, 0.3)'
                  }}
                >
                  {isRecording && (
                    <div
                      ref={pulseRef}
                      className="absolute inset-0 bg-red-500 rounded"
                      style={{ zIndex: -1 }}
                    ></div>
                  )}
                  {isRecording ? 'REC' : '🎙️'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Debate;
