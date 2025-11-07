import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Mic, Trophy, Zap, Users, Target, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="w-4 h-4" />
            AI-Powered Debate Platform
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Master the Art of
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Intelligent Debate
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time AI judging with Logic, Credibility, and Rhetoric scoring.
            Elevate your argumentation skills with instant feedback.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/host" 
              className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
            >
              Host Debate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/join" 
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              Join Debate
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { icon: Brain, title: 'Logic Analysis', desc: 'AI-powered argument structure evaluation', color: 'indigo' },
            { icon: CheckCircle2, title: 'Credibility Check', desc: 'Real-time fact verification and sourcing', color: 'blue' },
            { icon: Target, title: 'Rhetoric Scoring', desc: 'Measure persuasive effectiveness', color: 'purple' },
            { icon: Mic, title: 'Voice-to-Text', desc: 'Speak naturally, we transcribe instantly', color: 'cyan' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Real-time Analysis
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Instant AI-Powered Feedback
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our advanced AI evaluates every argument in real-time, providing comprehensive
                LCR scores that help you understand your strengths and areas for improvement.
              </p>
              <ul className="space-y-4">
                {[
                  'Logic scoring for argument structure',
                  'Credibility verification with sources',
                  'Rhetoric analysis for persuasiveness'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-12 border border-indigo-100">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600">Logic Score</span>
                    <span className="text-2xl font-bold text-indigo-600">92</span>
                  </div>
                  <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-indigo-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '92%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600">Credibility</span>
                    <span className="text-2xl font-bold text-blue-600">88</span>
                  </div>
                  <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-blue-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '88%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600">Rhetoric</span>
                    <span className="text-2xl font-bold text-purple-600">95</span>
                  </div>
                  <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-purple-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '95%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: '10K+', label: 'Active Debaters' },
              { icon: Trophy, value: '50K+', label: 'Debates Hosted' },
              { icon: Target, value: '98%', label: 'Accuracy Rate' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-white"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Debating?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join thousands of debaters improving their skills with AI-powered feedback
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/host" 
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Create Room
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/trainer" 
              className="inline-flex items-center gap-2 bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/20 hover:bg-indigo-400 transition-all duration-300"
            >
              <Trophy className="w-5 h-5" />
              Start Training
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
