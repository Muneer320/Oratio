import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Debate() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [turns, setTurns] = useState([]);
  const [argument, setArgument] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(1);

  useEffect(() => {
    loadRoomData();
    const interval = setInterval(loadRoomData, 5000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const loadRoomData = async () => {
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
        const debateStatus = await api.get(`/api/debate/${foundRoom.id}/status`, true);
        const participantsList = debateStatus.participants || [];
        setParticipants(participantsList);
        
        const userIsParticipant = participantsList.some(
          p => String(p.user_id) === String(user?.id)
        );
        setIsParticipant(userIsParticipant);
        
        const totalTurns = debateStatus.turn_count || 0;
        const calculatedRound = Math.floor(totalTurns / (participantsList.length || 2)) + 1;
        const calculatedTurn = (totalTurns % (participantsList.length || 2)) + 1;
        
        setCurrentRound(Math.min(calculatedRound, foundRoom.rounds));
        setCurrentTurn(calculatedTurn);
      } catch (statusErr) {
        if (statusErr.status !== 401 && statusErr.status !== 403) {
          console.log('Debate status not available yet:', statusErr.message);
        }
      }

      try {
        const transcript = await api.get(`/api/debate/${foundRoom.id}/transcript`, true);
        setTurns(transcript);
      } catch (transcriptErr) {
        if (transcriptErr.status !== 401 && transcriptErr.status !== 403) {
          console.log('Transcript not available yet:', transcriptErr.message);
        }
      }

      setLoading(false);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError('Please log in to access this debate room');
        setLoading(false);
        return;
      }
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmitTurn = async () => {
    if (!argument.trim()) {
      setError('Please enter an argument');
      return;
    }

    if (!isParticipant) {
      setError('You must join as a participant before submitting arguments');
      return;
    }

    setIsSubmitting(true);
    setIsAnalyzing(true);
    setError('');

    try {
      const turnData = {
        content: argument,
        round_number: currentRound,
        turn_number: currentTurn,
      };

      const newTurn = await api.post(
        `/api/debate/${room.id}/submit-turn`,
        turnData,
        true
      );

      newTurn.ai_feedback = newTurn.ai_feedback || {};
      setTurns([...turns, newTurn]);
      setArgument('');
      setIsAnalyzing(false);

      await loadRoomData();
    } catch (err) {
      setError(err.message || 'Failed to submit turn');
      setIsAnalyzing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndDebate = async () => {
    try {
      await api.post(`/api/debate/${room.id}/end`, {}, true);
      
      await api.post('/api/ai/final-score', { room_id: room.id }, true);
      
      navigate(`/results/${roomCode}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading debate room...</p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Room Not Found</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 noise-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Debate Arena</h1>
            <p className="text-slate-600">
              Room: <span className="font-mono font-semibold text-purple-600">{roomCode}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {room?.host_id === user?.id && (
              <button
                onClick={handleEndDebate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                End Debate
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Room Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-600">Status:</span>
                  <span className="font-semibold text-slate-900 capitalize">{room?.status?.toLowerCase()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-600">Round:</span>
                  <span className="font-semibold text-slate-900">{currentRound} / {room?.rounds}</span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">AI Scoring Criteria:</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Logic', color: 'purple', weight: '40%' },
                      { label: 'Credibility', color: 'blue', weight: '35%' },
                      { label: 'Rhetoric', color: 'indigo', weight: '25%' }
                    ].map((criteria, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className={`text-${criteria.color}-700 font-medium`}>{criteria.label}</span>
                        <span className="text-slate-500">{criteria.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold mb-1 opacity-90">TOPIC</p>
              <h3 className="text-2xl font-bold">
                {room?.topic || 'Loading...'}
              </h3>
              {room?.description && (
                <p className="mt-2 opacity-90 text-sm">{room.description}</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-96 max-h-96 overflow-y-auto shadow-lg shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Debate Transcript</h3>
              <div className="space-y-4">
                {turns.length === 0 ? (
                  <p className="text-slate-500 text-center py-12">No arguments yet. Be the first to speak!</p>
                ) : (
                  turns.map((turn, i) => (
                    <div key={i} className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {turn.speaker_id}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-900">Speaker {turn.speaker_id}</span>
                            <span className="text-slate-500 text-sm">
                              Round {turn.round_number}, Turn {turn.turn_number}
                            </span>
                          </div>
                          <p className="text-slate-700 text-sm mb-3">{turn.content}</p>
                          
                          {turn.ai_feedback && (
                            <div className="space-y-2">
                              <div className="flex gap-2 text-xs">
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                                  L: {turn.ai_feedback.logic || 0}
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                                  C: {turn.ai_feedback.credibility || 0}
                                </span>
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold">
                                  R: {turn.ai_feedback.rhetoric || 0}
                                </span>
                              </div>
                              
                              {turn.ai_feedback.feedback && (
                                <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded">
                                  💡 {turn.ai_feedback.feedback}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Turn</h3>
              {!isParticipant && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    You're viewing as a spectator. To participate, you need to join the room first.
                  </p>
                </div>
              )}
              
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 h-32 resize-none mb-4"
                placeholder={isParticipant ? "Type your argument here. The AI will evaluate it based on logic, credibility, and rhetoric..." : "Join as a participant to submit arguments"}
                disabled={!isParticipant}
              />
              
              {isAnalyzing && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-purple-800">AI is analyzing your argument...</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <motion.button
                  onClick={handleSubmitTurn}
                  disabled={isSubmitting || !argument.trim() || !isParticipant}
                  className="flex-1 bg-slate-900 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Argument'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
