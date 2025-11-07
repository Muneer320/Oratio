import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { LogIn, User, Hash, ArrowRight, Eye, Sparkles } from 'lucide-react';

function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    gsap.from('.join-container', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    });

    gsap.to('.floating-element', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.2
    });
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    console.log('Joining room:', roomCode, 'as', username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 animate-gradient"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="floating-element fixed w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"
        style={{ top: '20%', left: '10%' }}
      />
      <motion.div
        className="floating-element fixed w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20"
        style={{ bottom: '20%', right: '10%' }}
      />

      <motion.div
        className="join-container w-full max-w-2xl relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Glow Circle */}
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full filter blur-3xl opacity-30"
          animate={{
            scale: isFocused ? 1.5 : 1,
            opacity: isFocused ? 0.5 : 0.3
          }}
          transition={{ duration: 0.8 }}
        />

        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 relative">
            <LogIn className="w-10 h-10 text-white" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h1 className="text-6xl font-black text-white mb-4">
            JOIN <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DEBATE</span>
          </h1>
          <p className="text-xl text-white/60">
            Enter your room code to participate
          </p>
        </motion.div>

        {/* Join Card */}
        <motion.div
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Animated Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 animate-pulse-slow rounded-[2.5rem]"></div>

          <form onSubmit={handleJoin} className="relative space-y-8">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Your Name
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </motion.div>
            </div>

            {/* Room Code */}
            <div>
              <label className="block text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-400" />
                Room Code
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-6 py-6 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-4xl font-bold text-center tracking-[0.5em] placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  placeholder="ABC123"
                  maxLength={6}
                  required
                />
                {roomCode.length === 6 && (
                  <motion.div
                    className="absolute right-6 top-1/2 transform -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <motion.button
                type="submit"
                className="w-full group relative px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-xl text-white overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Join Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full px-8 py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all"
              >
                Back
              </button>
            </div>
          </form>
        </motion.div>

        {/* Additional Options */}
        <motion.div 
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <p className="text-white/50 mb-4">Don't have a room code?</p>
            <button
              onClick={() => navigate('/host')}
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors text-lg"
            >
              Create Your Own Room →
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <button
              onClick={() => navigate('/spectate')}
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              <Eye className="w-5 h-5" />
              Watch as Spectator
            </button>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Join;
