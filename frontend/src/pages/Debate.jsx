import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Debate() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [argument, setArgument] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmitTurn = () => {
    // TODO: Submit turn to backend
    console.log('Submitting turn:', argument);
    setArgument('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Debate Arena</h1>
            <p className="text-gray-300">Room Code: <span className="font-mono font-bold text-purple-300">{roomCode || 'ABC123'}</span></p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-full font-semibold border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
          >
            Leave Debate
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 sticky top-6">
              <h2 className="text-2xl font-bold text-white mb-6">Live Scores</h2>
              
              {/* Player 1 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold text-lg">Player 1</span>
                  <span className="text-purple-300 font-bold text-2xl">85</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🧠 Logic</span>
                    <div className="flex-1 mx-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-white font-semibold">85</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">✅ Credibility</span>
                    <div className="flex-1 mx-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-white font-semibold">78</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🎭 Rhetoric</span>
                    <div className="flex-1 mx-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-white font-semibold">92</span>
                  </div>
                </div>
              </div>

              {/* Player 2 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold text-lg">Player 2</span>
                  <span className="text-pink-300 font-bold text-2xl">82</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🧠 Logic</span>
                    <div className="flex-1 mx-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                    <span className="text-white font-semibold">88</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">✅ Credibility</span>
                    <div className="flex-1 mx-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-white font-semibold">75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🎭 Rhetoric</span>
                    <div className="flex-1 mx-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full" style={{width: '83%'}}></div>
                    </div>
                    <span className="text-white font-semibold">83</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Debate Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-sm font-semibold text-purple-200 mb-2">DEBATE TOPIC</h3>
              <p className="text-2xl font-bold text-white">AI will replace most jobs by 2030</p>
            </div>

            {/* Turn History */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 h-96 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Debate Turns</h3>
              
              {/* Sample Turn */}
              <div className="mb-4 bg-purple-900 bg-opacity-40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    P1
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">Player 1</span>
                      <span className="text-sm text-gray-300">2:34 ago</span>
                    </div>
                    <p className="text-gray-200">
                      AI automation is already transforming industries. Studies show 47% of jobs 
                      are at high risk of automation within the next two decades...
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-purple-500 bg-opacity-30 text-purple-200 px-2 py-1 rounded">Logic: 85</span>
                      <span className="text-xs bg-blue-500 bg-opacity-30 text-blue-200 px-2 py-1 rounded">Credibility: 78</span>
                      <span className="text-xs bg-pink-500 bg-opacity-30 text-pink-200 px-2 py-1 rounded">Rhetoric: 92</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold text-white mb-4">Your Turn</h3>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 h-32 resize-none mb-4"
                placeholder="Type your argument or click record to speak..."
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitTurn}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-200"
                >
                  Submit Turn
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-3 rounded-xl font-semibold transition duration-200 ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white bg-opacity-20 text-white border border-white border-opacity-30 hover:bg-opacity-30'
                  }`}
                >
                  🎙️ {isRecording ? 'Recording...' : 'Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
