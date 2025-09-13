import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { authenticateUser } from '../../../api/auth';
import LoginForm from '../components/LoginForm';
import { FaGoogle, FaApple } from 'react-icons/fa';
import GlassCard from '../../../components/ui/GlassCard';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticateUser(formData.email, formData.password);
      
      if (result.success) {
        login(result.data.user, result.data.token);
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-light-background to-light-primary/20 dark:from-dark-background dark:to-dark-primary/20">
      <div className="w-full max-w-md">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-light-headings dark:text-dark-headings">
              Welcome Back
            </h2>
            <p className="mt-2 text-light-body dark:text-dark-body">
              Sign in to continue your journey.
            </p>
          </div>
          
          <LoginForm 
            onSubmit={handleLogin} 
            loading={loading} 
            error={error} 
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-light-background/50 /50 rounded-full text-light-body dark:text-dark-body">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-light-headings dark:text-dark-headings font-semibold">
              <FaGoogle />
              Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-light-headings dark:text-dark-headings font-semibold">
              <FaApple />
              Apple
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-light-body dark:text-dark-body">
              Don't have an account? <a href="#" className="font-semibold text-light-primary dark:text-dark-primary hover:underline">Sign Up</a>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
