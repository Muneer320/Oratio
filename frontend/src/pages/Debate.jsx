import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, X, AlertCircle, CheckCircle, Clock, Mic, Square } from 'lucide-react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timePerTurn, setTimePerTurn] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const lastTurnKeyRef = useRef(null);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    loadRoomData();
    const interval = setInterval(loadRoomData, 10000);
    return () => clearInterval(interval);
  }, [roomCode]);

  useEffect(() => {
    if (room?.time_per_turn && timePerTurn === null) {
      setTimePerTurn(room.time_per_turn);
    }
  }, [room]);

  useEffect(() => {
    const turnKey = `${currentRound}-${currentTurn}`;
    
    if (lastTurnKeyRef.current !== turnKey && timePerTurn) {
      lastTurnKeyRef.current = turnKey;
      setTimeRemaining(timePerTurn * 60);
    }
  }, [currentRound, currentTurn, timePerTurn]);

  useEffect(() => {
    if (timeRemaining !== null) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            // Timer ended - show warning
            if (prev === 0) {
              setError('Time is up for this turn!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [timeRemaining !== null]);

  // Auto-scroll to bottom when new turns are added (WhatsApp style)
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [turns]);

  // Check if debate should auto-end when all rounds are complete
  useEffect(() => {
    if (room && participants.length > 0 && turns.length > 0) {
      const totalRounds = room.rounds || 3;
      const participantCount = participants.filter(p => p.role === 'debater').length || 2;
      const expectedTurns = totalRounds * participantCount;
      
      // Auto-end debate when all rounds are complete
      if (turns.length >= expectedTurns && room.status === 'ongoing') {
        // Only host can end, show message to others
        if (room.host_id === user?.id) {
          setTimeout(() => {
            handleEndDebate();
          }, 2000);
        } else {
          setError('All rounds complete. Waiting for host to end debate...');
        }
      }
    }
  }, [turns.length, room, participants]);

  const loadRoomData = async () => {
    try {
      const foundRoom = await api.get(`/api/rooms/code/${roomCode}`, true);
      
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone. Please allow microphone access.');
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-rust border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary font-medium">Loading debate room...</p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-dark-elevated rounded-2xl border border-red-900/50 p-8 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary text-center mb-2">Room Not Found</h2>
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
    <div className="min-h-screen bg-dark-base noise-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Debate Arena</h1>
            <p className="text-text-secondary">
              Room: <span className="font-mono font-semibold text-accent-rust">{roomCode}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {room?.host_id === user?.id && (
              <button
                onClick={handleEndDebate}
                className="px-4 py-2 bg-accent-rust text-white rounded-lg hover:bg-accent-saffron transition-colors"
              >
                End Debate
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-dark-elevated border border-dark-warm rounded-lg text-text-secondary hover:bg-dark-warm transition-colors"
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
            <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-6 shadow-lg sticky top-8">
              <h2 className="text-xl font-bold text-text-primary mb-6">Room Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-text-secondary">Status:</span>
                  <span className="font-semibold text-text-primary capitalize">{room?.status?.toLowerCase()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent-teal" />
                  <span className="text-text-secondary">Round:</span>
                  <span className="font-semibold text-text-primary">{currentRound} / {room?.rounds}</span>
                </div>

                {timeRemaining !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-accent-saffron" />
                    <span className="text-text-secondary">Time Remaining:</span>
                    <span className={`font-bold ${timeRemaining < 30 ? 'text-red-500' : 'text-text-primary'}`}>
                      {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-dark-warm">
                  <p className="text-xs text-text-muted mb-2">AI Scoring Criteria:</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Logic', color: 'accent-rust', weight: '40%' },
                      { label: 'Credibility', color: 'accent-teal', weight: '35%' },
                      { label: 'Rhetoric', color: 'accent-saffron', weight: '25%' }
                    ].map((criteria, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className={`text-${criteria.color} font-medium`}>{criteria.label}</span>
                        <span className="text-text-muted">{criteria.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {room?.resources && room.resources.length > 0 && (
                  <div className="pt-4 border-t border-dark-warm">
                    <p className="text-xs text-text-muted mb-2">Reference Materials:</p>
                    <div className="space-y-2">
                      {room.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-accent-rust hover:text-accent-saffron hover:underline truncate"
                        >
                          📎 {resource}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-accent-rust to-accent-saffron rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold mb-1 opacity-90">TOPIC</p>
              <h3 className="text-2xl font-bold">
                {room?.topic || 'Loading...'}
              </h3>
              {room?.description && (
                <p className="mt-2 opacity-90 text-sm">{room.description}</p>
              )}
            </div>

            <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-6 min-h-96 max-h-96 overflow-y-auto shadow-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Debate Transcript</h3>
              <div className="space-y-4">
                {turns.length === 0 ? (
                  <p className="text-text-muted text-center py-12">No arguments yet. Be the first to speak!</p>
                ) : (
                  turns.map((turn, i) => {
                    const speaker = participants.find(p => p.id === turn.speaker_id);
                    const speakerName = speaker?.username || speaker?.name || `Speaker ${turn.speaker_id}`;
                    const speakerInitial = speakerName[0]?.toUpperCase() || 'S';
                    
                    return (
                    <div key={i} className="bg-accent-rust/10 border border-accent-rust/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-rust to-accent-saffron rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {speakerInitial}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-text-primary">{speakerName}</span>
                            <span className="text-text-muted text-sm">
                              Round {turn.round_number}, Turn {turn.turn_number}
                            </span>
                          </div>
                          <p className="text-text-secondary text-sm mb-3">{turn.content}</p>
                          
                          {turn.ai_feedback && (
                            <div className="space-y-2">
                              <div className="flex gap-2 text-xs">
                                <span className="bg-accent-rust/20 text-accent-rust px-2 py-1 rounded font-semibold">
                                  L: {turn.ai_feedback.logic || 0}
                                </span>
                                <span className="bg-accent-teal/20 text-accent-teal px-2 py-1 rounded font-semibold">
                                  C: {turn.ai_feedback.credibility || 0}
                                </span>
                                <span className="bg-accent-saffron/20 text-accent-saffron px-2 py-1 rounded font-semibold">
                                  R: {turn.ai_feedback.rhetoric || 0}
                                </span>
                              </div>
                              
                              {turn.ai_feedback.feedback && (
                                <p className="text-xs text-text-secondary italic bg-dark-surface p-2 rounded">
                                  💡 {turn.ai_feedback.feedback}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Your Turn</h3>
              {!isParticipant && (
                <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl">
                  <p className="text-sm text-yellow-400">
                    You're viewing as a spectator. To participate, you need to join the room first.
                  </p>
                </div>
              )}
              
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-rust focus:ring-2 focus:ring-accent-rust/20 h-32 resize-none mb-4"
                placeholder={isParticipant ? "Type your argument here. The AI will evaluate it based on logic, credibility, and rhetoric..." : "Join as a participant to submit arguments"}
                disabled={!isParticipant}
              />
              
              {audioBlob && (
                <div className="mb-4 p-3 bg-accent-teal/20 border border-accent-teal/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-accent-teal" />
                    <span className="text-sm text-accent-teal">Audio recorded ({(audioBlob.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    onClick={() => setAudioBlob(null)}
                    className="text-accent-teal hover:text-accent-saffron text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="mb-4 p-3 bg-accent-rust/20 border border-accent-rust/50 rounded-xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-accent-rust border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-accent-rust">AI is analyzing your argument...</p>
                </div>
              )}
              
              <div className="flex gap-3">
                {(room?.mode === 'audio' || room?.mode === 'both') && (
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!isParticipant}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRecording 
                        ? 'bg-red-600 text-white' 
                        : 'bg-accent-teal text-white'
                    }`}
                    whileHover={{ scale: isRecording || !isParticipant ? 1 : 1.02 }}
                    whileTap={{ scale: isRecording || !isParticipant ? 1 : 0.98 }}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-5 h-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Record Audio
                      </>
                    )}
                  </motion.button>
                )}
                
                <motion.button
                  onClick={handleSubmitTurn}
                  disabled={isSubmitting || !argument.trim() || !isParticipant}
                  className="flex-1 bg-accent-rust px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-saffron transition-colors"
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
