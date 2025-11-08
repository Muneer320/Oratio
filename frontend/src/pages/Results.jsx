import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Home, ArrowRight, TrendingUp, MessageSquare, BarChart, Volume2, FileText } from 'lucide-react';
import api from '../services/api';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [result, setResult] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [detailedReport, setDetailedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

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
        const [summary, transcriptData, report] = await Promise.all([
          api.get(`/api/ai/summary/${foundRoom.id}`, true).catch(() => null),
          api.get(`/api/debate/${foundRoom.id}/transcript`, true).catch(() => []),
          api.get(`/api/ai/report/${foundRoom.id}`, true).catch(() => null)
        ]);
        
        if (summary) setResult(summary);
        setTranscript(transcriptData || []);
        setDetailedReport(report);
      } catch (summaryErr) {
        console.log('Some data not available, showing what we have');
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

  const TranscriptItem = ({ turn, index }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    const playAudio = () => {
      if (turn.audio_url) {
        const audio = new Audio(turn.audio_url);
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-dark-surface rounded-xl p-4 border border-dark-warm"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-accent-rust/20 rounded-full flex items-center justify-center text-accent-rust font-bold text-sm">
            R{turn.round_number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-text-primary">{turn.speaker_name || `Speaker ${turn.speaker_id}`}</span>
              <span className="text-xs text-text-muted">Turn {turn.turn_number}</span>
              {turn.audio_url && (
                <button
                  onClick={playAudio}
                  className={`ml-auto p-1.5 rounded-lg transition-colors ${
                    isPlaying ? 'bg-accent-rust text-white' : 'bg-dark-warm text-text-secondary hover:bg-accent-rust/20 hover:text-accent-rust'
                  }`}
                  disabled={isPlaying}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {turn.text_content && (
              <p className="text-text-secondary text-sm leading-relaxed">{turn.text_content}</p>
            )}
            {!turn.text_content && turn.audio_url && (
              <p className="text-text-muted text-sm italic">Audio response - click play to listen</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-base noise-bg py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-rust to-accent-saffron rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-text-primary mb-4">Debate Complete!</h1>
          <p className="text-xl text-text-secondary">Review the results and replay the debate</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'summary'
                ? 'bg-accent-rust text-white shadow-lg'
                : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
            }`}
          >
            <BarChart className="w-5 h-5" />
            Summary & Scores
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'transcript'
                ? 'bg-accent-rust text-white shadow-lg'
                : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Transcript Replay
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'feedback'
                ? 'bg-accent-rust text-white shadow-lg'
                : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
            }`}
          >
            <FileText className="w-5 h-5" />
            AI Review
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6">
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
              </div>

              {result?.summary && (
                <div className="bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 rounded-2xl border border-accent-rust/50 p-8 shadow-lg mb-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-accent-rust" />
                    AI Summary
                  </h2>
                  <p className="text-text-secondary leading-relaxed">{result.summary}</p>
                </div>
              )}

              {result?.scores && (
                <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Final Scores</h2>
                  <div className="space-y-6">
                    {Object.entries(result.scores).map(([participantId, scores], index) => (
                      <div key={participantId} className="pb-6 border-b border-dark-warm last:border-0">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {detailedReport?.participants?.find(p => p.participant_id === participantId)?.username || `Participant ${participantId}`}
                            {result.winner_id && String(result.winner_id) === String(participantId) && (
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
                                  transition={{ duration: 1, delay: 0.1 + index * 0.1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'transcript' && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-accent-rust" />
                  Debate Transcript
                </h2>
                {transcript.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {transcript.map((turn, index) => (
                      <TranscriptItem key={turn.id} turn={turn} index={index} />
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-center py-8">No transcript available</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-accent-rust" />
                  Detailed AI Review
                </h2>
                {detailedReport?.participants && detailedReport.participants.length > 0 ? (
                  <div className="space-y-6">
                    {detailedReport.participants.map((participant, index) => (
                      <motion.div
                        key={participant.participant_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-dark-surface rounded-xl p-6 border border-dark-warm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-text-primary">{participant.username}</h3>
                          {participant.team && (
                            <span className="px-3 py-1 bg-accent-teal/20 text-accent-teal rounded-full text-sm font-medium">
                              Team {participant.team}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-dark-base rounded-lg p-3">
                            <p className="text-text-muted text-sm">Turn Count</p>
                            <p className="text-2xl font-bold text-text-primary">{participant.turn_count}</p>
                          </div>
                          <div className="bg-dark-base rounded-lg p-3">
                            <p className="text-text-muted text-sm">Total Score</p>
                            <p className="text-2xl font-bold text-accent-rust">{participant.scores?.total || 'N/A'}</p>
                          </div>
                        </div>
                        {participant.feedback && Object.keys(participant.feedback).length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-text-primary">AI Feedback:</h4>
                            {participant.feedback.strengths && (
                              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-400 mb-1">Strengths</p>
                                <p className="text-text-secondary text-sm">{participant.feedback.strengths}</p>
                              </div>
                            )}
                            {participant.feedback.weaknesses && (
                              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <p className="text-sm font-medium text-yellow-400 mb-1">Areas for Improvement</p>
                                <p className="text-text-secondary text-sm">{participant.feedback.weaknesses}</p>
                              </div>
                            )}
                            {participant.feedback.recommendations && (
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-400 mb-1">Recommendations</p>
                                <p className="text-text-secondary text-sm">{participant.feedback.recommendations}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-center py-8">No AI feedback available yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4 justify-center mt-8"
        >
          <motion.button
            onClick={() => navigate('/home')}
            className="group px-8 py-4 bg-dark-elevated border border-dark-warm text-text-primary rounded-xl font-semibold shadow-lg hover:bg-dark-warm flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/learn')}
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
