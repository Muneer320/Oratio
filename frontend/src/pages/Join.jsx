import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    // TODO: Call API to join room
    console.log('Joining room:', roomCode, 'as', username);
    // navigate(`/debate/${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Join Debate</h1>
          <p className="text-xl text-gray-200">Enter the room code to join</p>
        </div>

        {/* Join Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20">
          <form onSubmit={handleJoin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-white font-semibold mb-2 text-lg">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Room Code */}
            <div>
              <label className="block text-white font-semibold mb-2 text-lg">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white text-2xl font-mono text-center placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 tracking-widest"
                placeholder="ABC123"
                maxLength={6}
                required
              />
            </div>

            {/* Join Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition duration-200"
            >
              Join Debate
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full px-8 py-3 rounded-xl font-semibold bg-white bg-opacity-20 text-white border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
            >
              Back to Home
            </button>
          </form>
        </div>

        {/* Quick Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 mb-4">Don't have a room code?</p>
          <button
            onClick={() => navigate('/host')}
            className="text-purple-300 hover:text-purple-200 font-semibold underline"
          >
            Host your own debate →
          </button>
        </div>

        {/* Spectate Option */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 text-center">
          <p className="text-white mb-3">Want to watch instead?</p>
          <button
            onClick={() => navigate('/spectate')}
            className="text-pink-300 hover:text-pink-200 font-semibold"
          >
            Join as Spectator 👀
          </button>
        </div>
      </div>
    </div>
  );
}

export default Join;
