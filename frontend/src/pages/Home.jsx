import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-20">
          <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
            Personalized Debate AI<br/>
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              that learns and grows
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Sharpen your arguments with real-time AI judging. Oratio analyzes your logic, 
            credibility, and rhetoric to help you become a master debater.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/host" className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition duration-200">
              Host a Debate
            </Link>
            <Link to="/join" className="bg-purple-700 bg-opacity-50 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white border-opacity-20 hover:bg-opacity-70 transition duration-200">
              Join Debate
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Logic Analysis</h3>
            <p className="text-gray-300">AI evaluates argument structure and reasoning quality in real-time.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fact-Checking</h3>
            <p className="text-gray-300">Instant credibility scoring with automated source verification.</p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Rhetoric Mastery</h3>
            <p className="text-gray-300">Learn persuasive communication techniques from AI feedback.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="text-5xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice-to-Text</h3>
            <p className="text-gray-300">Speak naturally - AI transcribes and analyzes your arguments.</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Real-Time Judging</h3>
            <p className="text-gray-300 text-lg">
              Get instant LCR scores after every turn. AI analyzes logic, credibility, and rhetoric 
              to give you actionable feedback during the debate.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI Training Mode</h3>
            <p className="text-gray-300 text-lg">
              Practice against AI opponents. Get personalized recommendations and track 
              your improvement with XP and achievement badges.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 border border-white border-opacity-20">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Level Up Your Debate Skills?</h2>
          <p className="text-xl text-gray-100 mb-8">Join thousands of debaters improving with AI-powered feedback</p>
          <div className="flex gap-4 justify-center">
            <Link to="/host" className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition duration-200">
              Start Hosting
            </Link>
            <Link to="/trainer" className="bg-purple-900 bg-opacity-50 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white border-opacity-30 hover:bg-opacity-70 transition duration-200">
              Try AI Trainer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
