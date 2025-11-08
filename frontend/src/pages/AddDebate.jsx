import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, Clock, Users, FileText, Lock, Unlock } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../services/api';

const AddDebate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    date: '',
    time: '',
    duration: 30,
    mode: 'text',
    format: 'individual',
    visibility: 'public',
    max_participants: 2,
    total_rounds: 3,
    resources: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resourceLinks = formData.resources
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);

      const scheduledTime = formData.date && formData.time
        ? new Date(`${formData.date}T${formData.time}`).toISOString()
        : new Date().toISOString();

      const response = await api.post('/rooms/create', {
        topic: formData.topic,
        description: formData.description,
        scheduled_time: scheduledTime,
        duration_minutes: parseInt(formData.duration),
        mode: formData.mode,
        type: formData.format,
        visibility: formData.visibility,
        rounds: parseInt(formData.total_rounds),
        resources: resourceLinks,
      });

      navigate(`/debate/${response.data.room_code}`);
    } catch (error) {
      console.error('Error creating debate:', error);
      alert('Failed to create debate. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create New Debate</h1>
          <p className="text-lg text-slate-600">Set up your debate room with custom settings and invite participants.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Debate Title *
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                placeholder="e.g., Should AI replace human judges in debates?"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Provide context and rules for your debate..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="5"
                  max="120"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Max Participants
                </label>
                <input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleChange}
                  min="2"
                  max="10"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Debate Format</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'text', label: '💬 Text', icon: '💬' },
                  { value: 'audio', label: '🎙️ Audio', icon: '🎙️' },
                  { value: 'both', label: '🔀 Both', icon: '🔀' }
                ].map(mode => (
                  <label
                    key={mode.value}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.mode === mode.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={mode.value}
                      checked={formData.mode === mode.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium">{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
              <div className="grid grid-cols-2 gap-4">
                {['individual', 'team'].map(format => (
                  <label
                    key={format}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.format === format
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format}
                      checked={formData.format === format}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium capitalize">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
              <div className="grid grid-cols-2 gap-4">
                {['public', 'private'].map(visibility => (
                  <label
                    key={visibility}
                    className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.visibility === visibility
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={visibility}
                      checked={formData.visibility === visibility}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {visibility === 'public' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span className="font-medium capitalize">{visibility}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Rounds</label>
              <input
                type="number"
                name="total_rounds"
                value={formData.total_rounds}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resource Links (optional)
              </label>
              <textarea
                name="resources"
                value={formData.resources}
                onChange={handleChange}
                rows={2}
                placeholder="Add reference links (one per line): https://example.com/article1..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">Provide research materials or reference documents for participants</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.topic}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? 'Creating...' : 'Create Debate'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddDebate;
