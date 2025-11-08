import React, { useState, useEffect } from 'react';
import { Trophy, Target, Flame, Award, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
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

  const stats = userStats ? [
    { icon: Trophy, label: 'Debates Joined', value: userStats.debates_joined.toString(), color: 'indigo' },
    { icon: Target, label: 'Debates Hosted', value: userStats.debates_hosted.toString(), color: 'blue' },
    { icon: Flame, label: 'Win Rate', value: `${userStats.win_rate}%`, color: 'orange' },
    { icon: TrendingUp, label: 'XP Points', value: userStats.xp.toLocaleString(), color: 'green' },
  ] : [
    { icon: Trophy, label: 'Debates Joined', value: '0', color: 'indigo' },
    { icon: Target, label: 'Debates Hosted', value: '0', color: 'blue' },
    { icon: Flame, label: 'Win Rate', value: '0%', color: 'orange' },
    { icon: TrendingUp, label: 'XP Points', value: '0', color: 'green' },
  ];

  const badgesEarned = userStats?.badges_earned || [];
  
  const badges = [
    { id: 'fact_finder', name: 'Fact Finder', icon: '🔍', description: 'Verified 50+ claims', earned: badgesEarned.includes('fact_finder') },
    { id: 'rhetoric_master', name: 'Rhetoric Master', icon: '🎭', description: 'Achieved 90+ rhetoric score', earned: badgesEarned.includes('rhetoric_master') },
    { id: 'logic_legend', name: 'Logic Legend', icon: '🧠', description: 'Achieved 95+ logic score', earned: badgesEarned.includes('logic_legend') },
    { id: 'debate_champion', name: 'Debate Champion', icon: '🏆', description: 'Won 50 debates', earned: badgesEarned.includes('debate_champion') },
    { id: 'marathon_debater', name: 'Marathon Debater', icon: '⏱️', description: 'Participated in 100 debates', earned: badgesEarned.includes('marathon_debater') },
    { id: 'rising_star', name: 'Rising Star', icon: '⭐', description: 'Reach level 10', earned: badgesEarned.includes('rising_star') },
    { id: 'credibility_expert', name: 'Credibility Expert', icon: '✅', description: 'Achieved 95+ credibility score', earned: badgesEarned.includes('credibility_expert') },
    { id: 'quick_thinker', name: 'Quick Thinker', icon: '⚡', description: 'Won 10 debates', earned: badgesEarned.includes('quick_thinker') },
    { id: 'team_player', name: 'Team Player', icon: '🤝', description: 'Won 20 team debates', earned: badgesEarned.includes('team_player') },
  ];

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
      <div className="max-w-5xl mx-auto">
        <div className="bg-dark-elevated rounded-2xl p-8 border border-dark-warm shadow-lg mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-rust to-accent-saffron flex items-center justify-center text-white text-4xl font-bold">
              {(user?.username || user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary mb-2">{userStats?.username || user?.username || user?.name || 'User'}</h1>
              <p className="text-text-secondary mb-3">Member since {new Date().toLocaleDateString()}</p>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-accent-rust/20 text-accent-rust rounded-xl font-medium">
                  Level {userStats?.level || 1}
                </div>
                <div className="flex-1 bg-dark-surface rounded-full h-3 max-w-xs">
                  <div
                    className="bg-gradient-to-r from-accent-rust to-accent-saffron h-3 rounded-full"
                    style={{ width: `${userStats?.xp_progress || 0}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary">{userStats?.xp_progress || 0}% to Level {(userStats?.level || 1) + 1}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-dark-elevated rounded-2xl p-6 border border-dark-warm shadow-lg">
              <div className={`w-12 h-12 rounded-xl bg-accent-rust/20 flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 text-accent-rust`} />
              </div>
              <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-dark-elevated rounded-2xl p-8 border border-dark-warm shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-accent-rust" />
            <h2 className="text-2xl font-bold text-text-primary">Badges & Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 border-accent-rust'
                    : 'bg-dark-surface border-dark-warm opacity-60'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{badge.name}</h3>
                <p className="text-sm text-text-secondary">{badge.description}</p>
                {badge.earned && (
                  <div className="mt-3 text-xs text-accent-rust font-medium">✓ Earned</div>
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
