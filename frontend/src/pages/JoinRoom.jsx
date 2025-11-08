import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DoorOpen, ArrowRight, AlertCircle, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function JoinRoom() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');

    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.get(`/api/rooms/${roomCode}`);
      if (response.data) {
        navigate(`/debate/${roomCode}`);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Room not found. Please check the code and try again.');
      } else {
        setError(err.response?.data?.detail || 'Failed to join room. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseRooms = () => {
    navigate('/home');
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-accent-saffron/20 rounded-2xl mb-4"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DoorOpen className="w-8 h-8 text-accent-saffron" />
            </motion.div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">Join a Debate</h1>
            <p className="text-text-secondary">Enter a room code to join an ongoing debate</p>
          </div>

          <div className="bg-dark-elevated rounded-2xl border border-dark-warm p-8 shadow-xl">
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-4 bg-dark-surface border border-dark-warm rounded-xl text-text-primary text-center text-2xl font-mono tracking-widest placeholder-text-muted focus:outline-none focus:border-accent-saffron focus:ring-2 focus:ring-accent-saffron/20 transition-all"
                  placeholder="ABC123"
                  maxLength={10}
                  required
                  autoFocus
                />
                <p className="mt-2 text-xs text-text-muted text-center">
                  Enter the 6-character code shared by the debate host
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-accent-saffron text-dark-base rounded-xl font-semibold shadow-lg hover:bg-accent-rust hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? 'Joining...' : 'Join Debate'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-dark-warm">
              <p className="text-sm text-text-secondary text-center mb-3">
                Don't have a code?
              </p>
              <button
                onClick={handleBrowseRooms}
                className="w-full px-6 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary font-medium hover:bg-dark-warm hover:border-accent-teal transition-colors"
              >
                Browse Available Rooms
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-teal transition-colors">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default JoinRoom;
