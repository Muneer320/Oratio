import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, X, Brain, CheckCircle2, Target, Clock } from 'lucide-react';

function Debate() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [argument, setArgument] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmitTurn = () => {
    console.log('Submitting turn:', argument);
    setArgument('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Debate Arena</h1>
            <p className="text-slate-600">Room: <span className="font-mono font-semibold text-indigo-600">{roomCode || 'ABC123'}</span></p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-slate-200"
          >
            <X className="w-4 h-4" />
            Exit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Live Scores</h2>
              
              {/* Player 1 */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-slate-600">Player 1</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    85
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Logic', value: 85, icon: Brain, color: 'indigo' },
                    { label: 'Credibility', value: 78, icon: CheckCircle2, color: 'blue' },
                    { label: 'Rhetoric', value: 92, icon: Target, color: 'purple' }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                          <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                      </div>
                      <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className={`bg-${stat.color}-600 h-full rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player 2 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-slate-600">Player 2</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    82
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Logic', value: 88, icon: Brain, color: 'indigo' },
                    { label: 'Credibility', value: 75, icon: CheckCircle2, color: 'blue' },
                    { label: 'Rhetoric', value: 83, icon: Target, color: 'purple' }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                          <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                      </div>
                      <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className={`bg-${stat.color}-600 h-full rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium opacity-90">Topic</span>
              </div>
              <h3 className="text-2xl font-bold">
                AI will replace most jobs by 2030
              </h3>
            </div>

            {/* Turn History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-96 overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Debate Feed</h3>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-indigo-50 border border-indigo-100 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-900">Player 1</span>
                        <span className="text-xs text-slate-500">2:34</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed mb-3">
                        AI automation is already transforming industries. Studies show 47% of jobs 
                        are at high risk of automation within the next two decades...
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold">
                          L:85
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                          C:78
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                          R:92
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Your Turn</h3>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-none mb-4 transition-all"
                placeholder="Type your argument here..."
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitTurn}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Submit
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
