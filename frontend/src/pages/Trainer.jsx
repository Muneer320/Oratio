import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

function Trainer() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const orbitRef = useRef(null);

  useEffect(() => {
    if (orbitRef.current) {
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });
    }
  }, []);

  const topics = [
    'AI Ethics and Regulation',
    'Climate Change Solutions',
    'Social Media Impact',
    'Universal Basic Income',
    'Space Exploration Funding'
  ];

  const challenges = [
    { id: 1, title: 'LOGIC_MASTER', description: 'Achieve 90+ Logic score in 3 debates', progress: 67, xp: 250 },
    { id: 2, title: 'CRED_EXPERT', description: 'Perfect fact-check score', progress: 40, xp: 300 },
    { id: 3, title: 'RHET_PRO', description: 'Win with 95+ Rhetoric score', progress: 85, xp: 400 }
  ];

  const stats = {
    totalDebates: 24,
    winRate: 62,
    avgLogic: 78,
    avgCredibility: 72,
    avgRhetoric: 85,
    totalXP: 3420,
    level: 12
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Orbiting element */}
      <div ref={orbitRef} className="absolute top-1/2 left-1/2 w-64 h-64" style={{ transformOrigin: 'center' }}>
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-500 rounded-full"
          style={{ boxShadow: '0 0 20px #00FF00' }}></div>
      </div>

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
              [AI_TRAINER]
            </h1>
            <p className="text-gray-400 font-mono">LEVEL_UP • TRAIN • DOMINATE</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-black border-2 border-green-500 text-green-500 px-6 py-2 font-bold font-mono hover:bg-green-500 hover:text-black transition-all duration-300"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)' }}
          >
            EXIT
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Card */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6 relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                boxShadow: '0 0 40px rgba(0, 255, 0, 0.5), inset 0 0 30px rgba(0, 255, 0, 0.1)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-10 rounded-full filter blur-3xl"></div>
              <div className="text-center relative z-10">
                <motion.div 
                  className="text-7xl font-bold text-green-400 mb-2 font-mono"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(0, 255, 0, 0.8)',
                      '0 0 40px rgba(0, 255, 0, 1)',
                      '0 0 20px rgba(0, 255, 0, 0.8)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stats.level}
                </motion.div>
                <p className="text-green-500 font-bold mb-4 font-mono">
                  LEVEL {stats.level} DEBATER
                </p>
                <div className="bg-gray-900 h-3 mb-2">
                  <motion.div
                    className="bg-green-500 h-3"
                    initial={{ width: 0 }}
                    animate={{ width: '73%' }}
                    transition={{ duration: 1 }}
                    style={{ boxShadow: '0 0 10px #00FF00' }}
                  ></motion.div>
                </div>
                <p className="text-sm text-gray-400 font-mono">
                  {stats.totalXP} / 5000 XP
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [YOUR_STATS]
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'LOGIC', value: stats.avgLogic, color: '#00FF00' },
                  { label: 'CREDIBILITY', value: stats.avgCredibility, color: '#00CC00' },
                  { label: 'RHETORIC', value: stats.avgRhetoric, color: '#00FF66' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 font-mono text-sm">{stat.label}</span>
                      <span className="text-green-400 font-bold font-mono">{stat.value}</span>
                    </div>
                    <div className="bg-gray-900 h-2">
                      <motion.div 
                        className="h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ 
                          backgroundColor: stat.color,
                          boxShadow: `0 0 10px ${stat.color}`
                        }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-green-500 space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-400">TOTAL_DEBATES</span>
                    <span className="text-green-400 font-bold">{stats.totalDebates}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-400">WIN_RATE</span>
                    <span className="text-green-400 font-bold">{stats.winRate}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Session */}
            <motion.div
              className="bg-black border-2 border-green-500 p-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono">
                [TRAINING_SESSION]
              </h2>
              
              <div className="mb-6">
                <label className="block text-green-400 font-bold mb-3 font-mono">
                  SELECT_TOPIC:
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {topics.map((topic) => (
                    <motion.button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-4 text-left transition-all duration-300 font-mono ${
                        selectedTopic === topic
                          ? 'bg-green-500 text-black border-2 border-green-400'
                          : 'bg-black text-green-400 border-2 border-green-500 hover:bg-green-500 hover:bg-opacity-20'
                      }`}
                      whileHover={{ x: 5 }}
                      style={{
                        boxShadow: selectedTopic === topic 
                          ? '0 0 20px rgba(0, 255, 0, 0.6)' 
                          : '0 0 10px rgba(0, 255, 0, 0.2)'
                      }}
                    >
                      {'>'} {topic}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                disabled={!selectedTopic}
                className={`w-full py-4 font-bold text-lg transition-all duration-300 font-mono ${
                  selectedTopic
                    ? 'bg-green-500 text-black hover:bg-green-400'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={selectedTopic ? { scale: 1.02 } : {}}
                whileTap={selectedTopic ? { scale: 0.98 } : {}}
                style={{
                  boxShadow: selectedTopic ? '0 0 30px rgba(0, 255, 0, 0.6)' : 'none',
                  clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                }}
              >
                INITIALIZE_TRAINING
              </motion.button>
            </motion.div>

            {/* Challenges */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
            >
              <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono">
                [ACTIVE_CHALLENGES]
              </h2>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    className="bg-gray-900 bg-opacity-50 border border-green-500 p-5"
                    whileHover={{ x: 5 }}
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-green-400 font-mono">
                          {challenge.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-mono">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="bg-green-500 text-black px-3 py-1 font-bold text-sm font-mono">
                        +{challenge.xp}XP
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-900 h-2">
                        <motion.div 
                          className="bg-green-500 h-2"
                          initial={{ width: 0 }}
                          animate={{ width: `${challenge.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          style={{ boxShadow: '0 0 10px #00FF00' }}
                        ></motion.div>
                      </div>
                      <span className="text-green-400 font-bold text-sm font-mono">
                        {challenge.progress}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              className="bg-black border-2 border-green-500 p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)' }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                [AI_RECOMMENDATIONS]
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'IMPROVE_CREDIBILITY', text: 'Include more specific statistics and sources in your arguments.' },
                  { title: 'STRENGTHEN_LOGIC', text: 'Practice connecting premises to conclusions more explicitly.' }
                ].map((rec, i) => (
                  <motion.div
                    key={i}
                    className="bg-gray-900 bg-opacity-50 border border-green-500 p-4"
                    whileHover={{ x: 5 }}
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)' }}
                  >
                    <p className="text-green-500 font-bold mb-1 font-mono text-sm">
                      {'>'} {rec.title}:
                    </p>
                    <p className="text-gray-300 font-mono text-sm">
                      {rec.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Trainer;
