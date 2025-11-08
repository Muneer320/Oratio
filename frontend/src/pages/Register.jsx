import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Profile picture must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select a valid image file');
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLocalError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.username, formData.password, profilePicture);
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base noise-bg flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-teal/20 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-accent-teal" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Join the debate community today</p>
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
                  className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                  placeholder="coolDebater123"
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
                  className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Profile Picture <span className="text-text-muted text-xs font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                {profilePicturePreview ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent-teal">
                    <img
                      src={profilePicturePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setProfilePicturePreview(null);
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-xs">Remove</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-dark-surface border-2 border-dashed border-dark-warm flex items-center justify-center">
                    <Image className="w-8 h-8 text-text-muted" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-3 bg-dark-surface border border-dark-warm rounded-xl text-text-secondary hover:border-accent-teal transition-all text-center">
                    <span className="text-sm">Choose Image</span>
                    <p className="text-xs text-text-muted mt-1">Max 5MB (JPG, PNG)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-accent-teal text-white rounded-xl font-semibold shadow-lg hover:bg-accent-saffron disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-teal font-semibold hover:text-accent-saffron">
                  Login
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
  );
}

export default Register;
