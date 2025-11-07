import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Scale, Mic2, Trophy, Users, TrendingUp, ArrowRight, Zap, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  const formatValue = (val) => {
    if (suffix === '%') {
      return val.toFixed(1);
    }
    if (suffix === 'K+') {
      return Math.floor(val);
    }
    return Math.floor(val);
  };

  return (
    <span ref={ref}>
      {formatValue(displayValue)}{suffix}
    </span>
  );
}

function Home() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const parallax1 = useTransform(scrollY, [0, 500], [0, -80]);
  const parallax2 = useTransform(scrollY, [0, 500], [0, 40]);
  const { isAuthenticated, user } = useAuth();

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

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const waves = [
        { amplitude: 70, frequency: 0.006, phase: 0, opacity: 0.15, color: '#D67C56', lineWidth: 3 },
        { amplitude: 50, frequency: 0.009, phase: Math.PI / 3, opacity: 0.1, color: '#4A9A9F', lineWidth: 2.5 },
        { amplitude: 40, frequency: 0.012, phase: Math.PI / 2, opacity: 0.08, color: '#F0C674', lineWidth: 2 },
      ];

      waves.forEach(wave => {
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();

        const centerY = canvas.height * 0.35;
        const points = [];
        
        for (let x = 0; x < canvas.width; x += 2) {
          const mouseInfluence = Math.max(0, 1 - Math.abs(x - mousePos.x) / 300) * 20;
          const baseY = centerY + 
            Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2.3 + time * 1.3) * (wave.amplitude * 0.4) +
            Math.sin(x * wave.frequency * 0.7 + time * 0.8) * (wave.amplitude * 0.6) +
            mouseInfluence;
          points.push({ x, y: baseY });
        }

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      time += 0.01;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [mousePos.x]);

  return (
    <div className="min-h-screen bg-dark-base text-text-primary relative overflow-hidden texture-grain">
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ opacity: 0.7 }}
      />

      <div className="absolute top-6 right-6 z-50 flex gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 bg-dark-elevated/90 backdrop-blur-sm border border-dark-warm px-4 py-2 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-text-primary">{user?.username || user?.email}</span>
          </div>
        ) : (
          <>
            <motion.button
              onClick={() => navigate('/login')}
              className="group relative px-5 py-2.5 bg-dark-elevated border border-accent-teal/40 text-accent-teal rounded-xl font-medium text-sm overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(74, 154, 159, 0.8)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/0 to-accent-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/register')}
              className="group relative px-5 py-2.5 bg-gradient-to-br from-accent-rust to-accent-rust/80 text-white rounded-xl font-medium text-sm overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-saffron/0 to-accent-saffron/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </span>
            </motion.button>
          </>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 py-20 z-10">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left - Content (8 cols) */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-accent-rust/10 to-accent-teal/10 border border-accent-rust/20 rounded-full mb-10 backdrop-blur-sm">
                <Scale className="w-4 h-4 text-accent-rust" />
                <span className="text-sm font-medium text-text-secondary">AI-Powered Judging</span>
              </div>

              <h1 className="mb-8 font-display leading-[0.9]">
                <span className="block text-6xl md:text-7xl lg:text-[7rem] font-bold text-text-primary mb-3">
                  Debate with
                </span>
                <span className="block text-6xl md:text-7xl lg:text-[7rem] font-bold bg-gradient-to-r from-accent-rust via-accent-saffron to-accent-teal bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary mb-14 max-w-2xl leading-relaxed font-light">
                Master argumentation with real-time AI scoring across{' '}
                <span className="text-accent-saffron font-semibold">logic</span>,{' '}
                <span className="text-accent-teal font-semibold">credibility</span>, and{' '}
                <span className="text-accent-rust font-semibold">rhetoric</span>
              </p>

              <div className="flex gap-5 flex-wrap">
                <Link to="/host">
                  <motion.button
                    className="group relative px-10 py-5 bg-gradient-to-br from-accent-rust to-accent-rust/80 text-white rounded-2xl font-semibold text-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-saffron/0 to-accent-saffron/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2.5">
                      Host Debate
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                    <div className="absolute inset-0 shadow-[0_0_30px_rgba(214,124,86,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </Link>
                
                <Link to="/join">
                  <motion.button
                    className="group relative px-10 py-5 bg-dark-elevated border-2 border-accent-teal/40 text-accent-teal rounded-2xl font-semibold text-lg overflow-hidden"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(74, 154, 159, 0.8)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/0 to-accent-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">Join Room</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Scorecard Visual (4 cols) */}
            <motion.div 
              className="lg:col-span-4 relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: parallax2 }}
            >
              <div className="relative">
                {/* Custom Card with Diagonal Cut */}
                <div className="relative bg-gradient-to-br from-dark-surface to-dark-elevated rounded-3xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-dark-warm"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}>
                  
                  {/* Gradient Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-rust via-accent-saffron to-accent-teal rounded-t-3xl" />
                  
                  <div className="flex flex-col items-center space-y-8">
                    {/* Icon */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-accent-rust/20 to-accent-teal/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-accent-rust/30">
                      <Mic2 className="w-10 h-10 text-accent-rust" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-saffron rounded-full animate-pulse" />
                    </div>
                    
                    {/* Live Scores */}
                    <div className="w-full space-y-5">
                      {[
                        { label: 'Logic', value: 85, color: '#F0C674', icon: TrendingUp },
                        { label: 'Credibility', value: 92, color: '#4A9A9F', icon: Scale },
                        { label: 'Rhetoric', value: 78, color: '#D67C56', icon: Zap }
                      ].map((metric, i) => (
                        <div key={i} className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                              <span className="text-text-secondary font-medium text-sm">{metric.label}</span>
                            </div>
                            <span className="text-2xl font-bold font-display" style={{ color: metric.color }}>
                              {metric.value}
                            </span>
                          </div>
                          <div className="relative h-2.5 bg-dark-base rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ 
                                background: `linear-gradient(90deg, ${metric.color}, ${metric.color}DD)`,
                                boxShadow: `0 0 10px ${metric.color}80`
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.value}%` }}
                              transition={{ 
                                duration: 1.2, 
                                delay: 0.4 + i * 0.15, 
                                ease: [0.16, 1, 0.3, 1] 
                              }}
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

      {/* Features Section - Asymmetric Cards */}
      <section className="relative px-6 lg:px-16 py-32 z-10">
        <motion.div 
          className="max-w-[1400px] mx-auto"
          style={{ y: parallax1 }}
        >
          <div className="mb-20 max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold font-display text-text-primary mb-5">
              Three Pillars of{' '}
              <span className="bg-gradient-to-r from-accent-rust to-accent-saffron bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-xl text-text-secondary font-light">
              Advanced AI evaluates every argument across critical dimensions
            </p>
          </div>

          {/* Custom Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: TrendingUp, 
                title: 'Logic Analysis', 
                desc: 'Structural coherence and reasoning strength evaluated with advanced language models',
                gradient: 'from-accent-saffron/10 via-accent-saffron/5 to-transparent',
                iconBg: 'from-accent-saffron/20 to-accent-saffron/10',
                iconColor: 'text-accent-saffron',
                delay: 0 
              },
              { 
                icon: Scale, 
                title: 'Credibility Check', 
                desc: 'Real-time fact verification and source validation powered by web search',
                gradient: 'from-accent-teal/10 via-accent-teal/5 to-transparent',
                iconBg: 'from-accent-teal/20 to-accent-teal/10',
                iconColor: 'text-accent-teal',
                delay: 0.15 
              },
              { 
                icon: Mic2, 
                title: 'Rhetoric Scoring', 
                desc: 'Persuasiveness and delivery effectiveness measured through linguistic analysis',
                gradient: 'from-accent-rust/10 via-accent-rust/5 to-transparent',
                iconBg: 'from-accent-rust/20 to-accent-rust/10',
                iconColor: 'text-accent-rust',
                delay: 0.3 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: feature.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
              >
                {/* Custom Shape Card */}
                <div className={`relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-dark-warm group-hover:border-${feature.iconColor.split('-')[1]}-${feature.iconColor.split('-')[2]}/30 transition-all duration-500`}
                     style={{ 
                       clipPath: i === 1 ? 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' : undefined,
                       transform: i === 0 ? 'rotate(-0.5deg)' : i === 2 ? 'rotate(0.5deg)' : undefined
                     }}>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center mb-7 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold font-display text-text-primary mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-text-primary group-hover:to-text-secondary group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats - Elevated Panel */}
      <section className="relative px-6 lg:px-16 py-32 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-dark-elevated via-dark-surface to-dark-elevated rounded-[2.5rem] p-12 md:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-dark-warm overflow-hidden">
            {/* Accent Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-rust/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-teal/10 rounded-full blur-3xl" />
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              {[
                { icon: Users, value: 50, suffix: 'K+', label: 'Active Debaters', color: 'accent-rust' },
                { icon: Trophy, value: 200, suffix: 'K+', label: 'Debates Hosted', color: 'accent-saffron' },
                { icon: Scale, value: 99.9, suffix: '%', label: 'AI Accuracy', color: 'accent-teal' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <stat.icon className={`w-12 h-12 mx-auto mb-5 text-${stat.color}`} />
                  <div className={`text-6xl md:text-7xl font-bold font-display text-${stat.color} mb-3`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  <div className="text-text-secondary font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 lg:px-16 py-40 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold font-display text-text-primary mb-7 leading-tight">
              Ready to take the{' '}
              <span className="bg-gradient-to-r from-accent-rust via-accent-saffron to-accent-teal bg-clip-text text-transparent">
                podium?
              </span>
            </h2>
            <p className="text-2xl text-text-secondary mb-14 max-w-2xl mx-auto font-light">
              Join thousands mastering debate with instant AI feedback
            </p>
            <Link to="/host">
              <motion.button
                className="group relative px-14 py-6 bg-gradient-to-br from-accent-rust to-accent-rust/80 text-white rounded-2xl font-semibold text-xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-saffron/0 to-accent-saffron/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Start Debating Now</span>
                <div className="absolute inset-0 shadow-[0_0_40px_rgba(214,124,86,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
