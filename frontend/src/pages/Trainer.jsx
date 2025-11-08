import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, TrendingUp, Sparkles, ArrowLeft, Play, Award, Zap, 
  History, Brain, CheckCircle, MessageSquare, BookOpen, Send, Clock,
  Star, BarChart3, ChevronRight
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Trainer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeResponse, setChallengeResponse] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const fetchData = async () => {
    try {
      const [statsRes, progressRes, recsRes] = await Promise.all([
        api.get('/api/auth/stats', true),
        api.get(`/api/trainer/progress/${user?.id}`, true).catch(() => ({ user_id: user?.id, metrics_json: {}, recommendations: [], xp: 0, badges: [] })),
        api.get(`/api/trainer/recommendations/${user?.id}`, true).catch(() => ({ recommendations: [] }))
      ]);

      setStats(statsRes);
      setProgress(progressRes);
      setRecommendations(recsRes.recommendations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const trainingModules = [
    {
      id: 'logic',
      name: 'Logic Training',
      description: 'Master argument structure and reasoning',
      icon: Brain,
      color: 'indigo',
      exerciseType: 'refute',
      currentLevel: Math.floor((stats?.avg_logic || 0) / 10),
      avgScore: stats?.avg_logic || 0
    },
    {
      id: 'credibility',
      name: 'Credibility Training',
      description: 'Build trust through evidence and facts',
      icon: CheckCircle,
      color: 'blue',
      exerciseType: 'fact_check',
      currentLevel: Math.floor((stats?.avg_credibility || 0) / 10),
      avgScore: stats?.avg_credibility || 0
    },
    {
      id: 'rhetoric',
      name: 'Rhetoric Training',
      description: 'Enhance persuasive communication',
      icon: MessageSquare,
      color: 'purple',
      exerciseType: 'rephrase',
      currentLevel: Math.floor((stats?.avg_rhetoric || 0) / 10),
      avgScore: stats?.avg_rhetoric || 0
    }
  ];

  const startChallenge = async (module) => {
    setActiveModule(module);
    setChallengeFeedback(null);
    setChallengeResponse('');
    setTimer(180);
    setTimerActive(true);

    try {
      const response = await api.post('/api/trainer/challenge/start', {
        exercise_type: module.exerciseType
      }, true);

      setCurrentChallenge(response);
    } catch (error) {
      console.error('Error starting challenge:', error);
      alert('Failed to start challenge. Please try again.');
    }
  };

  const submitChallenge = async () => {
    if (!challengeResponse.trim()) {
      alert('Please provide a response before submitting.');
      return;
    }

    setSubmitting(true);
    setTimerActive(false);

    try {
      const response = await api.post('/api/trainer/challenge/submit', {
        challenge_id: currentChallenge.challenge_id,
        response: challengeResponse
      }, true);

      setChallengeFeedback(response);
      
      await fetchData();
    } catch (error) {
      console.error('Error submitting challenge:', error);
      alert('Failed to submit challenge. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetChallenge = () => {
    setCurrentChallenge(null);
    setActiveModule(null);
    setChallengeResponse('');
    setChallengeFeedback(null);
    setTimer(180);
    setTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-rust"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-rust to-accent-saffron rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-text-primary">AI TRAINER</h1>
            </div>
            <p className="text-text-secondary">Level Up • Train • Dominate</p>
          </div>
          <button 
            onClick={() => navigate('/home')} 
            className="px-6 py-3 bg-dark-elevated border border-dark-warm rounded-xl text-text-primary hover:bg-dark-surface transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {currentChallenge ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-dark-elevated rounded-2xl p-6 sm:p-8 border border-dark-warm shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{activeModule.name}</h2>
                  <p className="text-text-secondary">{currentChallenge.prompt}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-accent-rust/20 text-accent-rust rounded-xl font-bold">
                  <Clock className="w-5 h-5" />
                  {formatTime(timer)}
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={challengeResponse}
                  onChange={(e) => setChallengeResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full h-64 bg-dark-surface border border-dark-warm rounded-xl p-4 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-rust resize-none"
                  disabled={submitting || challengeFeedback}
                />

                <div className="flex gap-4">
                  <button
                    onClick={submitChallenge}
                    disabled={submitting || challengeFeedback || !challengeResponse.trim()}
                    className="flex-1 px-6 py-3 bg-accent-rust hover:bg-accent-rust/80 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? 'Analyzing...' : 'Submit Response'}
                  </button>
                  <button
                    onClick={resetChallenge}
                    className="px-6 py-3 bg-dark-surface border border-dark-warm text-text-primary rounded-xl font-medium hover:bg-dark-warm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {challengeFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 border border-accent-rust rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-accent-rust" />
                    <h3 className="text-xl font-bold text-text-primary">AI Feedback</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-text-primary mb-4">{challengeFeedback.feedback}</p>
                    
                    {challengeFeedback.analysis && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-400">{challengeFeedback.analysis.logic || 0}</div>
                          <div className="text-sm text-text-secondary">Logic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{challengeFeedback.analysis.credibility || 0}</div>
                          <div className="text-sm text-text-secondary">Credibility</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{challengeFeedback.analysis.rhetoric || 0}</div>
                          <div className="text-sm text-text-secondary">Rhetoric</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-accent-rust/30">
                      <span className="text-text-primary font-medium">XP Earned</span>
                      <span className="text-2xl font-bold text-accent-rust">+{challengeFeedback.xp_earned || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={resetChallenge}
                    className="w-full px-6 py-3 bg-accent-rust hover:bg-accent-rust/80 text-white rounded-xl font-bold transition-all"
                  >
                    Try Another Challenge
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                className="bg-gradient-to-br from-accent-rust to-accent-saffron rounded-2xl p-8 text-white shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4" />
                  <div className="text-6xl font-black mb-2">{stats?.level || 1}</div>
                  <p className="text-white/90 font-bold mb-6">LEVEL {stats?.level || 1} DEBATER</p>
                  <div className="bg-white/20 h-3 rounded-full mb-2">
                    <motion.div 
                      className="bg-white h-full rounded-full" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${stats?.level_progress || 0}%` }} 
                    />
                  </div>
                  <p className="text-sm text-white/90">{stats?.xp_in_level || 0} / {stats?.xp_to_next || 500} XP</p>
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
                    { label: 'Logic', value: stats?.avg_logic || 0, color: 'indigo' },
                    { label: 'Credibility', value: stats?.avg_credibility || 0, color: 'blue' },
                    { label: 'Rhetoric', value: stats?.avg_rhetoric || 0, color: 'purple' }
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-text-secondary">{s.label}</span>
                        <span className="text-text-primary font-bold">{s.value}</span>
                      </div>
                      <div className="bg-dark-surface h-2 rounded-full">
                        <motion.div 
                          className={`bg-${s.color}-500 h-full rounded-full`} 
                          initial={{ width: 0 }} 
                          animate={{ width: `${s.value * 10}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-dark-elevated border border-dark-warm rounded-2xl p-6 shadow-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-accent-rust" />
                  <h3 className="text-lg font-bold text-text-primary">Training XP</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-rust mb-2">{progress?.xp || 0}</div>
                  <div className="text-sm text-text-secondary">XP from Training</div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <motion.div
                className="bg-dark-elevated border border-dark-warm rounded-2xl p-6 sm:p-8 shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-accent-rust" />
                  <h2 className="text-2xl font-bold text-text-primary">Training Modules</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingModules.map((module) => (
                    <motion.div
                      key={module.id}
                      className="bg-dark-surface border border-dark-warm rounded-xl p-6 hover:border-accent-rust/50 transition-all cursor-pointer"
                      whileHover={{ y: -5 }}
                      onClick={() => startChallenge(module)}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${module.color}-500/20 flex items-center justify-center mb-4`}>
                        <module.icon className={`w-6 h-6 text-${module.color}-500`} />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary mb-2">{module.name}</h3>
                      <p className="text-sm text-text-secondary mb-4">{module.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-text-muted">Current Score</span>
                        <span className={`font-bold text-${module.color}-400`}>{module.avgScore}</span>
                      </div>
                      <button className="w-full px-4 py-2 bg-accent-rust hover:bg-accent-rust/80 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Training
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-dark-elevated border border-dark-warm rounded-2xl p-6 sm:p-8 shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-accent-saffron" />
                  <h2 className="text-2xl font-bold text-text-primary">AI Recommendations</h2>
                </div>
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary">
                    Complete some debates to get personalized recommendations!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="bg-dark-surface rounded-xl p-4 border border-dark-warm">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-accent-saffron flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-bold text-text-primary mb-1">{rec.exercise_type.replace('_', ' ').toUpperCase()}</p>
                            <p className="text-text-secondary text-sm mb-2">{rec.prompt}</p>
                            <span className="inline-block px-3 py-1 bg-accent-rust/20 text-accent-rust rounded-lg text-xs font-medium">
                              {rec.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="bg-dark-elevated border border-dark-warm rounded-2xl p-6 sm:p-8 shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-6 h-6 text-accent-rust" />
                  <h2 className="text-2xl font-bold text-text-primary">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-between gap-2 bg-gradient-to-r from-accent-rust to-accent-saffron text-white hover:opacity-90 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      View Your Profile
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate('/home')}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-between gap-2 bg-dark-surface border border-dark-warm text-text-primary hover:bg-dark-warm transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      View Past Debates
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Trainer;
