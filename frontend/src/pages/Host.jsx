import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Host() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    timeLimit: 300,
    maxParticipants: 2,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Call API to create room
    console.log('Creating room:', formData);
    // navigate to debate room
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Host a Debate</h1>
          <p className="text-xl text-gray-200">Create your debate room and invite participants</p>
        </div>

        {/* Form Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-white font-semibold mb-2 text-lg">
                Debate Topic *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="e.g., AI will replace most jobs by 2030"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-2 text-lg">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 h-24 resize-none"
                placeholder="Add context or rules for this debate..."
              />
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-white font-semibold mb-2 text-lg">
                Time Limit (seconds per turn)
              </label>
              <select
                value={formData.timeLimit}
                onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value={60} className="text-gray-900">1 minute</option>
                <option value={120} className="text-gray-900">2 minutes</option>
                <option value={180} className="text-gray-900">3 minutes</option>
                <option value={300} className="text-gray-900">5 minutes</option>
              </select>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-white font-semibold mb-2 text-lg">
                Number of Debaters
              </label>
              <select
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value={2} className="text-gray-900">2 (1v1)</option>
                <option value={4} className="text-gray-900">4 (2v2)</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition duration-200"
              >
                Create Room
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20 text-center">
            <div className="text-3xl mb-2">🔗</div>
            <p className="text-white font-semibold">Shareable Room Code</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20 text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-white font-semibold">Spectator Mode</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-white font-semibold">AI Judge Included</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Host;
