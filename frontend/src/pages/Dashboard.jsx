import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Clock, Trophy, ChevronRight, Flame, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms/list');
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const ongoingDebates = rooms.filter(room => room.status === 'in_progress');
  const upcomingDebates = rooms.filter(room => room.status === 'waiting');
  const pastDebates = rooms.filter(room => room.status === 'completed');

  const DebateCard = ({ room, type }) => {
    const handleClick = () => {
      if (type === 'ongoing') {
        navigate(`/debate/${room.room_code}`);
      } else if (type === 'upcoming') {
        navigate(`/debate/${room.room_code}`);
      } else if (type === 'past') {
        navigate(`/results/${room.room_code}`);
      }
    };

    return (
      <div
        onClick={handleClick}
        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {room.topic || 'Untitled Debate'}
            </h3>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Host: {room.host_name || 'Anonymous'}</span>
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            type === 'ongoing' ? 'bg-green-100 text-green-700' :
            type === 'upcoming' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {type === 'ongoing' ? 'Live' : type === 'upcoming' ? 'Scheduled' : 'Completed'}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          {type === 'ongoing' && (
            <>
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                Round {room.current_round || 1}/{room.total_rounds || 3}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {room.spectator_count || 0} watching
              </span>
            </>
          )}
          {type === 'upcoming' && (
            <>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Starts soon
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.participant_count || 0}/{room.max_participants || 2} joined
              </span>
            </>
          )}
          {type === 'past' && (
            <>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Winner: {room.winner_name || 'N/A'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
              room.mode === 'audio' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {room.mode === 'audio' ? '🎙️ Audio' : '💬 Text'}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    );
  };

  const Section = ({ title, icon: Icon, children, count }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-xl">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
          {count}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-lg text-slate-600">Explore ongoing debates, join upcoming rooms, or review past performances.</p>
      </div>

      <Section title="Ongoing Debates" icon={Flame} count={ongoingDebates.length}>
        {ongoingDebates.length > 0 ? (
          ongoingDebates.map(room => (
            <DebateCard key={room.id} room={room} type="ongoing" />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Play className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No ongoing debates right now.</p>
            <button
              onClick={() => navigate('/add')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Start a Debate
            </button>
          </div>
        )}
      </Section>

      <Section title="Upcoming Debates" icon={Clock} count={upcomingDebates.length}>
        {upcomingDebates.length > 0 ? (
          upcomingDebates.map(room => (
            <DebateCard key={room.id} room={room} type="upcoming" />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No upcoming debates scheduled.</p>
          </div>
        )}
      </Section>

      <Section title="Past Debates" icon={Trophy} count={pastDebates.length}>
        {pastDebates.length > 0 ? (
          pastDebates.slice(0, 6).map(room => (
            <DebateCard key={room.id} room={room} type="past" />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No past debates yet.</p>
          </div>
        )}
      </Section>
    </Layout>
  );
};

export default Dashboard;
