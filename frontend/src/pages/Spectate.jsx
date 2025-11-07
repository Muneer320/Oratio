import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Spectate() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const handleJoinSpectate = (e) => {
    e.preventDefault();
    // TODO: Join as spectator
    console.log('Spectating room:', roomCode);
  };

  const sendReaction = (emoji) => {
    // TODO: Send reaction via WebSocket
    console.log('Sending reaction:', emoji);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Spectator Mode</h1>
            <p className="text-gray-300">Watch debates live and support your favorite debater</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-full font-semibold border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
          >
            Exit
          </button>
        </div>

        {/* Join Spectate */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
          <form onSubmit={handleJoinSpectate} className="flex gap-4">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-center text-xl tracking-widest"
              placeholder="Enter Room Code"
              maxLength={6}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-200"
            >
              Join as Spectator
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Debate Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Live Debate</h2>
                <span className="flex items-center gap-2 bg-red-500 bg-opacity-30 text-red-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  LIVE
                </span>
              </div>

              {/* Topic */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-purple-200 mb-1">TOPIC</p>
                <p className="text-xl font-bold text-white">AI will replace most jobs by 2030</p>
              </div>

              {/* Debate Stream */}
              <div className="space-y-4 h-96 overflow-y-auto">
                <div className="bg-purple-900 bg-opacity-40 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white">Player 1</span>
                        <div className="flex gap-1 text-xs">
                          <span className="bg-purple-500 bg-opacity-30 text-purple-200 px-2 py-1 rounded">L: 85</span>
                          <span className="bg-blue-500 bg-opacity-30 text-blue-200 px-2 py-1 rounded">C: 78</span>
                          <span className="bg-pink-500 bg-opacity-30 text-pink-200 px-2 py-1 rounded">R: 92</span>
                        </div>
                      </div>
                      <p className="text-gray-200">
                        AI automation is already transforming industries...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spectator Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Reaction Panel */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">React & Support</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['🔥', '👏', '💡', '🎯', '💪', '🏆'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-4xl p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 hover:scale-110 transition duration-200"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Spectator Stats */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">Viewer Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">👥 Watching</span>
                  <span className="text-white font-bold text-xl">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">🔥 Reactions</span>
                  <span className="text-white font-bold text-xl">523</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">⏱️ Duration</span>
                  <span className="text-white font-bold text-xl">12:34</span>
                </div>
              </div>
            </div>

            {/* Support Leaderboard */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">Audience Support</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 font-semibold">Player 1</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-white font-bold">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-300 font-semibold">Player 2</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                    <span className="text-white font-bold">35%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spectate;
