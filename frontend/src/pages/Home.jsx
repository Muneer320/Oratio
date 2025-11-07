import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            Oratio
          </h1>
          <p className="text-2xl text-blue-200 mb-2">
            The AI Debate Platform
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Sharpen your arguments with AI-powered judging. 
            Real-time debates scored on Logic, Credibility, and Rhetoric.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200">
            Host a Debate
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200">
            Join Debate
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200">
            Train with AI
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Logic</h3>
            <p className="text-gray-300">AI evaluates the strength of your arguments and reasoning</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Credibility</h3>
            <p className="text-gray-300">Fact-checking and source validation in real-time</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Rhetoric</h3>
            <p className="text-gray-300">Master the art of persuasive communication</p>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-400">
          <p>Backend API running at: <code className="bg-black bg-opacity-30 px-2 py-1 rounded">http://localhost:8000</code></p>
        </div>
      </div>
    </div>
  );
}

export default Home;
