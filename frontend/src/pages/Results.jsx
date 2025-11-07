import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Trophy, Home, Plus, Target, Users, Clock, Sparkles, Star } from 'lucide-react';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from('.trophy-icon', {
      rotation: -360,
      scale: 0,
      duration: 1.5,
      ease: 'back.out(2)',
      delay: 0.3
    });

    gsap.to('.trophy-icon', {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);

  const results = {
    winner: 'Player 1',
    scores: {
      player1: { name: 'Player 1', total: 87, logic: 85, credibility: 82, rhetoric: 94 },
      player2: { name: 'Player 2', total: 81, logic: 88, credibility: 75, rhetoric: 80 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-purple-600 to-blue-600 animate-gradient"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 1 }}
        >
          <motion.div className="trophy-icon inline-block mb-6">
            <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-2xl filter" />
          </motion.div>
          <h1 className="text-6xl font-black text-white mb-6">DEBATE COMPLETE!</h1>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 px-10 py-5 rounded-3xl">
            <Star className="w-8 h-8 text-white" />
            <span className="text-3xl font-black text-white">WINNER: {results.winner.toUpperCase()}</span>
            <Star className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {Object.entries(results.scores).map(([key, player], i) => (
            <motion.div
              key={key}
              className={`bg-white/5 backdrop-blur-2xl border-4 rounded-3xl p-8 ${results.winner === player.name ? 'border-yellow-500' : 'border-white/10'}`}
              initial={{ x: i === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.2 }}
            >
              {results.winner === player.name && (
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-2 bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 px-6 py-2 rounded-full font-bold">
                    <Trophy className="w-5 h-5" />
                    WINNER
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">{player.name}</h3>
                <div className="text-7xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {player.total}
                </div>
                <p className="text-white/60 font-semibold">Final Score</p>
              </div>
              <div className="space-y-4">
                {[{l:'Logic',v:player.logic},{l:'Credibility',v:player.credibility},{l:'Rhetoric',v:player.rhetoric}].map((s,i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-white/70">{s.l}</span>
                    <span className="text-2xl font-bold text-white">{s.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[{l:'New Debate',i:Plus,p:'/host',c:'from-purple-600 to-blue-600'},{l:'Train',i:Trophy,p:'/trainer',c:'from-yellow-600 to-orange-600'},{l:'Home',i:Home,p:'/',c:'from-slate-600 to-slate-700'}].map((b,i) => (
            <button
              key={i}
              onClick={() => navigate(b.p)}
              className={`px-10 py-5 bg-gradient-to-r ${b.c} rounded-2xl font-bold text-lg text-white flex items-center gap-2`}
            >
              <b.i className="w-6 h-6" />
              {b.l}
            </button>
          ))}
        </motion.div>
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

export default Results;
