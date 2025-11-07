import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, Trophy, Users, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 noise-bg">
      {/* Hero Section */}
      <section className="relative px-6 py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">AI-Powered Debate Platform</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-8xl font-bold text-slate-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Master the Art
            <br />
            of <span className="text-gradient">Debate</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time AI judging with Logic, Credibility, and Rhetoric scoring.
            Elevate your argumentation skills.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/host">
              <motion.button
                className="group px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-slate-900/10"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Host Debate
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link to="/join">
              <motion.button
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 transition-colors"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Debate
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'Logic Analysis', desc: 'AI evaluates argument structure and reasoning', color: 'purple' },
              { icon: Target, title: 'Credibility Check', desc: 'Real-time fact verification and source validation', color: 'blue' },
              { icon: Sparkles, title: 'Rhetoric Scoring', desc: 'Persuasiveness and delivery effectiveness', color: 'indigo' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 bg-${feature.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { value: '50K+', label: 'Active Debaters', icon: Users },
              { value: '200K+', label: 'Debates Hosted', icon: Trophy },
              { value: '99.9%', label: 'AI Accuracy', icon: Target }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <stat.icon className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                <div className="text-5xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Ready to elevate your debate skills?
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Join thousands of debaters improving with AI feedback
            </p>
            <Link to="/host">
              <motion.button
                className="px-10 py-5 bg-slate-900 text-white rounded-xl font-semibold text-lg shadow-xl shadow-slate-900/20"
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
