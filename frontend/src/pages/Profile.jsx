import React from 'react';
import { Trophy, Target, Flame, Award, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const stats = [
    { icon: Trophy, label: 'Debates Joined', value: '24', color: 'indigo' },
    { icon: Target, label: 'Debates Hosted', value: '12', color: 'blue' },
    { icon: Flame, label: 'Win Rate', value: '67%', color: 'orange' },
    { icon: TrendingUp, label: 'XP Points', value: '1,450', color: 'green' },
  ];

  const badges = [
    { name: 'Fact Finder', icon: '🔍', description: 'Verified 50+ claims', earned: true },
    { name: 'Rhetoric Master', icon: '🎭', description: 'Achieved 90+ rhetoric score 10 times', earned: true },
    { name: 'Logic Legend', icon: '🧠', description: 'Perfect logic score in a debate', earned: true },
    { name: 'Debate Champion', icon: '🏆', description: 'Won 50 debates', earned: false },
    { name: 'Marathon Debater', icon: '⏱️', description: 'Participated in 100 debates', earned: false },
    { name: 'Rising Star', icon: '⭐', description: 'Reach level 10', earned: true },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              {(user?.username || user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{user?.username || user?.name || 'User'}</h1>
              <p className="text-slate-600 mb-3">Member since {new Date().toLocaleDateString()}</p>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium">
                  Level {user?.level || 5}
                </div>
                <div className="flex-1 bg-slate-200 rounded-full h-3 max-w-xs">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full"
                    style={{ width: '60%' }}
                  />
                </div>
                <span className="text-sm text-slate-600">60% to Level 6</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Badges & Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{badge.name}</h3>
                <p className="text-sm text-slate-600">{badge.description}</p>
                {badge.earned && (
                  <div className="mt-3 text-xs text-indigo-600 font-medium">✓ Earned</div>
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
