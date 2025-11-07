import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

function Host() {
  const navigate = useNavigate();
  const scanlineRef = useRef(null);
  const [formData, setFormData] = useState({
    topic: '',
    timeLimit: 300,
    maxParticipants: 2,
    description: ''
  });

  useEffect(() => {
    // Scanning animation
    if (scanlineRef.current) {
      gsap.to(scanlineRef.current, {
        y: 400,
        duration: 2,
        repeat: -1,
        ease: 'none'
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating room:', formData);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Scanning line effect */}
      <div 
        ref={scanlineRef}
        className="absolute left-0 right-0 h-1 bg-green-500 opacity-30 filter blur-sm"
        style={{ top: 0 }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-green-400 mb-4 font-mono"
            style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.8)' }}>
            HOST DEBATE
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            {'>'} INITIALIZE DEBATE ROOM {'<'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="relative bg-black border-2 border-green-500 p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.05)'
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-green-400 font-bold mb-2 text-lg font-mono">
                [TOPIC] *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-300 font-mono"
                placeholder="AI will replace most jobs by 2030"
                style={{ boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)' }}
                required
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-green-400 font-bold mb-2 text-lg font-mono">
                [DESCRIPTION]
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-300 h-24 resize-none font-mono"
                placeholder="Optional context or rules..."
                style={{ boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)' }}
              />
            </motion.div>

            {/* Time Limit */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-green-400 font-bold mb-2 text-lg font-mono">
                [TIME_LIMIT] seconds/turn
              </label>
              <select
                value={formData.timeLimit}
                onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 focus:outline-none focus:border-green-300 font-mono"
                style={{ boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)' }}
              >
                <option value={60}>60s</option>
                <option value={120}>120s</option>
                <option value={180}>180s</option>
                <option value={300}>300s</option>
              </select>
            </motion.div>

            {/* Max Participants */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-green-400 font-bold mb-2 text-lg font-mono">
                [DEBATERS]
              </label>
              <select
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-black border-2 border-green-500 text-green-400 focus:outline-none focus:border-green-300 font-mono"
                style={{ boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.1)' }}
              >
                <option value={2}>2 (1v1)</option>
                <option value={4}>4 (2v2)</option>
              </select>
            </motion.div>

            {/* Buttons */}
            <motion.div 
              className="flex gap-4 pt-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                className="flex-1 bg-green-500 text-black px-8 py-4 font-bold text-lg hover:bg-green-400 transition-all duration-300 font-mono relative overflow-hidden group"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                  clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
                }}
              >
                CREATE ROOM
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-black border-2 border-green-500 text-green-500 font-bold text-lg hover:bg-green-500 hover:text-black transition-all duration-300 font-mono"
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
                }}
              >
                CANCEL
              </button>
            </motion.div>
          </form>
        </motion.div>

        {/* Info Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: '🔗', text: 'ROOM CODE' },
            { icon: '👥', text: 'SPECTATORS' },
            { icon: '🤖', text: 'AI JUDGE' }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-black border border-green-500 p-4 text-center"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)' }}
            >
              <div className="text-3xl mb-2 filter drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
                {item.icon}
              </div>
              <p className="text-green-400 font-bold font-mono text-sm">{item.text}</p>
            </div>
          ))}
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

export default Host;
