import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

function Home() {
  const floatingRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // GSAP floating animation
    if (floatingRef.current) {
      gsap.to(floatingRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    // Pulsing glow effect
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Neon glow effect */}
      <div 
        ref={glowRef}
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-20"
      ></div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            ref={floatingRef}
            className="mb-8"
            variants={itemVariants}
          >
            <h1 className="text-8xl font-bold mb-4 neon-text" style={{
              textShadow: '0 0 10px #00FF00, 0 0 20px #00FF00, 0 0 30px #00FF00, 0 0 40px #00FF00'
            }}>
              ORATIO
            </h1>
            <div className="text-2xl text-green-400 font-mono tracking-wider mb-2">
              {'>'} AI DEBATE PLATFORM {'<'}
            </div>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 font-mono"
            variants={itemVariants}
          >
            Master the art of debate with real-time AI judging.
            <br/>
            <span className="text-green-500">Logic | Credibility | Rhetoric</span>
          </motion.p>

          <motion.div 
            className="flex gap-6 justify-center"
            variants={itemVariants}
          >
            <Link 
              to="/host" 
              className="group relative px-8 py-4 bg-black border-2 border-green-500 text-green-500 font-bold text-lg overflow-hidden hover:text-black transition-colors duration-300"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'
              }}
            >
              <span className="relative z-10">HOST DEBATE</span>
              <div className="absolute inset-0 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
            
            <Link 
              to="/join" 
              className="group relative px-8 py-4 bg-green-500 text-black font-bold text-lg overflow-hidden hover:bg-green-400 transition-colors duration-300"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'
              }}
            >
              JOIN DEBATE
            </Link>
          </motion.div>
        </div>

        {/* 3D Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
        >
          {[
            { icon: '🧠', title: 'LOGIC', desc: 'AI-powered argument analysis' },
            { icon: '✓', title: 'CREDIBILITY', desc: 'Real-time fact verification' },
            { icon: '🎭', title: 'RHETORIC', desc: 'Persuasion mastery system' },
            { icon: '🎙️', title: 'VOICE', desc: 'Speech-to-text powered' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card relative bg-black border border-green-500 p-6 cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)'
              }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)'
              }}
            >
              <div className="text-5xl mb-4 filter drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2 font-mono">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-mono text-sm">{feature.desc}</p>
              
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Showcase Panels */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
          variants={containerVariants}
        >
          <motion.div
            className="relative bg-black border-2 border-green-500 p-8"
            variants={itemVariants}
            whileHover={{ rotateY: 5, scale: 1.02 }}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
            }}
          >
            <div className="absolute top-4 right-4 text-green-500 font-mono text-sm">
              [SYSTEM_ACTIVE]
            </div>
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-green-400 mb-3 font-mono">
              REAL-TIME ANALYSIS
            </h3>
            <p className="text-gray-400 font-mono leading-relaxed">
              Instant LCR scoring after every turn. AI processes arguments in milliseconds,
              providing actionable feedback during live debates.
            </p>
          </motion.div>

          <motion.div
            className="relative bg-black border-2 border-green-500 p-8"
            variants={itemVariants}
            whileHover={{ rotateY: -5, scale: 1.02 }}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
            }}
          >
            <div className="absolute top-4 right-4 text-green-500 font-mono text-sm">
              [AI_READY]
            </div>
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-green-400 mb-3 font-mono">
              TRAINING MODE
            </h3>
            <p className="text-gray-400 font-mono leading-relaxed">
              Battle AI opponents, track XP, unlock achievements. Personalized
              recommendations to improve your debate skills.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="relative bg-black border-2 border-green-500 p-12 text-center"
          variants={itemVariants}
          style={{
            boxShadow: '0 0 40px rgba(0, 255, 0, 0.4), inset 0 0 20px rgba(0, 255, 0, 0.1)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">
            READY TO ENGAGE?
          </h2>
          <p className="text-xl text-gray-400 mb-8 font-mono">
            Join the next generation of debaters
          </p>
          <div className="flex gap-6 justify-center">
            <Link 
              to="/host" 
              className="px-8 py-4 bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition-all duration-300 font-mono"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
              }}
            >
              START NOW
            </Link>
            <Link 
              to="/trainer" 
              className="px-8 py-4 bg-black border-2 border-green-500 text-green-500 font-bold text-lg hover:bg-green-500 hover:text-black transition-all duration-300 font-mono"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)'
              }}
            >
              TRAIN AI
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        </motion.div>
      </motion.div>

    </div>
  );
}

export default Home;
