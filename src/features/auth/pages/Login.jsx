import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { authenticateUser } from '../../../api/auth';
import LoginForm from '../components/LoginForm';

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
    <div className="min-h-screen flex items-center justify-center bg-app py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-[var(--color-text)]">
            Welcome to PsyMitrix
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-secondary">
            Sign in to your account
          </p>
        </div>
        
        <div className="glass glass-card">
          <LoginForm 
            onSubmit={handleLogin} 
            loading={loading} 
            error={error} 
          />
          
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-secondary">
              Demo credentials: utsav@gmail.com / 123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
