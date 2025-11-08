import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Sparkles, Play, Award, Zap, History, Brain } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Trainer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const data = await api.get('/api/user/stats', true);
      setUserStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setLoading(false);
    }
  };

  const [isCreating, setIsCreating] = useState(false);

  const topics = [
    'AI Ethics and Regulation',
    'Climate Change Solutions',
    'Social Media Impact',
    'Universal Basic Income',
    'Space Exploration Funding'
  ];

  const startTraining = async () => {
    if (!selectedTopic) return;
    
    setIsCreating(true);
    try {
      const now = new Date();
      const roomData = {
        topic: `AI Training: ${selectedTopic}`,
        description: `Practice debate against AI on ${selectedTopic}`,
        scheduled_time: now.toISOString(),
        duration_minutes: 30,
        mode: 'text',
        type: '1v1',
        visibility: 'public',
        rounds: 3,
        resources: []
      };

      const response = await api.post('/api/rooms/create', roomData, true);
      
      if (response && response.room_code) {
        navigate(`/upcoming/${response.room_code}`);
      }
    } catch (error) {
      console.error('Error creating training room:', error);
      alert('Failed to create training room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const stats = userStats ? {
    level: userStats.level,
    totalXP: userStats.xp,
    avgLogic: userStats.avg_scores.logic,
    avgCredibility: userStats.avg_scores.credibility,
    avgRhetoric: userStats.avg_scores.rhetoric
  } : { level: 1, totalXP: 0, avgLogic: 0, avgCredibility: 0, avgRhetoric: 0 };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rust"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-rust to-accent-saffron rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">AI Trainer</h1>
          </div>
          <p className="text-text-secondary">Level up your debate skills with AI-powered training</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className="bg-gradient-to-br from-accent-rust to-accent-saffron rounded-2xl p-8 text-white relative overflow-hidden border border-accent-rust/30 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="relative text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <div className="text-7xl font-bold mb-2">{stats.level}</div>
                <p className="text-white/90 font-bold mb-6">Level {stats.level} Debater</p>
                <div className="bg-white/20 h-3 rounded-full mb-2">
                  <motion.div 
                    className="bg-white h-full rounded-full" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${((stats.totalXP % 100) / 100) * 100}%` }} 
                  />
                </div>
                <p className="text-sm text-white/90">{stats.totalXP} XP</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-dark-elevated border border-dark-warm rounded-2xl p-6 shadow-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-text-primary mb-6">Your Stats</h3>
              <div className="space-y-4">
                {[
                  {l:'Logic',v:stats.avgLogic,c:'accent-rust'},
                  {l:'Credibility',v:stats.avgCredibility,c:'accent-teal'},
                  {l:'Rhetoric',v:stats.avgRhetoric,c:'accent-saffron'}
                ].map((s,i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-secondary">{s.l}</span>
                      <span className="text-text-primary font-bold">{s.v}</span>
                    </div>
                    <div className="bg-dark-surface h-2 rounded-full">
                      <motion.div 
                        className={`bg-${s.c} h-full rounded-full`} 
                        initial={{ width: 0 }} 
                        animate={{ width: `${s.v}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-dark-elevated border border-dark-warm rounded-2xl p-8 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-accent-rust" />
                <h2 className="text-2xl font-bold text-text-primary">Start Training</h2>
              </div>
              <div className="space-y-3 mb-6">
                {topics.map((topic, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                      selectedTopic === topic 
                        ? 'bg-accent-rust/20 border-accent-rust text-text-primary' 
                        : 'bg-dark-surface border-dark-warm text-text-secondary hover:bg-dark-warm hover:border-accent-rust/50'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={startTraining}
                disabled={!selectedTopic || isCreating}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${
                  selectedTopic && !isCreating
                    ? 'bg-gradient-to-r from-accent-rust to-accent-saffron text-white hover:shadow-lg transition-all' 
                    : 'bg-dark-surface text-text-muted cursor-not-allowed'
                }`}
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Training
                  </>
                )}
              </button>
            </motion.div>

            <motion.div
              className="bg-dark-elevated border border-dark-warm rounded-2xl p-8 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <button
                onClick={() => navigate('/profile')}
                className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-accent-teal to-accent-saffron text-white hover:shadow-lg transition-all"
              >
                <History className="w-5 h-5" />
                View Past Debates
              </button>
              <p className="text-text-secondary text-sm text-center mt-3">Review your debate history and AI feedback</p>
            </motion.div>

            <motion.div
              className="bg-dark-elevated border border-accent-teal/30 rounded-2xl p-6 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-accent-teal" />
                <h3 className="text-xl font-bold text-text-primary">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                {[
                  {t:'Improve Credibility',d:'Include more specific statistics and sources'},
                  {t:'Strengthen Logic',d:'Practice connecting premises to conclusions'}
                ].map((r,i) => (
                  <div key={i} className="bg-dark-surface rounded-xl p-4 border border-dark-warm hover:border-accent-teal/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-accent-teal flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-text-primary mb-1">{r.t}</p>
                        <p className="text-text-secondary text-sm">{r.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Trainer;
