import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    { id: 1, title: 'Master Logic', description: 'Achieve 90+ Logic score in 3 debates', progress: 67, xp: 250 },
    { id: 2, title: 'Credibility Expert', description: 'Get perfect fact-check score', progress: 40, xp: 300 },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Trainer</h1>
            <p className="text-gray-300">Practice with AI and level up your debate skills</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-full font-semibold border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
          >
            Exit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 border border-white border-opacity-20">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {stats.level}
                </div>
                <p className="text-purple-100 font-semibold mb-4">Level {stats.level} Debater</p>
                <div className="bg-white bg-opacity-20 rounded-full h-3 mb-2">
                  <div className="bg-white h-3 rounded-full" style={{width: '73%'}}></div>
                </div>
                <p className="text-sm text-purple-100">{stats.totalXP} / 5000 XP</p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">🧠 Avg Logic</span>
                    <span className="text-white font-bold">{stats.avgLogic}</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{width: `${stats.avgLogic}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">✅ Avg Credibility</span>
                    <span className="text-white font-bold">{stats.avgCredibility}</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full" style={{width: `${stats.avgCredibility}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">🎭 Avg Rhetoric</span>
                    <span className="text-white font-bold">{stats.avgRhetoric}</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{width: `${stats.avgRhetoric}%`}}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white border-opacity-20">
                  <div className="flex justify-between">
                    <span className="text-gray-300">📊 Total Debates</span>
                    <span className="text-white font-bold">{stats.totalDebates}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-300">🏆 Win Rate</span>
                    <span className="text-white font-bold">{stats.winRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Training Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start Training */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-6">Start AI Training Session</h2>
              
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Choose a Topic</label>
                <div className="grid grid-cols-1 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-4 rounded-xl text-left transition duration-200 ${
                        selectedTopic === topic
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selectedTopic}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition duration-200 ${
                  selectedTopic
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Start Training Session
              </button>
            </div>

            {/* Active Challenges */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-6">Active Challenges</h2>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-white bg-opacity-10 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                        <p className="text-gray-300 text-sm">{challenge.description}</p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                        +{challenge.xp} XP
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" 
                          style={{width: `${challenge.progress}%`}}
                        ></div>
                      </div>
                      <span className="text-white font-semibold text-sm">{challenge.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">💡 AI Recommendations</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <p className="text-white">
                    <strong>Improve Credibility:</strong> Include more specific statistics and sources in your arguments.
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <p className="text-white">
                    <strong>Strengthen Logic:</strong> Practice connecting premises to conclusions more explicitly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trainer;
