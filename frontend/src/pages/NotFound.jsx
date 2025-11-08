import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-accent-rust mb-4">404</div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Debate Not Found</h1>
        <p className="text-xl text-text-secondary mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 border-2 border-dark-warm text-text-secondary rounded-xl font-medium hover:bg-dark-warm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-6 py-3 bg-accent-rust text-white rounded-xl font-medium hover:bg-accent-saffron transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
