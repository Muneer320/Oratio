import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, X, AlertCircle, CheckCircle, Clock, Mic, Square, Play, Pause, ThumbsUp, Flame, Heart, Brain } from 'lucide-react';
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timePerTurn, setTimePerTurn] = useState(null);
  const [selectedReactionParticipant, setSelectedReactionParticipant] = useState(null);
  const [reactionSent, setReactionSent] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlaybackRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const lastTurnKeyRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const handleSpectatorReaction = async (participantId, reactionType) => {
    if (!room || isParticipant) return;
    
    try {
      await api.post(`/api/spectators/${room.id}/reward`, {
        target_id: participantId,
        reaction_type: reactionType
      }, true);
      
      setReactionSent(true);
      setTimeout(() => setReactionSent(false), 2000);
    } catch (err) {
      console.error('Failed to send reaction:', err);
    }
  };

  useEffect(() => {
    loadRoomData();
    
    // Only poll when tab is active - 30s for debate page (reduced to ease backend load)
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadRoomData();
      }
    }, 30000);
    
    // Refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadRoomData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

  const loadRoomData = async () => {
    try {
      const foundRoom = await api.get(`/api/rooms/code/${roomCode}`, true);
      
      if (!foundRoom) {
        setError('Room not found');
        setLoading(false);
        return;
      }

      // Auto-redirect to results when debate completes
      if (foundRoom.status === 'completed') {
        navigate(`/results/${roomCode}`);
        return;
      }

      setRoom(foundRoom);

      // PERFORMANCE FIX: Fetch status and transcript in parallel instead of sequentially
      const [statusResult, transcriptResult] = await Promise.allSettled([
        api.get(`/api/debate/${foundRoom.id}/status`, true),
        api.get(`/api/debate/${foundRoom.id}/transcript`, true)
      ]);

      // Process status data
      if (statusResult.status === 'fulfilled') {
        const debateStatus = statusResult.value;
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
      } else if (statusResult.reason?.status !== 401 && statusResult.reason?.status !== 403) {
        console.log('Debate status not available yet:', statusResult.reason?.message);
      }

      // Process transcript data
      if (transcriptResult.status === 'fulfilled') {
        setTurns(transcriptResult.value);
      } else if (transcriptResult.reason?.status !== 401 && transcriptResult.reason?.status !== 403) {
        console.log('Transcript not available yet:', transcriptResult.reason?.message);
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

  const toggleAudioPlayback = () => {
    if (!audioBlob || !audioPlaybackRef.current) return;

    if (isPlayingAudio) {
      audioPlaybackRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlaybackRef.current.src = audioUrl;
      audioPlaybackRef.current.play();
      setIsPlayingAudio(true);
      
      audioPlaybackRef.current.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const handleSubmitTurn = async () => {
    // Allow either text or audio
    if (!argument.trim() && !audioBlob) {
      setError('Please enter an argument or record audio');
      return;
    }

    if (!isParticipant) {
      setError('You must join as a participant before submitting arguments');
      return;
    }

    // Check if all seats are filled before allowing submissions
    const maxParticipants = room?.type === 'team' ? 4 : 2;
    const currentDebaters = participants.filter(p => p.role === 'debater').length;
    if (currentDebaters < maxParticipants) {
      setError(`Waiting for all participants to join. ${currentDebaters}/${maxParticipants} seats filled.`);
      return;
    }

    // CRITICAL: Block submissions if final round is already complete
    const totalRounds = room?.rounds || 3;
    const debaterCount = participants.filter(p => p.role === 'debater').length || 2;
    const turnsInFinalRound = turns.filter(t => t.round_number === totalRounds).length;
    
    if (currentRound >= totalRounds && turnsInFinalRound >= debaterCount) {
      setError('All rounds complete. Debate has ended.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let newTurn;
      
      // If we have audio, submit it
      if (audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'argument.webm');
        formData.append('round_number', currentRound.toString());
        formData.append('turn_number', currentTurn.toString());
        
        // Add text content if provided
        if (argument.trim()) {
          formData.append('content', argument);
        }

        newTurn = await api.postFormData(
          `/api/debate/${room.id}/submit-audio`,
          formData,
          true
        );
        
        setAudioBlob(null);
      } else {
        // Text only submission
        const turnData = {
          content: argument,
          round_number: currentRound,
          turn_number: currentTurn,
        };

        newTurn = await api.post(
          `/api/debate/${room.id}/submit-turn`,
          turnData,
          true
        );
      }

      // PERFORMANCE FIX: Optimistically update UI immediately instead of refetching everything
      newTurn.ai_feedback = newTurn.ai_feedback || null;
      setTurns([...turns, newTurn]);
      setArgument('');

      // Update turn/round state for next submission
      const debaterCount = participants.filter(p => p.role === 'debater').length || 2;
      const turnsInCurrentRound = [...turns, newTurn].filter(
        t => t.round_number === currentRound
      ).length;
      
      if (turnsInCurrentRound >= debaterCount) {
        // Round complete - check if this was the final round
        const totalRounds = room?.rounds || 3;
        
        if (currentRound >= totalRounds) {
          // Final round complete - debate will auto-end, don't advance state
          setIsAnalyzing(true);
          setTimeout(() => setIsAnalyzing(false), 10000);
        } else {
          // Advance to next round (clamp to max rounds)
          setCurrentRound(Math.min(currentRound + 1, totalRounds));
          setCurrentTurn(1);
          
          // AI analysis happens in background
          setIsAnalyzing(true);
          setTimeout(() => setIsAnalyzing(false), 10000);
        }
      } else {
        // Round in progress - advance to next turn
        setCurrentTurn(currentTurn + 1);
      }
      
      // Lightweight sync after submit to keep state fresh (only status, no full refetch)
      setTimeout(async () => {
        try {
          const debateStatus = await api.get(`/api/debate/${room.id}/status`, true);
          setParticipants(debateStatus.participants || []);
        } catch (err) {
          // Silent fail - regular polling will catch up
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to submit turn');
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
                    const speaker = participants.find(p => String(p.id) === String(turn.speaker_id));
                    const speakerName = speaker?.username || speaker?.name || `Speaker ${turn.speaker_id}`;
                    const speakerInitial = speakerName[0]?.toUpperCase() || 'S';
                    const speakerTeam = speaker?.team;
                    const teamColor = speakerTeam === 'for' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                                     speakerTeam === 'against' ? 'bg-red-500/20 text-red-400 border-red-500/30' : '';
                    
                    return <div key={i} className="bg-accent-rust/10 border border-accent-rust/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          speakerTeam ? teamColor.replace('/20', '/30') : 'bg-gradient-to-br from-accent-rust to-accent-saffron'
                        }`}>
                          {speakerInitial}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold text-text-primary">{speakerName}</span>
                            {speakerTeam && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${teamColor}`}>
                                {speakerTeam === 'for' ? '✓ For' : '✗ Against'}
                              </span>
                            )}
                            <span className="text-text-muted text-sm ml-auto">
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
                  })
                )}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {isParticipant ? 'Your Turn' : 'Spectator Reactions'}
              </h3>
              {!isParticipant && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-xl">
                    <p className="text-sm text-blue-400 mb-3">
                      👁️ You're viewing as a spectator. React to support participants!
                    </p>
                    {reactionSent && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-green-400 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Reaction sent!
                      </motion.div>
                    )}
                  </div>
                  
                  {participants.filter(p => p.role === 'debater').length > 0 && (
                    <div className="bg-dark-surface border border-dark-warm rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-3">React to a participant:</p>
                      <div className="space-y-3">
                        {participants.filter(p => p.role === 'debater').map(participant => (
                          <div key={participant.id} className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg border border-dark-warm">
                            <span className="text-sm font-medium text-text-primary">
                              {participant.username || participant.name}
                            </span>
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleSpectatorReaction(participant.id, 'agree')}
                                className="p-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 border border-blue-700/30 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Agree"
                              >
                                <ThumbsUp className="w-4 h-4 text-blue-400" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleSpectatorReaction(participant.id, 'strong')}
                                className="p-2 rounded-lg bg-orange-900/20 hover:bg-orange-900/40 border border-orange-700/30 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Strong Argument"
                              >
                                <Flame className="w-4 h-4 text-orange-400" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleSpectatorReaction(participant.id, 'insightful')}
                                className="p-2 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-700/30 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Insightful"
                              >
                                <Brain className="w-4 h-4 text-purple-400" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleSpectatorReaction(participant.id, 'support')}
                                className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-700/30 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Support"
                              >
                                <Heart className="w-4 h-4 text-red-400" />
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {(() => {
                // Check if user has already submitted in current round
                const myParticipant = participants.find(p => String(p.user_id) === String(user?.id));
                const hasSubmittedThisRound = myParticipant && turns.some(
                  t => String(t.speaker_id) === String(myParticipant.id) && t.round_number === currentRound
                );
                
                const isInputDisabled = !isParticipant || hasSubmittedThisRound;
                const placeholderText = !isParticipant 
                  ? "Join as a participant to submit arguments"
                  : hasSubmittedThisRound
                  ? "Waiting for other participants to submit their arguments..."
                  : "Type your argument here. The AI will evaluate it based on logic, credibility, and rhetoric...";

                return (
                  <>
                    {hasSubmittedThisRound && isParticipant && (
                      <div className="mb-4 p-4 bg-accent-teal/20 border border-accent-teal/50 rounded-xl">
                        <p className="text-sm text-accent-teal">
                          ✓ You've submitted your argument for this round. Waiting for others...
                        </p>
                      </div>
                    )}
                    
                    <textarea
                      value={argument}
                      onChange={(e) => setArgument(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-rust focus:ring-2 focus:ring-accent-rust/20 h-32 resize-none mb-4"
                      placeholder={placeholderText}
                      disabled={isInputDisabled}
                    />
                  </>
                );
              })()}
              
              
              {audioBlob && (
                <div className="mb-4 p-3 bg-accent-teal/20 border border-accent-teal/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-accent-teal" />
                      <span className="text-sm text-accent-teal">Audio recorded ({(audioBlob.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleAudioPlayback}
                        className="flex items-center gap-2 px-3 py-1.5 bg-accent-teal/30 hover:bg-accent-teal/50 rounded-lg text-accent-teal text-sm font-semibold transition-colors"
                      >
                        {isPlayingAudio ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setAudioBlob(null);
                          setIsPlayingAudio(false);
                          if (audioPlaybackRef.current) {
                            audioPlaybackRef.current.pause();
                            audioPlaybackRef.current.src = '';
                          }
                        }}
                        className="text-accent-teal hover:text-accent-saffron text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <audio ref={audioPlaybackRef} className="hidden" />
                </div>
              )}

              {isAnalyzing && (
                <div className="mb-4 p-4 bg-gradient-to-r from-accent-saffron/20 to-accent-rust/20 border border-accent-saffron/50 rounded-xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-accent-saffron border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="text-sm font-semibold text-accent-saffron">⚖️ AI Judging in Progress...</p>
                    <p className="text-xs text-text-muted mt-0.5">Evaluating Logic, Credibility, and Rhetoric</p>
                  </div>
                </div>
              )}
              
              {(() => {
                const myParticipant = participants.find(p => String(p.user_id) === String(user?.id));
                const hasSubmittedThisRound = myParticipant && turns.some(
                  t => String(t.speaker_id) === String(myParticipant.id) && t.round_number === currentRound
                );
                
                return (
                  <div className="flex gap-3">
                    {(room?.mode === 'audio' || room?.mode === 'both') && (
                      <motion.button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={!isParticipant || hasSubmittedThisRound}
                        className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isRecording 
                            ? 'bg-red-600 text-white' 
                            : 'bg-accent-teal text-white'
                        }`}
                        whileHover={{ scale: isRecording || !isParticipant || hasSubmittedThisRound ? 1 : 1.02 }}
                        whileTap={{ scale: isRecording || !isParticipant || hasSubmittedThisRound ? 1 : 0.98 }}
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
                      disabled={isSubmitting || (!argument.trim() && !audioBlob) || !isParticipant || hasSubmittedThisRound}
                      className="flex-1 bg-accent-rust px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-saffron transition-colors"
                      whileHover={{ scale: isSubmitting || hasSubmittedThisRound ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting || hasSubmittedThisRound ? 1 : 0.98 }}
                    >
                      <Send className="w-5 h-5" />
                      {isSubmitting ? 'Submitting...' : audioBlob ? 'Submit Audio' : 'Submit Argument'}
                    </motion.button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
