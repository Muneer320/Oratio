import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Home, TrendingUp, MessageSquare, BarChart, Volume2, FileText, Users, Target, Award, CheckCircle, XCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [result, setResult] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [detailedReport, setDetailedReport] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isTeamDebate, setIsTeamDebate] = useState(false);
  const [currentUserParticipant, setCurrentUserParticipant] = useState(null);

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
        const [summary, transcriptData, report, debateStatus] = await Promise.all([
          api.get(`/api/ai/summary/${foundRoom.id}`, true).catch(() => null),
          api.get(`/api/debate/${foundRoom.id}/transcript`, true).catch(() => []),
          api.get(`/api/ai/report/${foundRoom.id}`, true).catch(() => null),
          api.get(`/api/debate/${foundRoom.id}/status`, true).catch(() => ({ participants: [] }))
        ]);
        
        if (summary) setResult(summary);
        setTranscript(transcriptData || []);
        setDetailedReport(report);
        setParticipants(debateStatus.participants || []);
        
        // Check if it's a team debate
        const hasTeams = debateStatus.participants?.some(p => p.team);
        setIsTeamDebate(hasTeams);

        // Find current user's participant
        const userParticipant = debateStatus.participants?.find(
          p => String(p.user_id) === String(user?.id)
        );
        setCurrentUserParticipant(userParticipant);
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

  const getTeamData = () => {
    if (!detailedReport?.participants || !isTeamDebate) return null;

    const teams = {};
    detailedReport.participants.forEach(p => {
      if (!p.team) return;
      if (!teams[p.team]) {
        teams[p.team] = {
          members: [],
          totalScore: 0,
          avgLogic: 0,
          avgCredibility: 0,
          avgRhetoric: 0,
          turnCount: 0
        };
      }
      teams[p.team].members.push(p);
      teams[p.team].totalScore += (p.scores?.weighted_total || 0);
      teams[p.team].avgLogic += (p.scores?.logic || 0);
      teams[p.team].avgCredibility += (p.scores?.credibility || 0);
      teams[p.team].avgRhetoric += (p.scores?.rhetoric || 0);
      teams[p.team].turnCount += p.turn_count || 0;
    });

    // Calculate averages
    Object.keys(teams).forEach(teamName => {
      const memberCount = teams[teamName].members.length;
      if (memberCount > 0) {
        teams[teamName].avgLogic /= memberCount;
        teams[teamName].avgCredibility /= memberCount;
        teams[teamName].avgRhetoric /= memberCount;
      }
    });

    return teams;
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
            onClick={() => navigate('/home')}
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

  const ScoreBar = ({ label, value, maxValue = 100, color = 'accent-rust' }) => {
    const percentage = (value / maxValue) * 100;
    
    // Use predefined gradient classes for Tailwind JIT
    const gradientClasses = {
      'accent-rust': 'bg-gradient-to-r from-accent-rust to-accent-saffron',
      'accent-teal': 'bg-gradient-to-r from-accent-teal to-accent-rust',
      'accent-saffron': 'bg-gradient-to-r from-accent-saffron to-yellow-400'
    };
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">{label}</span>
          <span className="text-sm font-bold text-text-primary">{value.toFixed(1)}/{maxValue}</span>
        </div>
        <div className="w-full h-3 bg-dark-warm rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${gradientClasses[color] || gradientClasses['accent-rust']}`}
          />
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Topic */}
      <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Debate Topic</h2>
        <p className="text-lg text-text-secondary mb-4">{room?.topic}</p>
        {room?.description && (
          <p className="text-text-muted">{room.description}</p>
        )}
      </div>

      {/* AI Summary */}
      {result?.summary && (
        <div className="bg-gradient-to-br from-accent-rust/20 to-accent-saffron/20 rounded-2xl border border-accent-rust/50 p-8 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent-rust" />
            AI Analysis Summary
          </h2>
          <p className="text-text-secondary leading-relaxed text-lg">{result.summary}</p>
        </div>
      )}

      {/* Winner Announcement */}
      {result?.winner_id && detailedReport?.participants && (
        <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-2xl border border-yellow-500/50 p-8 shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">Winner</h2>
              <p className="text-xl text-text-secondary">
                {detailedReport.participants.find(p => p.participant_id === result.winner_id)?.username || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LCR Breakdown for All Participants */}
      {result?.scores && detailedReport?.participants && (
        <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-accent-rust" />
            LCR Score Breakdown
          </h2>
          <div className="space-y-8">
            {detailedReport.participants.map((participant, index) => {
              const scores = result.scores[participant.participant_id];
              if (!scores) return null;

              return (
                <div key={participant.participant_id} className="pb-8 border-b border-dark-warm last:border-0">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                      {participant.username}
                      {participant.team && (
                        <span className="text-sm bg-accent-teal/20 text-accent-teal px-3 py-1 rounded-full">
                          Team {participant.team}
                        </span>
                      )}
                    </h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-accent-rust">
                        {(scores.weighted_total || scores.total || 0).toFixed(1)}
                      </div>
                      <div className="text-xs text-text-muted">Total Score</div>
                    </div>
                  </div>
                  
                  <ScoreBar label="Logic (40%)" value={scores.logic || 0} color="accent-teal" />
                  <ScoreBar label="Credibility (35%)" value={scores.credibility || 0} color="accent-rust" />
                  <ScoreBar label="Rhetoric (25%)" value={scores.rhetoric || 0} color="accent-saffron" />
                  
                  {participant.feedback && (
                    <div className="mt-6 space-y-3">
                      {participant.feedback.strengths && participant.feedback.strengths.length > 0 && (
                        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <ThumbsUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                              <ul className="text-sm text-text-secondary space-y-1">
                                {participant.feedback.strengths.map((strength, i) => (
                                  <li key={i}>• {strength}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {participant.feedback.weaknesses && participant.feedback.weaknesses.length > 0 && (
                        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <ThumbsDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-red-400 mb-2">Areas for Improvement</h4>
                              <ul className="text-sm text-text-secondary space-y-1">
                                {participant.feedback.weaknesses.map((weakness, i) => (
                                  <li key={i}>• {weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Insights */}
      {result?.feedback && (
        <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-accent-rust" />
            Key Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(result.feedback).slice(0, 4).map(([key, value], index) => (
              <div key={index} className="bg-dark-surface border border-dark-warm rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-accent-saffron" />
                  Participant {key}
                </h3>
                {value.strengths && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-green-400 mb-1">Strengths:</p>
                    <p className="text-sm text-text-secondary">{value.strengths.slice(0, 2).join(', ')}</p>
                  </div>
                )}
                {value.weaknesses && (
                  <div>
                    <p className="text-xs font-medium text-red-400 mb-1">To Improve:</p>
                    <p className="text-sm text-text-secondary">{value.weaknesses.slice(0, 2).join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const TeamAnalysisTab = () => {
    const teamData = getTeamData();
    if (!teamData) return null;

    return (
      <motion.div
        key="team-analysis"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-accent-rust" />
            Team Performance Comparison
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(teamData).map(([teamName, data], index) => (
              <div key={teamName} className="bg-dark-surface border border-dark-warm rounded-xl p-6">
                <h3 className="text-xl font-bold text-text-primary mb-6">Team {teamName}</h3>
                
                {/* Team Stats */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-muted">Total Score</span>
                    <span className="text-2xl font-bold text-accent-rust">{data.totalScore.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-text-muted">Members</span>
                    <span className="text-lg font-semibold text-text-primary">{data.members.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">Total Turns</span>
                    <span className="text-lg font-semibold text-text-primary">{data.turnCount}</span>
                  </div>
                </div>

                {/* LCR Averages */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-text-secondary mb-3">Average LCR Scores</h4>
                  <ScoreBar label="Logic" value={data.avgLogic} color="accent-teal" />
                  <ScoreBar label="Credibility" value={data.avgCredibility} color="accent-rust" />
                  <ScoreBar label="Rhetoric" value={data.avgRhetoric} color="accent-saffron" />
                </div>

                {/* Team Members */}
                <div>
                  <h4 className="text-sm font-semibold text-text-secondary mb-3">Team Members</h4>
                  <div className="space-y-2">
                    {data.members.map(member => (
                      <div key={member.participant_id} className="flex justify-between items-center bg-dark-base rounded-lg p-3">
                        <span className="text-sm font-medium text-text-primary">{member.username}</span>
                        <span className="text-sm text-accent-rust font-bold">
                          {(member.scores?.weighted_total || 0).toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const IndividualAnalysisTab = ({ participantId }) => {
    const participant = detailedReport?.participants?.find(p => p.participant_id === participantId);
    const feedback = result?.feedback?.[participantId];
    const scores = result?.scores?.[participantId];

    if (!participant) return null;

    return (
      <motion.div
        key={`individual-${participantId}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-rust to-accent-saffron rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {participant.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{participant.username}</h2>
              <p className="text-text-muted">Personal Performance Analysis</p>
            </div>
          </div>

          {/* Personal Scores */}
          {scores && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Your LCR Scores</h3>
              <div className="bg-dark-surface rounded-xl p-6 border border-dark-warm">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-accent-rust mb-2">
                    {(scores.weighted_total || scores.total || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-text-muted">Overall Score</div>
                </div>
                <ScoreBar label="Logic (40%)" value={scores.logic || 0} color="accent-teal" />
                <ScoreBar label="Credibility (35%)" value={scores.credibility || 0} color="accent-rust" />
                <ScoreBar label="Rhetoric (25%)" value={scores.rhetoric || 0} color="accent-saffron" />
              </div>
            </div>
          )}

          {/* Detailed Feedback */}
          {feedback && (
            <div className="space-y-6">
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, i) => (
                      <li key={i} className="text-text-secondary flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {feedback.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-text-secondary flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements && feedback.improvements.length > 0 && (
                <div className="bg-accent-saffron/20 border border-accent-saffron/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-accent-saffron mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recommendations for Next Time
                  </h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, i) => (
                      <li key={i} className="text-text-secondary flex items-start gap-2">
                        <span className="text-accent-saffron mt-1">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Performance Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-dark-surface border border-dark-warm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-rust mb-1">{participant.turn_count || 0}</div>
              <div className="text-xs text-text-muted">Total Turns</div>
            </div>
            {participant.team && (
              <div className="bg-dark-surface border border-dark-warm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-teal mb-1">{participant.team}</div>
                <div className="text-xs text-text-muted">Team</div>
              </div>
            )}
            <div className="bg-dark-surface border border-dark-warm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-saffron mb-1">
                {participant.score ? ((participant.score.logic + participant.score.credibility + participant.score.rhetoric) / 3).toFixed(1) : 'N/A'}
              </div>
              <div className="text-xs text-text-muted">Avg Score</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TranscriptTab = () => (
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
          Full Debate Transcript
        </h2>
        {transcript.length > 0 ? (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {transcript.map((turn, index) => (
              <TranscriptItem key={turn.id || index} turn={turn} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-8">No transcript available</p>
        )}
      </div>
    </motion.div>
  );

  // Determine available tabs based on role and debate type
  const availableTabs = ['overview'];
  if (isTeamDebate) availableTabs.push('team-analysis');
  if (currentUserParticipant) availableTabs.push(`individual-${currentUserParticipant.id}`);
  availableTabs.push('transcript');

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
          <p className="text-xl text-text-secondary">Comprehensive analysis and results</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-accent-rust text-white shadow-lg'
                : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
            }`}
          >
            <BarChart className="w-5 h-5" />
            Overview & Analysis
          </button>
          
          {isTeamDebate && (
            <button
              onClick={() => setActiveTab('team-analysis')}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'team-analysis'
                  ? 'bg-accent-rust text-white shadow-lg'
                  : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
              }`}
            >
              <Users className="w-5 h-5" />
              Team Analysis
            </button>
          )}

          {currentUserParticipant && (
            <button
              onClick={() => setActiveTab(`individual-${currentUserParticipant.id}`)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                activeTab === `individual-${currentUserParticipant.id}`
                  ? 'bg-accent-rust text-white shadow-lg'
                  : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
              }`}
            >
              <Award className="w-5 h-5" />
              My Performance
            </button>
          )}

          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'transcript'
                ? 'bg-accent-rust text-white shadow-lg'
                : 'bg-dark-elevated text-text-secondary border border-dark-warm hover:bg-dark-warm'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Full Transcript
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'team-analysis' && isTeamDebate && <TeamAnalysisTab />}
          {activeTab.startsWith('individual-') && (
            <IndividualAnalysisTab participantId={activeTab.replace('individual-', '')} />
          )}
          {activeTab === 'transcript' && <TranscriptTab />}
        </AnimatePresence>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 bg-dark-elevated border border-dark-warm text-text-primary rounded-xl font-semibold hover:bg-dark-warm transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
