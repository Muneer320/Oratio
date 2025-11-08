import React, { useState, useEffect } from 'react';
import { Trophy, Target, Flame, Award, TrendingUp, BarChart3, Brain, MessageSquare, CheckCircle, XCircle, Calendar, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [badges, setBadges] = useState([]);
  const [badgeStats, setBadgeStats] = useState({ total_earned: 0, total_available: 9 });
  const [userStats, setUserStats] = useState(null);
  const [debateHistory, setDebateHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historyOffset, setHistoryOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDebateHistory();
  }, [historyFilter]);

  const fetchData = async () => {
    try {
      const [badgesRes, statsRes] = await Promise.all([
        api.get('/api/auth/badges', true),
        api.get('/api/auth/stats', true)
      ]);

      setBadges(badgesRes.badges || []);
      setBadgeStats({
        total_earned: badgesRes.total_earned || 0,
        total_available: badgesRes.total_available || 9
      });
      setUserStats(statsRes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchDebateHistory = async (loadMore = false) => {
    try {
      setHistoryLoading(true);
      const offset = loadMore ? historyOffset : 0;
      const response = await api.get(
        `/api/auth/debate-history?filter_type=${historyFilter}&limit=20&offset=${offset}`,
        true
      );
      
      if (loadMore) {
        setDebateHistory([...debateHistory, ...response.debates]);
      } else {
        setDebateHistory(response.debates || []);
        setHistoryOffset(0);
      }
      
      setHasMore(response.has_more || false);
      setHistoryOffset(offset + 20);
      setHistoryLoading(false);
    } catch (error) {
      console.error('Error fetching debate history:', error);
      setHistoryLoading(false);
    }
  };

  const loadMoreDebates = () => {
    fetchDebateHistory(true);
  };

  const getTopSkills = () => {
    if (!userStats) return [];
    const skills = [
      { name: 'Logic', value: userStats.avg_logic, icon: Brain, color: 'indigo' },
      { name: 'Credibility', value: userStats.avg_credibility, icon: CheckCircle, color: 'blue' },
      { name: 'Rhetoric', value: userStats.avg_rhetoric, icon: MessageSquare, color: 'purple' }
    ];
    return skills.sort((a, b) => b.value - a.value);
  };

  const getBestDebate = () => {
    if (debateHistory.length === 0) return null;
    return debateHistory.reduce((best, debate) => {
      const total = debate.logic + debate.credibility + debate.rhetoric;
      const bestTotal = best.logic + best.credibility + best.rhetoric;
      return total > bestTotal ? debate : best;
    }, debateHistory[0]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const topSkills = getTopSkills();
  const bestDebate = getBestDebate();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-elevated rounded-2xl p-6 sm:p-8 border border-dark-warm shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-rust to-accent-saffron flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {(user?.username || user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-3xl font-bold text-text-primary mb-2">{user?.username || user?.name || 'User'}</h1>
              <p className="text-text-secondary mb-3">Member since {new Date().toLocaleDateString()}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="px-4 py-2 bg-accent-rust/20 text-accent-rust rounded-xl font-medium inline-block">
                  Level {userStats?.level || 1}
                </div>
                <div className="flex-1 bg-dark-surface rounded-full h-3 max-w-xs">
                  <div
                    className="bg-gradient-to-r from-accent-rust to-accent-saffron h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userStats?.level_progress || 0}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary">{userStats?.level_progress || 0}% to Level {(userStats?.level || 1) + 1}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-accent-rust/20 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-accent-rust" />
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{userStats?.total_debates || 0}</div>
            <div className="text-sm text-text-secondary">Total Debates</div>
          </div>

          <div className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{userStats?.wins || 0}W - {userStats?.losses || 0}L</div>
            <div className="text-sm text-text-secondary">Win/Loss Record</div>
          </div>

          <div className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{userStats?.win_rate || 0}%</div>
            <div className="text-sm text-text-secondary">Win Rate</div>
          </div>

          <div className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-accent-saffron/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent-saffron" />
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{userStats?.total_xp || 0}</div>
            <div className="text-sm text-text-secondary">Total XP</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-accent-rust" />
              <h2 className="text-xl font-bold text-text-primary">Average Scores</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Logic
                  </span>
                  <span className="text-text-primary font-bold">{userStats?.avg_logic || 0}</span>
                </div>
                <div className="bg-dark-surface rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userStats?.avg_logic || 0) * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Credibility
                  </span>
                  <span className="text-text-primary font-bold">{userStats?.avg_credibility || 0}</span>
                </div>
                <div className="bg-dark-surface rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userStats?.avg_credibility || 0) * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Rhetoric
                  </span>
                  <span className="text-text-primary font-bold">{userStats?.avg_rhetoric || 0}</span>
                </div>
                <div className="bg-dark-surface rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userStats?.avg_rhetoric || 0) * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-text-primary">Top Skills</h2>
            </div>
            <div className="space-y-3">
              {topSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl">
                  <div className={`w-10 h-10 rounded-lg bg-${skill.color}-500/20 flex items-center justify-center`}>
                    <skill.icon className={`w-5 h-5 text-${skill.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-text-primary font-medium">{skill.name}</div>
                    <div className="text-sm text-text-secondary">Score: {skill.value}</div>
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {bestDebate && (
            <div className="bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 rounded-2xl p-6 border border-accent-rust shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-accent-rust" />
                <h2 className="text-xl font-bold text-text-primary">Best Debate</h2>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{bestDebate.topic}</h3>
              <p className="text-sm text-text-secondary mb-4">{formatDate(bestDebate.date)}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Logic</span>
                  <span className="font-bold text-indigo-400">{bestDebate.logic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Credibility</span>
                  <span className="font-bold text-blue-400">{bestDebate.credibility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rhetoric</span>
                  <span className="font-bold text-purple-400">{bestDebate.rhetoric}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-accent-rust/30">
                  <div className="flex justify-between">
                    <span className="text-text-primary font-semibold">Total Score</span>
                    <span className="font-bold text-accent-rust text-lg">{bestDebate.logic + bestDebate.credibility + bestDebate.rhetoric}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-dark-elevated rounded-2xl p-6 sm:p-8 border border-dark-warm shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-accent-rust" />
              <h2 className="text-2xl font-bold text-text-primary">Debate History</h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-text-secondary" />
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="bg-dark-surface border border-dark-warm rounded-xl px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-rust"
              >
                <option value="all">All Debates</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {historyLoading && debateHistory.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rust"></div>
            </div>
          ) : debateHistory.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              No debates found. Join a debate to get started!
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {debateHistory.map((debate) => (
                  <div
                    key={debate.id}
                    className="bg-dark-surface rounded-xl p-4 sm:p-6 border border-dark-warm hover:border-accent-rust/50 transition-all cursor-pointer"
                    onClick={() => debate.has_result && navigate(`/results/${debate.id}`)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-text-primary">{debate.topic}</h3>
                          {debate.won ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-sm font-medium flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Won
                            </span>
                          ) : debate.has_result ? (
                            <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-sm font-medium flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              Lost
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-dark-warm text-text-secondary rounded-lg text-sm font-medium">
                              No Result
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{formatDate(debate.date)}</p>
                        
                        {debate.has_result && (
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-xs text-text-secondary mb-1">Logic</div>
                              <div className="font-bold text-indigo-400">{debate.logic}</div>
                            </div>
                            <div>
                              <div className="text-xs text-text-secondary mb-1">Credibility</div>
                              <div className="font-bold text-blue-400">{debate.credibility}</div>
                            </div>
                            <div>
                              <div className="text-xs text-text-secondary mb-1">Rhetoric</div>
                              <div className="font-bold text-purple-400">{debate.rhetoric}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {debate.has_result && (
                        <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMoreDebates}
                    disabled={historyLoading}
                    className="px-6 py-3 bg-accent-rust hover:bg-accent-rust/80 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {historyLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-dark-elevated rounded-2xl p-6 sm:p-8 border border-dark-warm shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-accent-rust" />
              <h2 className="text-2xl font-bold text-text-primary">Badges & Achievements</h2>
            </div>
            <div className="px-4 py-2 bg-accent-rust/20 text-accent-rust rounded-xl font-medium">
              {badgeStats.total_earned} / {badgeStats.total_available} Earned
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, i) => (
              <div
                key={badge.id || i}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 border-accent-rust'
                    : 'bg-dark-surface border-dark-warm opacity-60'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{badge.name}</h3>
                <p className="text-sm text-text-secondary mb-2">{badge.description}</p>
                <p className="text-xs text-text-muted italic">{badge.criteria}</p>
                {badge.earned && (
                  <div className="mt-3 text-xs text-accent-rust font-medium">✓ Earned</div>
                )}
                {!badge.earned && (
                  <div className="mt-3 text-xs text-text-muted">🔒 Locked</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
