import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    console.log('Joining room:', roomCode, 'as', username);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Glowing orb */}
      <motion.div
        className="absolute w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}
      ></motion.div>

      <div className="relative z-10 max-w-md w-full mx-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-green-400 mb-4 font-mono"
            style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.8)' }}>
            JOIN
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            {'>'} ENTER ACCESS CODE {'<'}
          </p>
        </motion.div>

        {/* Join Card */}
        <motion.div
          className="relative bg-black border-2 border-green-500 p-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            boxShadow: '0 0 40px rgba(0, 255, 0, 0.4), inset 0 0 30px rgba(0, 255, 0, 0.05)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>

          <form onSubmit={handleJoin} className="space-y-6">
            {/* Username */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-green-400 font-bold mb-2 text-lg font-mono">
                [USERNAME]
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-300 font-mono"
                placeholder="Enter your name"
                style={{ boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)' }}
                required
              />
            </motion.div>

            {/* Room Code */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-green-400 font-bold mb-2 text-lg font-mono">
                [ROOM_CODE]
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 text-3xl font-mono text-center placeholder-gray-600 focus:outline-none focus:border-green-300 tracking-[0.5em]"
                placeholder="ABC123"
                maxLength={6}
                style={{ 
                  boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)',
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
                }}
                required
              />
            </motion.div>

            {/* Join Button */}
            <motion.button
              type="submit"
              className="w-full bg-green-500 text-black px-8 py-4 font-bold text-lg hover:bg-green-400 transition-all duration-300 font-mono"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.6)',
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
              }}
            >
              {'>'} CONNECT {'<'}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate('/')}
              className="w-full px-8 py-3 bg-black border-2 border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-black transition-all duration-300 font-mono"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
            >
              BACK
            </motion.button>
          </form>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-500 mb-4 font-mono text-sm">
            {'>'} NO ACCESS CODE?
          </p>
          <button
            onClick={() => navigate('/host')}
            className="text-green-400 hover:text-green-300 font-mono font-bold underline"
          >
            CREATE YOUR OWN ROOM →
          </button>
        </motion.div>

        {/* Spectate Option */}
        <motion.div 
          className="mt-8 bg-black border border-green-500 p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)' }}
        >
          <p className="text-green-400 mb-3 font-mono">SPECTATOR MODE AVAILABLE</p>
          <button
            onClick={() => navigate('/spectate')}
            className="text-gray-400 hover:text-green-400 font-mono"
          >
            {'>'} WATCH DEBATES 👁️ {'<'}
          </button>
        </motion.div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

export default Join;
