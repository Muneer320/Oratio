import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';

function Host() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    timeLimit: 300,
    maxParticipants: 2,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating room:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 noise-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-6">
              <Plus className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-900">Create Room</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Host a Debate
            </h1>
            <p className="text-lg text-slate-600">
              Create your debate room and invite participants for AI-judged competition
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Debate Topic
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  placeholder="e.g., AI will replace most jobs by 2030"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 h-24 resize-none transition-all"
                  placeholder="Add context or rules..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Time per Turn
                  </label>
                  <select
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  >
                    <option value={60}>1 min</option>
                    <option value={120}>2 min</option>
                    <option value={180}>3 min</option>
                    <option value={300}>5 min</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Participants
                  </label>
                  <select
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  >
                    <option value={2}>2 (1v1)</option>
                    <option value={4}>4 (2v2)</option>
                  </select>
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/10"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Room
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Host;
