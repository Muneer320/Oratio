import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

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
      mousePosRef.current = { x: e.clientX, y: e.clientY };
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
          const mouseInfluence = Math.max(0, 1 - Math.abs(x - mousePosRef.current.x) / 300) * 20;
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

      time += 0.005;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-base overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-rust/20 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-accent-rust" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Login to continue your debate journey</p>
        </div>

        <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl">
          {(localError || error) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{localError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-rust focus:ring-2 focus:ring-accent-rust/20 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-rust focus:ring-2 focus:ring-accent-rust/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-accent-rust text-white rounded-xl font-semibold shadow-lg hover:bg-accent-saffron disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent-rust font-semibold hover:text-accent-saffron">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-4 w-full px-6 py-3 bg-dark-surface text-text-secondary rounded-xl font-medium hover:bg-dark-warm transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
      </div>
    </div>
  );
}

export default Login;
