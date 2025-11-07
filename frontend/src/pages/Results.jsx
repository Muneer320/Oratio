import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const trophyRef = useRef(null);

  useEffect(() => {
    if (trophyRef.current) {
      gsap.to(trophyRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
      
      gsap.to(trophyRef.current, {
        rotation: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, []);

  const results = {
    topic: 'AI will replace most jobs by 2030',
    winner: 'Player 1',
    scores: {
      player1: { name: 'Player_1', total: 87, logic: 85, credibility: 82, rhetoric: 94 },
      player2: { name: 'Player_2', total: 81, logic: 88, credibility: 75, rhetoric: 80 }
    },
    turns: 6,
    duration: '18:42',
    spectators: 127
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Victory glow */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      ></motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Winner Announcement */}
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 1 }}
        >
          <motion.div 
            ref={trophyRef}
            className="text-8xl mb-4"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0, 255, 0, 0.8))'
            }}
          >
            🏆
          </motion.div>
          <h1 className="text-6xl font-bold text-green-400 mb-4 font-mono"
            style={{ textShadow: '0 0 20px rgba(0, 255, 0, 1)' }}>
            [DEBATE_COMPLETE]
          </h1>
          <motion.div
            className="inline-block bg-green-500 text-black px-8 py-3 text-3xl font-bold font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 0, 0.8)',
              clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
            }}
          >
            WINNER: {results.winner.toUpperCase()}
          </motion.div>
        </motion.div>

        {/* Topic */}
        <motion.div
          className="bg-black border-2 border-green-500 p-6 mb-8 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
        >
          <p className="text-sm font-bold text-green-500 mb-2 font-mono">[TOPIC]</p>
          <p className="text-2xl font-bold text-green-400 font-mono">
            {results.topic}
          </p>
        </motion.div>

        {/* Final Scores */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {Object.entries(results.scores).map(([key, player], index) => (
            <motion.div
              key={key}
              className={`bg-black border-4 p-8 ${
                results.winner === player.name.replace('_', ' ')
                  ? 'border-green-500'
                  : 'border-gray-700'
              }`}
              initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 + index * 0.2 }}
              style={{
                boxShadow: results.winner === player.name.replace('_', ' ')
                  ? '0 0 40px rgba(0, 255, 0, 0.6)'
                  : '0 0 10px rgba(0, 255, 0, 0.1)',
                transformStyle: 'preserve-3d'
              }}
            >
              {results.winner === player.name.replace('_', ' ') && (
                <div className="text-5xl text-center mb-4"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))' }}>
                  👑
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-400 mb-2 font-mono">
                  {player.name}
                </h3>
                <motion.div 
                  className="text-7xl font-bold text-green-400 font-mono"
                  style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.8)' }}
                  animate={{
                    scale: results.winner === player.name.replace('_', ' ') ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  {player.total}
                </motion.div>
                <p className="text-gray-400 font-mono">FINAL_SCORE</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'LOGIC', value: player.logic },
                  { label: 'CREDIBILITY', value: player.credibility },
                  { label: 'RHETORIC', value: player.rhetoric }
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono">{stat.label}</span>
                    <span className="text-green-400 font-bold text-xl font-mono">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="bg-black border-2 border-green-500 p-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}
        >
          <h3 className="text-xl font-bold text-green-400 mb-4 text-center font-mono">
            [DEBATE_STATISTICS]
          </h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { label: 'TURNS', value: results.turns },
              { label: 'DURATION', value: results.duration },
              { label: 'SPECTATORS', value: results.spectators }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.7 + i * 0.1 }}
              >
                <div className="text-5xl font-bold text-green-400 mb-2 font-mono"
                  style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}>
                  {stat.value}
                </div>
                <p className="text-gray-400 font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button
            onClick={() => navigate('/host')}
            className="bg-green-500 text-black px-8 py-4 font-bold text-lg hover:bg-green-400 transition-all duration-300 font-mono"
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 0, 0.6)',
              clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
            }}
          >
            NEW_DEBATE
          </button>
          <button
            onClick={() => navigate('/trainer')}
            className="bg-black border-2 border-green-500 text-green-500 px-8 py-4 font-bold text-lg hover:bg-green-500 hover:text-black transition-all duration-300 font-mono"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
          >
            TRAIN_MODE
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-black border-2 border-green-500 text-green-500 px-8 py-4 font-bold text-lg hover:bg-green-500 hover:text-black transition-all duration-300 font-mono"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
          >
            HOME
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

export default Results;
