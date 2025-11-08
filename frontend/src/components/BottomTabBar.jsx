import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Brain, User, Settings } from 'lucide-react';

const BottomTabBar = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Add', path: '/add', icon: PlusCircle },
    { name: 'Learn', path: '/learn', icon: Brain },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-elevated border-t border-dark-warm shadow-lg z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                  active
                    ? 'text-accent-rust'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                title={tab.name}
              >
                <Icon className={`${active ? 'w-6 h-6' : 'w-5 h-5'} transition-all`} />
                {active && (
                  <span className="text-xs font-medium mt-1">{tab.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomTabBar;
