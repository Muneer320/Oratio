import React, { useState } from 'react';
import { Sun, Moon, Bell, Shield, Mic, LogOut } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    autoTranscribe: true,
    publicDebates: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-lg text-slate-600">Customize your Oratio experience.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">Theme</div>
                <div className="text-sm text-slate-600">Choose your preferred color scheme</div>
              </div>
              <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    theme === 'light'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Push Notifications</div>
                  <div className="text-sm text-slate-600">Receive updates about debates</div>
                </div>
                <Toggle
                  enabled={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Speech & Audio
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Auto-Transcribe</div>
                  <div className="text-sm text-slate-600">Automatically convert speech to text</div>
                </div>
                <Toggle
                  enabled={settings.autoTranscribe}
                  onChange={() => handleToggle('autoTranscribe')}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Public Debates by Default</div>
                  <div className="text-sm text-slate-600">Make new debates public automatically</div>
                </div>
                <Toggle
                  enabled={settings.publicDebates}
                  onChange={() => handleToggle('publicDebates')}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Danger Zone
            </h2>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
