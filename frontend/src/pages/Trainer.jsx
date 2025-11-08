import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Sparkles, ArrowLeft, Play, Award, Zap, History } from 'lucide-react';

function Trainer() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    'AI Ethics and Regulation',
    'Climate Change Solutions',
    'Social Media Impact',
    'Universal Basic Income',
    'Space Exploration Funding'
  ];

  const stats = { level: 12, totalXP: 3420, avgLogic: 78, avgCredibility: 72, avgRhetoric: 85 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 animate-gradient"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white">AI TRAINER</h1>
            </div>
            <p className="text-white/60">Level Up • Train • Dominate</p>
          </motion.div>
          <button onClick={() => navigate('/home')} className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-8 text-white relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-yellow-600 animate-pulse-slow opacity-50" />
              <div className="relative text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <div className="text-7xl font-black mb-2">{stats.level}</div>
                <p className="text-yellow-100 font-bold mb-6">LEVEL {stats.level} DEBATER</p>
                <div className="bg-white/20 h-3 rounded-full mb-2">
                  <motion.div className="bg-white h-full rounded-full" initial={{ width: 0 }} animate={{ width: '73%' }} />
                </div>
                <p className="text-sm text-yellow-100">{stats.totalXP} / 5000 XP</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Your Stats</h3>
              <div className="space-y-4">
                {[{l:'Logic',v:stats.avgLogic,c:'indigo'},{l:'Credibility',v:stats.avgCredibility,c:'blue'},{l:'Rhetoric',v:stats.avgRhetoric,c:'purple'}].map((s,i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/60">{s.l}</span>
                      <span className="text-white font-bold">{s.v}</span>
                    </div>
                    <div className="bg-white/5 h-2 rounded-full">
                      <motion.div className={`bg-${s.c}-500 h-full rounded-full`} initial={{ width: 0 }} animate={{ width: `${s.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Start Training</h2>
              </div>
              <div className="space-y-3 mb-6">
                {topics.map((topic, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${selectedTopic === topic ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                    whileHover={{ x: 5 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
              <button
                disabled={!selectedTopic}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${selectedTopic ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              >
                <Play className="w-5 h-5" />
                Start Training
              </button>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <button
                onClick={() => navigate('/home')}
                className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700 transition-all"
              >
                <History className="w-5 h-5" />
                View Past Debates
              </button>
              <p className="text-white/60 text-sm text-center mt-3">Review your debate history and AI feedback</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 backdrop-blur-xl rounded-3xl p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                {[{t:'Improve Credibility',d:'Include more specific statistics and sources'},{t:'Strengthen Logic',d:'Practice connecting premises to conclusions'}].map((r,i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white mb-1">{r.t}</p>
                        <p className="text-white/60 text-sm">{r.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
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
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Trainer;
