import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Plus, Users, Clock, FileText, ArrowLeft, Sparkles, Zap, Check } from 'lucide-react';

function Host() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    timeLimit: 300,
    maxParticipants: 2,
    description: ''
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    gsap.from('.form-container', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating room:', formData);
  };

  const features = [
    { icon: Sparkles, text: 'AI-Powered Judging' },
    { icon: Users, text: 'Live Spectators' },
    { icon: Zap, text: 'Real-time Scoring' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient"></div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="fixed w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ top: '10%', left: '10%' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 px-4 py-2 rounded-full mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span className="text-white/90 text-sm font-medium">Create Room</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-none">
              HOST A
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                DEBATE
              </span>
            </h1>

            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              Create your debate room and invite participants to join an AI-judged competition
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg text-white/80">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            className="form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 animate-pulse-slow"></div>

              <form onSubmit={handleSubmit} className="relative space-y-6">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    Debate Topic
                  </label>
                  <motion.input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                    placeholder="e.g., AI will replace most jobs by 2030"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Description (Optional)
                  </label>
                  <motion.textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 h-24 resize-none transition-all"
                    placeholder="Add context or rules..."
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Time Limit */}
                  <div>
                    <label className="block text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Time/Turn
                    </label>
                    <select
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    >
                      <option value={60}>1 min</option>
                      <option value={120}>2 min</option>
                      <option value={180}>3 min</option>
                      <option value={300}>5 min</option>
                    </select>
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label className="block text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      Debaters
                    </label>
                    <select
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
                    >
                      <option value={2}>2 (1v1)</option>
                      <option value={4}>4 (2v2)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full group relative px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg text-white overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Room
                    <Check className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full px-8 py-4 bg-white/5 border-2 border-white/10 rounded-2xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </form>
            </div>
          </motion.div>
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

export default Host;
