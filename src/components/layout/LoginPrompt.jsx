import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const LoginPrompt = () => {
  const { isLoggedIn } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  if (isLoggedIn || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-light-secondary dark:bg-dark-secondary text-white p-4 text-center z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <p>
          <span className="font-semibold">Enjoying the content?</span>{' '}
          <Link to="/login" className="underline hover:text-light-primary">
            Log in or sign up
          </Link>{' '}
          to access all features.
        </p>
        <button onClick={() => setIsVisible(false)} className="p-1 rounded-full hover:bg-white/20">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
