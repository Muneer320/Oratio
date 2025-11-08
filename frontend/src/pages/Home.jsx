import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Mic2, Trophy, Users, TrendingUp, ArrowRight, Zap, LogIn, UserPlus, Brain, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Oratio
            </span>
          </Link>

          <div className="flex gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 border-2 border-indigo-500 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-16 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-8">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">AI-Powered Judging</span>
              </div>

              <h1 className="mb-6">
                <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-3">
                  Debate with
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
                Master argumentation with real-time AI scoring across{' '}
                <span className="text-indigo-600 font-semibold">logic</span>,{' '}
                <span className="text-blue-600 font-semibold">credibility</span>, and{' '}
                <span className="text-indigo-500 font-semibold">rhetoric</span>
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link to="/add">
                  <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:shadow-xl transition-all flex items-center gap-2">
                    Host Debate
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                
                <Link to="/home">
                  <button className="px-10 py-4 border-2 border-indigo-500 text-indigo-600 rounded-2xl font-semibold text-lg hover:bg-indigo-50 transition-all">
                    Join Room
                  </button>
                </Link>
              </div>
            </div>

            {/* Right - Score Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 rounded-t-3xl" />
                
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center">
                    <Mic2 className="w-10 h-10 text-indigo-600" />
                  </div>
                  
                  <div className="w-full space-y-5">
                    {[
                      { label: 'Logic', value: 85, color: '#4F46E5', icon: TrendingUp },
                      { label: 'Credibility', value: 92, color: '#3B82F6', icon: Scale },
                      { label: 'Rhetoric', value: 78, color: '#6366F1', icon: Zap }
                    ].map((metric, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                            <span className="text-slate-600 font-medium text-sm">{metric.label}</span>
                          </div>
                          <span className="text-2xl font-bold" style={{ color: metric.color }}>
                            {metric.value}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${metric.value}%`,
                              background: `linear-gradient(90deg, ${metric.color}, ${metric.color}DD)`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Three Pillars of{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Advanced AI evaluates every argument across critical dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: TrendingUp, 
                title: 'Logic Analysis', 
                desc: 'Structural coherence and reasoning strength evaluated with advanced language models',
                gradient: 'from-indigo-500 to-blue-500'
              },
              { 
                icon: Scale, 
                title: 'Credibility Check', 
                desc: 'Real-time fact verification and source validation powered by web search',
                gradient: 'from-blue-500 to-indigo-400'
              },
              { 
                icon: Mic2, 
                title: 'Rhetoric Scoring', 
                desc: 'Persuasiveness and delivery effectiveness measured through linguistic analysis',
                gradient: 'from-indigo-600 to-blue-600'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-12 md:p-20 shadow-2xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { icon: Users, value: '50K+', label: 'Active Debaters', color: 'indigo' },
                { icon: Trophy, value: '200K+', label: 'Debates Hosted', color: 'blue' },
                { icon: Target, value: '99.9%', label: 'AI Accuracy', color: 'indigo' }
              ].map((stat, i) => (
                <div key={i}>
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 text-${stat.color}-600`} />
                  <div className={`text-5xl md:text-6xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 lg:px-16 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Ready to take the{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
              podium?
            </span>
          </h2>
          <p className="text-2xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join thousands mastering debate with instant AI feedback
          </p>
          <Link to="/add">
            <button className="px-14 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-xl hover:shadow-2xl transition-all">
              Start Debating Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-slate-600">
              © 2025 Oratio. Where arguments meet intelligence.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">
                About
              </Link>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Contact
              </a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
