import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Sparkles, Zap, Trophy, Target, Users, ArrowRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Advanced GSAP Animations
    gsap.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.2
    });

    gsap.from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });

    gsap.from('.hero-cta', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.8,
      stagger: 0.1
    });

    // Scroll-triggered animations
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        rotation: 5,
        duration: 1,
        ease: 'power3.out',
        delay: i * 0.1
      });
    });

    gsap.utils.toArray('.stat-item').forEach((stat, i) => {
      gsap.from(stat, {
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: i * 0.15
      });
    });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-slow"></div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="fixed w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{ type: 'spring', stiffness: 50 }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="fixed w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
        animate={{
          x: -mousePosition.x * 0.03,
          y: -mousePosition.y * 0.03,
        }}
        transition={{ type: 'spring', stiffness: 50 }}
        style={{ bottom: '10%', right: '10%' }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div 
          className="max-w-7xl mx-auto text-center relative z-10"
          style={{ opacity: opacityProgress }}
        >
          {/* Badge */}
          <motion.div
            className="hero-cta inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 font-medium">AI-Powered Debate Intelligence</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>

          {/* Main Title with Gradient */}
          <h1 className="hero-title text-7xl md:text-9xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              MASTER THE
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative">
              ART OF DEBATE
              <motion.div
                className="absolute -right-8 -top-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Real-time AI judging with <span className="text-purple-400 font-bold">Logic</span>, 
            <span className="text-blue-400 font-bold"> Credibility</span>, and 
            <span className="text-pink-400 font-bold"> Rhetoric</span> scoring.
            <br/>
            Elevate your argumentation to championship level.
          </p>

          {/* CTAs */}
          <div className="flex gap-6 justify-center flex-wrap">
            <Link to="/host">
              <motion.button
                className="hero-cta group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg text-white overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Host Debate
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
            
            <Link to="/join">
              <motion.button
                className="hero-cta group px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl font-bold text-lg text-white"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  Join Debate
                  <Zap className="w-5 h-5" />
                </span>
              </motion.button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1 h-2 bg-white rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section with Glassmorphism */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              POWERED BY <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Advanced machine learning evaluates every argument in real-time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'Logic Analysis', desc: 'AI-powered argument structure evaluation with neural networks', color: 'from-purple-500 to-blue-500', delay: 0 },
              { icon: Target, title: 'Credibility Check', desc: 'Real-time fact verification powered by web search', color: 'from-blue-500 to-cyan-500', delay: 0.2 },
              { icon: Sparkles, title: 'Rhetoric Mastery', desc: 'Persuasion effectiveness measured by linguistic AI', color: 'from-cyan-500 to-purple-500', delay: 0.4 }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.8 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full overflow-hidden">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                  
                  {/* Icon */}
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="relative text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="relative text-white/60 leading-relaxed">{feature.desc}</p>
                  
                  {/* Hover Border Glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Users, value: '50K+', label: 'Active Debaters', color: 'purple' },
              { icon: Trophy, value: '200K+', label: 'Debates Hosted', color: 'blue' },
              { icon: Zap, value: '99.9%', label: 'AI Accuracy', color: 'pink' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-item text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-6xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-xl text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-[3rem] p-16 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 animate-gradient-slow opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                READY TO WIN?
              </h2>
              <p className="text-2xl text-white/90 mb-10">
                Join the future of intelligent debate
              </p>
              <Link to="/host">
                <motion.button
                  className="group px-12 py-6 bg-white text-purple-600 rounded-2xl font-black text-xl"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-3">
                    Start Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <style>{`
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 15s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
