import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Send, Mic, MicOff, X, Brain, CheckCircle2, Target, Zap } from 'lucide-react';

function Debate() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [argument, setArgument] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    let rafId;
    function animate() {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        particles.forEach((p2, j) => {
          if (i !== j) {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      });

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    const anim = gsap.from('.debate-container', {
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (anim) anim.kill();
    };
  }, []);

  const handleSubmitTurn = () => {
    if (argument.trim()) {
      console.log('Submitting turn:', argument);
      setArgument('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 opacity-50" />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="debate-container relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1 className="text-4xl font-black text-white">DEBATE ARENA</h1>
            <p className="text-purple-400 font-mono">ROOM: <span className="text-white">{roomCode || 'ABC123'}</span></p>
          </motion.div>
          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sticky top-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                LIVE SCORES
              </h2>
              
              {/* Player Scores */}
              {[
                { name: 'Player 1', scores: { logic: 85, credibility: 78, rhetoric: 92 }, total: 85 },
                { name: 'Player 2', scores: { logic: 88, credibility: 75, rhetoric: 83 }, total: 82 }
              ].map((player, i) => (
                <div key={i} className={`${i === 0 ? 'mb-6 pb-6 border-b border-white/10' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/70 font-semibold">{player.name}</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {player.total}
                    </span>
                  </div>
                  {Object.entries(player.scores).map(([key, value]) => (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-white/50 text-sm capitalize">{key}</span>
                        <span className="text-white font-bold">{value}</span>
                      </div>
                      <div className="bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic */}
            <motion.div
              className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 overflow-hidden"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <Target className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-1">TOPIC</p>
                  <h3 className="text-2xl font-bold text-white">
                    AI will replace most jobs by 2030
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Turn History */}
            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 h-96 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Debate Feed</h3>
              <div className="space-y-4">
                <AnimatePresence>
                  <motion.div
                    className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                        P1
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-white">Player 1</span>
                          <span className="text-white/40 text-sm">2:34</span>
                        </div>
                        <p className="text-white/70 text-sm mb-2">
                          AI automation is already transforming industries...
                        </p>
                        <div className="flex gap-2">
                          {[{l:'L:85',c:'purple'},{l:'C:78',c:'blue'},{l:'R:92',c:'pink'}].map((s,i) => (
                            <span key={i} className={`text-xs bg-${s.c}-500/20 text-${s.c}-400 px-2 py-1 rounded font-bold`}>
                              {s.l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Your Turn</h3>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 h-32 resize-none mb-4"
                placeholder="Type your argument..."
              />
              <div className="flex gap-3">
                <motion.button
                  onClick={handleSubmitTurn}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  Submit
                </motion.button>
                <motion.button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-4 rounded-xl font-bold ${isRecording ? 'bg-red-500' : 'bg-white/10'} text-white`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debate;
