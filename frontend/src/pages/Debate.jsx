import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Mic, X } from 'lucide-react';

function Debate() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [argument, setArgument] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmitTurn = () => {
    if (argument.trim()) {
      console.log('Submitting turn:', argument);
      setArgument('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 noise-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Debate Arena</h1>
            <p className="text-slate-600">Room: <span className="font-mono font-semibold">{roomCode || 'ABC123'}</span></p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Live Scores</h2>
              
              {[
                { name: 'Player 1', scores: { logic: 85, credibility: 78, rhetoric: 92 }, total: 85 },
                { name: 'Player 2', scores: { logic: 88, credibility: 75, rhetoric: 83 }, total: 82 }
              ].map((player, i) => (
                <div key={i} className={`${i === 0 ? 'mb-6 pb-6 border-b border-slate-200' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-slate-900">{player.name}</span>
                    <span className="text-3xl font-bold text-purple-600">{player.total}</span>
                  </div>
                  {Object.entries(player.scores).map(([key, value]) => (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="text-slate-600 capitalize">{key}</span>
                        <span className="font-semibold text-slate-900">{value}</span>
                      </div>
                      <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-purple-500 h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold mb-1 opacity-90">TOPIC</p>
              <h3 className="text-2xl font-bold">
                AI will replace most jobs by 2030
              </h3>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 h-96 overflow-y-auto shadow-lg shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Debate Feed</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      P1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-slate-900">Player 1</span>
                        <span className="text-slate-500 text-sm">2:34</span>
                      </div>
                      <p className="text-slate-700 text-sm mb-2">
                        AI automation is already transforming industries...
                      </p>
                      <div className="flex gap-2 text-xs">
                        {[{l:'L:85',c:'purple'},{l:'C:78',c:'blue'},{l:'R:92',c:'indigo'}].map((s,i) => (
                          <span key={i} className={`bg-${s.c}-100 text-${s.c}-700 px-2 py-1 rounded font-semibold`}>
                            {s.l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Turn</h3>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 h-32 resize-none mb-4"
                placeholder="Type your argument..."
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={handleSubmitTurn}
                  className="flex-1 bg-slate-900 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  Submit
                </motion.button>
                <motion.button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-3 rounded-xl font-semibold ${isRecording ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
