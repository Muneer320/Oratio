import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../services/api';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, [roomCode]);

  const loadResults = async () => {
    try {
      const rooms = await api.get('/api/rooms/list', true);
      const foundRoom = rooms.find(r => r.room_code === roomCode);
      
      if (!foundRoom) {
        setError('Room not found');
        setLoading(false);
        return;
      }

      setRoom(foundRoom);

      try {
        const summary = await api.get(`/api/ai/summary/${foundRoom.id}`, true);
        setResult(summary.result);
      } catch (summaryErr) {
        if (summaryErr.status !== 401 && summaryErr.status !== 403) {
          console.log('Results not yet available, showing room info only');
        }
      }

      setLoading(false);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError('Please log in to view results');
        setLoading(false);
        return;
      }
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Error</h2>
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 noise-bg py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Debate Complete!</h1>
          <p className="text-xl text-slate-600">Here are the final results</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 mb-6"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Topic</h2>
          <p className="text-lg text-slate-700">{room?.topic}</p>
        </motion.div>

        {result?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-8 shadow-lg mb-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              AI Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{result.summary}</p>
          </motion.div>
        )}

        {result?.scores_json && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 mb-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Final Scores</h2>
            <div className="space-y-6">
              {Object.entries(result.scores_json).map(([participantId, scores], index) => (
                <div key={participantId} className="pb-6 border-b border-slate-200 last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Participant {participantId}
                      {result.winner_id && parseInt(result.winner_id) === parseInt(participantId) && (
                        <span className="ml-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-sm font-bold rounded-full">
                          🏆 Winner
                        </span>
                      )}
                    </h3>
                    <span className="text-3xl font-bold text-purple-600">
                      {scores.total || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {['logic', 'credibility', 'rhetoric'].map((metric) => (
                      <div key={metric}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-slate-600 capitalize">{metric}</span>
                          <span className="font-semibold text-slate-900">
                            {scores[metric] || 0}
                          </span>
                        </div>
                        <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-purple-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${scores[metric] || 0}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="group px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/10 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/trainer')}
            className="group px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Practice More
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Results;
