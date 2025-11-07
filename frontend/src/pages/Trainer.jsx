import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Sparkles, ArrowLeft, Play, Award } from 'lucide-react';

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

  const challenges = [
    { id: 1, title: 'Logic Master', description: 'Achieve 90+ Logic score in 3 debates', progress: 67, xp: 250 },
    { id: 2, title: 'Credibility Expert', description: 'Perfect fact-check score', progress: 40, xp: 300 },
    { id: 3, title: 'Rhetoric Pro', description: 'Win with 95+ Rhetoric score', progress: 85, xp: 400 }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">AI Trainer</h1>
            </div>
            <p className="text-slate-600">Improve your skills with AI-powered training</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200"
            >
              <div className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <div className="text-6xl font-bold mb-2">{stats.level}</div>
                <p className="text-indigo-100 font-semibold mb-6">Level {stats.level} Debater</p>
                <div className="bg-white/20 h-3 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="bg-white h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '73%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-sm text-indigo-100">
                  {stats.totalXP} / 5000 XP
                </p>
              </div>
            </motion.div>

            {/* Personal Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Your Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Logic', value: stats.avgLogic, color: 'indigo' },
                  { label: 'Credibility', value: stats.avgCredibility, color: 'blue' },
                  { label: 'Rhetoric', value: stats.avgRhetoric, color: 'purple' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                      <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className={`bg-${stat.color}-600 h-full rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Debates</span>
                    <span className="font-bold text-slate-900">{stats.totalDebates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Win Rate</span>
                    <span className="font-bold text-indigo-600">{stats.winRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Session */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-900">Start Training Session</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Select Topic
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {topics.map((topic) => (
                    <motion.button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-4 text-left rounded-xl transition-all border-2 ${
                        selectedTopic === topic
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <span className="font-medium">{topic}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selectedTopic}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                  selectedTopic
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5" />
                Start Training
              </button>
            </div>

            {/* Active Challenges */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-900">Active Challenges</h2>
              </div>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap">
                        +{challenge.xp} XP
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="bg-indigo-600 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${challenge.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 min-w-[50px] text-right">
                        {challenge.progress}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Improve Credibility', text: 'Include more specific statistics and sources in your arguments.' },
                  { title: 'Strengthen Logic', text: 'Practice connecting premises to conclusions more explicitly.' }
                ].map((rec, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-indigo-100"
                  >
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 mb-1 text-sm">{rec.title}</p>
                        <p className="text-slate-600 text-sm">{rec.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trainer;
