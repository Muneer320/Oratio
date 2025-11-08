import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Link as LinkIcon, Bell, DoorOpen, ArrowLeft, Calendar, Timer, User, Award, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UpcomingDebateDetails = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSide, setSelectedSide] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState('');

  useEffect(() => {
    fetchRoomDetails();
    const interval = setInterval(fetchRoomDetails, 5000);
    return () => clearInterval(interval);
  }, [roomCode]);

  useEffect(() => {
    if (room?.scheduled_time) {
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [room]);

  const updateCountdown = () => {
    if (!room?.scheduled_time) return;
    
    const now = new Date();
    const scheduled = new Date(room.scheduled_time);
    const diff = scheduled - now;
    
    if (diff <= 0) {
      setTimeUntilStart('Starting now!');
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let countdown = '';
    if (days > 0) countdown += `${days}d `;
    if (hours > 0) countdown += `${hours}h `;
    if (minutes > 0) countdown += `${minutes}m `;
    countdown += `${seconds}s`;
    
    setTimeUntilStart(countdown);
  };

  const fetchRoomDetails = async () => {
    try {
      const roomData = await api.get(`/api/rooms/code/${roomCode}`);
      setRoom(roomData);
      
      try {
        const debateStatus = await api.get(`/api/debate/${roomData.id}/status`, true);
        setParticipants(debateStatus.participants || []);
      } catch (err) {
        console.log('Participants not loaded yet');
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load debate details');
      setLoading(false);
    }
  };

  const handleJoinDebate = async () => {
    if (!selectedSide && room?.type === 'team') {
      setError('Please select a side (For or Against)');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      await api.post(`/api/debate/${room.id}/join`, {
        team: selectedSide,
        role: 'debater'
      });
      
      navigate(`/debate/${roomCode}`);
    } catch (err) {
      setError(err.details?.detail || 'Failed to join debate');
      setIsJoining(false);
    }
  };

  const handleNotify = () => {
    alert('Notification feature coming soon! You will be notified when this debate starts.');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rust"></div>
        </div>
      </Layout>
    );
  }

  if (error && !room) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-6 py-2 bg-accent-rust text-white rounded-xl hover:bg-accent-saffron transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const maxParticipants = room?.type === 'team' ? 4 : 2;
  const currentParticipants = participants.length;
  const spotsAvailable = maxParticipants - currentParticipants;
  const forCount = participants.filter(p => p.team === 'for').length;
  const againstCount = participants.filter(p => p.team === 'against').length;
  const canJoinFor = room?.type === 'team' ? forCount < 2 : currentParticipants === 0;
  const canJoinAgainst = room?.type === 'team' ? againstCount < 2 : currentParticipants < 2;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 flex items-center gap-2 text-text-secondary hover:text-accent-rust transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-dark-elevated rounded-3xl border border-dark-warm overflow-hidden">
          <div className="bg-gradient-to-br from-accent-rust/20 to-accent-teal/20 p-8 border-b border-dark-warm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-text-primary mb-3">{room.topic}</h1>
                <p className="text-lg text-text-secondary">{room.description}</p>
              </div>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Upcoming
              </span>
            </div>

            <div className="flex items-center gap-6 text-text-secondary mt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-rust" />
                <span>{new Date(room.scheduled_time).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-accent-teal" />
                <span>{room.duration_minutes} minutes</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-dark-surface rounded-2xl p-6 border border-dark-warm">
                <div className="flex items-center gap-3 mb-4">
                  <Timer className="w-6 h-6 text-accent-saffron" />
                  <h3 className="text-xl font-bold text-text-primary">Time Until Start</h3>
                </div>
                <p className="text-3xl font-bold text-accent-rust">{timeUntilStart}</p>
              </div>

              <div className="bg-dark-surface rounded-2xl p-6 border border-dark-warm">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-accent-teal" />
                  <h3 className="text-xl font-bold text-text-primary">Participants</h3>
                </div>
                <p className="text-3xl font-bold text-accent-rust">
                  {currentParticipants}/{maxParticipants}
                </p>
                <p className="text-sm text-text-secondary mt-2">
                  {spotsAvailable} spot{spotsAvailable !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="bg-dark-surface rounded-2xl p-6 border border-dark-warm">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-accent-rust" />
                  <h3 className="text-xl font-bold text-text-primary">Format</h3>
                </div>
                <p className="text-lg text-text-secondary">
                  {room.type === 'team' ? 'Team-based (2v2)' : 'Individual (1v1)'}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {room.rounds} rounds • {room.mode === 'audio' ? '🎙️ Audio' : room.mode === 'both' ? '🎙️💬 Audio & Text' : '💬 Text'}
                </p>
              </div>

              <div className="bg-dark-surface rounded-2xl p-6 border border-dark-warm">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-accent-teal" />
                  <h3 className="text-xl font-bold text-text-primary">Host</h3>
                </div>
                <p className="text-lg text-text-secondary">{room.host_name || 'Anonymous'}</p>
              </div>
            </div>

            {room.resources && room.resources.length > 0 && (
              <div className="mb-8 bg-dark-surface rounded-2xl p-6 border border-dark-warm">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent-saffron" />
                  <h3 className="text-xl font-bold text-text-primary">Resources</h3>
                </div>
                <div className="space-y-2">
                  {room.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent-teal hover:text-accent-rust transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="truncate">{resource}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {room.type === 'team' && spotsAvailable > 0 && (
              <div className="mb-8 bg-dark-surface rounded-2xl p-6 border border-dark-warm">
                <h3 className="text-xl font-bold text-text-primary mb-4">Choose Your Side</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedSide('for')}
                    disabled={!canJoinFor}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedSide === 'for'
                        ? 'border-accent-rust bg-accent-rust/20'
                        : canJoinFor
                        ? 'border-dark-warm hover:border-accent-rust/50'
                        : 'border-dark-warm opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-text-primary mb-2">For</p>
                      <p className="text-sm text-text-secondary">{forCount}/2 slots filled</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedSide('against')}
                    disabled={!canJoinAgainst}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedSide === 'against'
                        ? 'border-accent-teal bg-accent-teal/20'
                        : canJoinAgainst
                        ? 'border-dark-warm hover:border-accent-teal/50'
                        : 'border-dark-warm opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-text-primary mb-2">Against</p>
                      <p className="text-sm text-text-secondary">{againstCount}/2 slots filled</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <motion.button
                onClick={handleJoinDebate}
                disabled={isJoining || spotsAvailable === 0}
                className="flex-1 px-8 py-4 bg-gradient-to-br from-accent-rust to-accent-rust/80 text-white rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={spotsAvailable > 0 ? { scale: 1.02 } : {}}
                whileTap={spotsAvailable > 0 ? { scale: 0.98 } : {}}
              >
                {isJoining ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Joining...
                  </span>
                ) : spotsAvailable === 0 ? (
                  'Debate Full'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <DoorOpen className="w-5 h-5" />
                    Join Debate
                  </span>
                )}
              </motion.button>

              <motion.button
                onClick={handleNotify}
                className="px-8 py-4 bg-dark-surface border border-accent-teal/40 text-accent-teal rounded-xl font-medium text-lg"
                whileHover={{ scale: 1.02, borderColor: 'rgba(74, 154, 159, 0.8)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notify Me
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpcomingDebateDetails;
