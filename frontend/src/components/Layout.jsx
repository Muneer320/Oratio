import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BottomTabBar from './BottomTabBar';
import logo from '../assets/Logo.png';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-base text-text-primary pb-20">
      {/* Top Header - Simplified */}
      <header className="bg-dark-elevated border-b border-dark-warm shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/home" className="flex items-center space-x-3" title="Oratio">
              <img src={logo} alt="Oratio Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-accent-rust via-accent-saffron to-accent-teal bg-clip-text text-transparent font-display">
                Oratio
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-text-primary">{user.username || user.name}</p>
                    <p className="text-xs text-text-muted">Level {user.level || 1}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-rust to-accent-teal flex items-center justify-center text-white font-bold">
                    {(user.username || user.name || 'U')[0].toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-secondary hover:text-accent-rust hover:bg-dark-warm rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};

export default Layout;
