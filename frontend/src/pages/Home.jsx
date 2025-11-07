import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Scale, Mic, Users, Trophy, TrendingUp } from 'lucide-react';

function Home() {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 25]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create multiple sound wave layers
      const waves = [
        { amp: 40, freq: 0.01, phase: 0, opacity: 0.08, color: '#D96C4F' },
        { amp: 30, freq: 0.015, phase: Math.PI / 3, opacity: 0.06, color: '#5B9A8B' },
        { amp: 50, freq: 0.008, phase: Math.PI / 2, opacity: 0.05, color: '#1F1D27' }
      ];

      waves.forEach(wave => {
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += 2) {
          const y = canvas.height / 2 + 
                   Math.sin(x * wave.freq + time + wave.phase) * wave.amp +
                   Math.sin(x * wave.freq * 2 + time * 1.5) * (wave.amp / 2);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      time += 0.01;
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F2EC] texture-overlay overflow-hidden">
      {/* Voice Wave Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none" 
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left - Content */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full mb-6 border border-[#1F1D27]/10">
                <Scale className="w-4 h-4 text-[#D96C4F]" />
                <span className="text-sm font-medium text-[#1F1D27]">AI-Powered Judging</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#1F1D27] mb-6 leading-[0.95]">
                The Art of
                <br />
                <span className="text-[#D96C4F] italic font-serif">Persuasion</span>
              </h1>

              <p className="text-xl md:text-2xl text-[#1F1D27]/70 mb-10 max-w-xl leading-relaxed">
                Real-time AI evaluation of your logic, credibility, and rhetoric. 
                Sharpen your debate skills with instant feedback.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link to="/host">
                  <motion.button
                    className="px-8 py-4 bg-[#1F1D27] text-white rounded-lg font-semibold shadow-lg shadow-[#1F1D27]/20 hover:shadow-xl hover:shadow-[#1F1D27]/30 transition-all"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Host a Debate
                  </motion.button>
                </Link>
                
                <Link to="/join">
                  <motion.button
                    className="px-8 py-4 bg-white text-[#1F1D27] rounded-lg font-semibold border-2 border-[#1F1D27]/20 hover:border-[#1F1D27]/40 hover:bg-white/80 transition-all"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join Room
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Visual Element */}
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: y2 }}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Podium Illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D96C4F]/20 to-[#5B9A8B]/20 rounded-[3rem] backdrop-blur-sm border border-white/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-white/80 rounded-2xl flex items-center justify-center shadow-xl">
                      <Mic className="w-12 h-12 text-[#D96C4F]" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-32 mx-auto bg-[#D96C4F]/30 rounded-full"></div>
                      <div className="h-2 w-24 mx-auto bg-[#5B9A8B]/30 rounded-full"></div>
                      <div className="h-2 w-28 mx-auto bg-[#1F1D27]/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1D27] mb-4">
              Three Pillars of <span className="text-[#D96C4F]">Great Debate</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: TrendingUp, 
                title: 'Logic', 
                desc: 'Structured reasoning and argument coherence evaluated in real-time',
                color: '#D96C4F',
                delay: 0 
              },
              { 
                icon: Scale, 
                title: 'Credibility', 
                desc: 'Fact-checking and source validation powered by AI',
                color: '#5B9A8B',
                delay: 0.1 
              },
              { 
                icon: Mic, 
                title: 'Rhetoric', 
                desc: 'Persuasiveness and delivery effectiveness analysis',
                color: '#1F1D27',
                delay: 0.2 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#1F1D27]/10 hover:border-[#1F1D27]/20 hover:bg-white/80 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                whileHover={{ y: -4 }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl font-bold text-[#1F1D27] mb-3">{feature.title}</h3>
                <p className="text-[#1F1D27]/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-24">
        <motion.div 
          className="max-w-5xl mx-auto"
          style={{ y: y1 }}
        >
          <div className="bg-gradient-to-br from-[#1F1D27] to-[#3A3844] rounded-3xl p-12 md:p-16 text-white shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { icon: Users, value: '50K+', label: 'Active Debaters' },
                { icon: Trophy, value: '200K+', label: 'Debates Hosted' },
                { icon: Scale, value: '99.9%', label: 'AI Accuracy' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <stat.icon className="w-10 h-10 mx-auto mb-4 text-[#D96C4F]" />
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#1F1D27] mb-6">
              Ready to take the <span className="italic font-serif text-[#D96C4F]">podium?</span>
            </h2>
            <p className="text-xl text-[#1F1D27]/70 mb-10 max-w-2xl mx-auto">
              Join thousands improving their debate skills with AI-powered feedback
            </p>
            <Link to="/host">
              <motion.button
                className="px-12 py-5 bg-[#D96C4F] text-white rounded-lg font-semibold text-lg shadow-xl shadow-[#D96C4F]/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Debating Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
