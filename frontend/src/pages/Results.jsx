import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home, Plus, Target, Users, Clock, Brain, CheckCircle2 } from 'lucide-react';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const results = {
    topic: 'AI will replace most jobs by 2030',
    winner: 'Player 1',
    scores: {
      player1: { name: 'Player 1', total: 87, logic: 85, credibility: 82, rhetoric: 94 },
      player2: { name: 'Player 2', total: 81, logic: 88, credibility: 75, rhetoric: 80 }
    },
    turns: 6,
    duration: '18:42',
    spectators: 127
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Winner Announcement */}
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-block mb-6"
          >
            <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-lg" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Debate Complete!
          </h1>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl">
            <Trophy className="w-6 h-6" />
            <span className="text-2xl font-bold">Winner: {results.winner}</span>
          </div>
        </motion.div>

        {/* Topic */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-8 text-center border border-slate-200 shadow-sm"
        >
          <p className="text-sm font-semibold text-slate-600 mb-2">Topic</p>
          <p className="text-2xl font-bold text-slate-900">{results.topic}</p>
        </motion.div>

        {/* Final Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(results.scores).map(([key, player], index) => (
            <motion.div
              key={key}
              initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-white rounded-2xl p-8 border-2 shadow-lg ${
                results.winner === player.name
                  ? 'border-indigo-600 shadow-indigo-200'
                  : 'border-slate-200'
              }`}
            >
              {results.winner === player.name && (
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                    <Trophy className="w-4 h-4" />
                    Winner
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{player.name}</h3>
                <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {player.total}
                </div>
                <p className="text-slate-600 font-medium">Final Score</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Logic', value: player.logic, icon: Brain },
                  { label: 'Credibility', value: player.credibility, icon: CheckCircle2 },
                  { label: 'Rhetoric', value: player.rhetoric, icon: Target }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700 font-medium">{stat.label}</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-sm"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Debate Statistics</h3>
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { label: 'Total Turns', value: results.turns, icon: Target },
              { label: 'Duration', value: results.duration, icon: Clock },
              { label: 'Spectators', value: results.spectators, icon: Users }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/host')}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            New Debate
          </button>
          <button
            onClick={() => navigate('/trainer')}
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
          >
            <Trophy className="w-5 h-5" />
            Training Mode
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Results;
