import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Scale, Mic2, Trophy, Users, TrendingUp, ArrowRight } from 'lucide-react';

function Home() {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();
  const parallax1 = useTransform(scrollY, [0, 500], [0, -100]);
  const parallax2 = useTransform(scrollY, [0, 500], [0, 50]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Layered voice waveforms with Bézier curves
      const waves = [
        { amplitude: 60, frequency: 0.008, phase: 0, opacity: 0.12, color: '#D67C56', lineWidth: 2.5 },
        { amplitude: 45, frequency: 0.012, phase: Math.PI / 3, opacity: 0.09, color: '#4A9A9F', lineWidth: 2 },
        { amplitude: 35, frequency: 0.015, phase: Math.PI / 2, opacity: 0.07, color: '#F0C674', lineWidth: 1.5 },
      ];

      waves.forEach(wave => {
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();

        const centerY = canvas.height * 0.4;
        const points = [];
        
        for (let x = 0; x < canvas.width; x += 3) {
          const baseY = centerY + 
            Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2.3 + time * 1.3) * (wave.amplitude * 0.4) +
            Math.sin(x * wave.frequency * 0.7 + time * 0.8) * (wave.amplitude * 0.6);
          points.push({ x, y: baseY });
        }

        // Smooth Bézier curve through points
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      time += 0.012;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-base text-text-primary relative overflow-hidden texture-grain">
      {/* Voice Wave Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ opacity: 0.6 }}
      />

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-12 py-20 z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column - 7/12 */}
            <motion.div 
              className="col-span-12 lg:col-span-7"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-accent-rust/30 rounded-full mb-8">
                <Scale className="w-4 h-4 text-accent-rust" />
                <span className="text-sm font-medium text-text-secondary">AI-Powered Judging System</span>
              </div>

              {/* Display Headline - Mixed Typography */}
              <h1 className="mb-8 leading-[0.95]">
                <span className="block text-5xl md:text-7xl lg:text-8xl font-bold text-text-primary mb-2">
                  Debate with
                </span>
                <span className="block text-5xl md:text-7xl lg:text-8xl font-serif italic text-accent-rust glow-text">
                  Precision
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-lg leading-relaxed">
                Master the art of argumentation with real-time AI feedback on your 
                <span className="text-accent-saffron font-semibold"> logic</span>,
                <span className="text-accent-teal font-semibold"> credibility</span>, and
                <span className="text-accent-rust font-semibold"> rhetoric</span>.
              </p>

              {/* CTAs */}
              <div className="flex gap-4 flex-wrap">
                <Link to="/host">
                  <motion.button
                    className="group px-8 py-4 bg-accent-rust text-white rounded-custom-md font-semibold shadow-glow hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Host Debate
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <Link to="/join">
                  <motion.button
                    className="px-8 py-4 bg-dark-elevated border-2 border-accent-teal text-accent-teal rounded-custom-md font-semibold hover:bg-dark-warm transition-all duration-200"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Join Room
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column - 5/12 - Decorative Element */}
            <motion.div 
              className="col-span-12 lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              style={{ y: parallax2 }}
            >
              <div className="relative aspect-square lg:aspect-auto lg:h-96">
                {/* Podium Visual */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-rust/10 to-accent-teal/10 rounded-custom-lg backdrop-blur-sm border border-dark-warm">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6">
                    {/* Microphone Icon */}
                    <div className="w-24 h-24 bg-dark-surface rounded-custom-lg flex items-center justify-center shadow-soft border border-dark-warm">
                      <Mic2 className="w-12 h-12 text-accent-rust" />
                    </div>
                    
                    {/* Score Indicators */}
                    <div className="space-y-3 w-full max-w-xs">
                      {[
                        { label: 'Logic', value: 85, color: 'saffron' },
                        { label: 'Credibility', value: 92, color: 'teal' },
                        { label: 'Rhetoric', value: 78, color: 'rust' }
                      ].map((score, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted font-medium">{score.label}</span>
                            <span className={`text-accent-${score.color} font-bold`}>{score.value}</span>
                          </div>
                          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-accent-${score.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${score.value}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 lg:px-12 py-24 z-10">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{ y: parallax1 }}
        >
          {/* Section Header */}
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Three Pillars of <span className="text-accent-rust font-serif italic">Excellence</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Our AI evaluates every argument across three critical dimensions
            </p>
          </div>

          {/* Feature Cards - Irregular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: TrendingUp, 
                title: 'Logic Analysis', 
                desc: 'Structural coherence and reasoning strength evaluated with advanced language models',
                color: 'saffron',
                delay: 0 
              },
              { 
                icon: Scale, 
                title: 'Credibility Check', 
                desc: 'Real-time fact verification and source validation powered by web search',
                color: 'teal',
                delay: 0.15 
              },
              { 
                icon: Mic2, 
                title: 'Rhetoric Scoring', 
                desc: 'Persuasiveness and delivery effectiveness measured through linguistic analysis',
                color: 'rust',
                delay: 0.3 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group bg-dark-surface border border-dark-warm rounded-custom-lg p-8 shadow-soft hover:border-accent-rust/40 hover:shadow-glow transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: feature.delay, duration: 0.7 }}
                whileHover={{ y: -6 }}
              >
                <div 
                  className={`w-14 h-14 bg-accent-${feature.color}/10 rounded-custom-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 text-accent-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section - Dark Elevated Card */}
      <section className="relative px-6 lg:px-12 py-24 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-dark-elevated to-dark-warm rounded-custom-lg p-12 md:p-16 shadow-soft border border-dark-warm">
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
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-accent-rust" />
                  <div className="text-5xl md:text-6xl font-bold text-text-primary mb-2">{stat.value}</div>
                  <div className="text-text-secondary font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 lg:px-12 py-32 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              Ready to step up to the <span className="font-serif italic text-accent-rust glow-text">podium?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
              Join thousands of debaters improving their skills with instant AI feedback
            </p>
            <Link to="/host">
              <motion.button
                className="px-12 py-5 bg-accent-rust text-white rounded-custom-md font-semibold text-lg shadow-glow hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.05, y: -3 }}
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
