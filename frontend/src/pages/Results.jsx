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
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-rust border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-dark-elevated rounded-2xl border border-red-900/50 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-2">Error</h2>
          <p className="text-text-secondary text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-accent-rust text-white rounded-xl font-semibold hover:bg-accent-saffron transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base noise-bg py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-rust to-accent-saffron rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-text-primary mb-4">Debate Complete!</h1>
          <p className="text-xl text-text-secondary">Here are the final results</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-4">Topic</h2>
          <p className="text-lg text-text-secondary mb-4">{room?.topic}</p>
          {room?.description && (
            <p className="text-text-muted mb-4">{room.description}</p>
          )}
          {room?.resources && room.resources.length > 0 && (
            <div className="pt-4 border-t border-dark-warm">
              <p className="text-sm font-medium text-text-primary mb-2">Reference Materials:</p>
              <div className="space-y-1">
                {room.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-accent-rust hover:text-accent-saffron hover:underline"
                  >
                    📎 {resource}
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {result?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 rounded-2xl border border-accent-rust/50 p-8 shadow-lg mb-6"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-accent-rust" />
              AI Summary
            </h2>
            <p className="text-text-secondary leading-relaxed">{result.summary}</p>
          </motion.div>
        )}

        {result?.scores_json && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">Final Scores</h2>
            <div className="space-y-6">
              {Object.entries(result.scores_json).map(([participantId, scores], index) => (
                <div key={participantId} className="pb-6 border-b border-dark-warm last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      Participant {participantId}
                      {result.winner_id && parseInt(result.winner_id) === parseInt(participantId) && (
                        <span className="ml-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-sm font-bold rounded-full">
                          🏆 Winner
                        </span>
                      )}
                    </h3>
                    <span className="text-3xl font-bold text-accent-rust">
                      {scores.total || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {['logic', 'credibility', 'rhetoric'].map((metric) => (
                      <div key={metric}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-text-secondary capitalize">{metric}</span>
                          <span className="font-semibold text-text-primary">
                            {scores[metric] || 0}
                          </span>
                        </div>
                        <div className="bg-dark-surface h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-accent-rust h-full"
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
            className="group px-8 py-4 bg-dark-elevated border border-dark-warm text-text-primary rounded-xl font-semibold shadow-lg hover:bg-dark-warm flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/trainer')}
            className="group px-8 py-4 bg-accent-rust text-white rounded-xl font-semibold shadow-lg hover:bg-accent-saffron flex items-center gap-2"
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
