import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const results = {
    topic: 'AI will replace most jobs by 2030',
    winner: 'Player 1',
    scores: {
      player1: { name: 'Player 1', total: 87, logic: 85, credibility: 82, rhetoric: 94 },
      player2: { name: 'Player 2', total: 81, logic: 88, credibility: 75, rhetoric: 80 }
    },
    turns: 6,
    duration: '18:42',
    spectators: 127
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Winner Announcement */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-white mb-4">Debate Complete!</h1>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white inline-block px-8 py-3 rounded-full text-2xl font-bold">
            Winner: {results.winner}
          </div>
        </div>

        {/* Topic */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8 text-center">
          <p className="text-sm font-semibold text-purple-200 mb-2">DEBATE TOPIC</p>
          <p className="text-2xl font-bold text-white">{results.topic}</p>
        </div>

        {/* Final Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Player 1 */}
          <div className={`bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border-2 ${
            results.winner === 'Player 1' 
              ? 'border-yellow-400' 
              : 'border-white border-opacity-20'
          }`}>
            {results.winner === 'Player 1' && (
              <div className="text-4xl text-center mb-4">👑</div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{results.scores.player1.name}</h3>
              <div className="text-6xl font-bold text-purple-300">{results.scores.player1.total}</div>
              <p className="text-gray-300">Final Score</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">🧠 Logic</span>
                <span className="text-white font-bold text-xl">{results.scores.player1.logic}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">✅ Credibility</span>
                <span className="text-white font-bold text-xl">{results.scores.player1.credibility}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">🎭 Rhetoric</span>
                <span className="text-white font-bold text-xl">{results.scores.player1.rhetoric}</span>
              </div>
            </div>
          </div>

          {/* Player 2 */}
          <div className={`bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border-2 ${
            results.winner === 'Player 2' 
              ? 'border-yellow-400' 
              : 'border-white border-opacity-20'
          }`}>
            {results.winner === 'Player 2' && (
              <div className="text-4xl text-center mb-4">👑</div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{results.scores.player2.name}</h3>
              <div className="text-6xl font-bold text-pink-300">{results.scores.player2.total}</div>
              <p className="text-gray-300">Final Score</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">🧠 Logic</span>
                <span className="text-white font-bold text-xl">{results.scores.player2.logic}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">✅ Credibility</span>
                <span className="text-white font-bold text-xl">{results.scores.player2.credibility}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">🎭 Rhetoric</span>
                <span className="text-white font-bold text-xl">{results.scores.player2.rhetoric}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Debate Stats */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Debate Statistics</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{results.turns}</div>
              <p className="text-gray-300">Total Turns</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{results.duration}</div>
              <p className="text-gray-300">Duration</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{results.spectators}</div>
              <p className="text-gray-300">Spectators</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/host')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition duration-200"
          >
            Host New Debate
          </button>
          <button
            onClick={() => navigate('/trainer')}
            className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
          >
            Practice in Trainer
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
