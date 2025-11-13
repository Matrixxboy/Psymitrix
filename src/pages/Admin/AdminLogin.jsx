import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginAdmin } from '../../api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginAdmin(formData.email, formData.password);
      
      if (response.success) {
        // Store token and admin info
        localStorage.setItem('adminToken', response.data.access_token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        localStorage.setItem('tokenType', 'Bearer');
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass dark:glass-dark rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
              🔐 Admin Portal
            </h1>
            <p className="text-light-body dark:text-dark-body text-sm">
              Secure access to PsyMitrix Admin Dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
            >
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-light-headings dark:text-dark-headings mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your mail"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-light-accent dark:border-dark-accent bg-light-background dark:bg-dark-background text-light-headings dark:text-dark-headings placeholder-light-body dark:placeholder-dark-body focus:outline-none focus:border-light-primary dark:focus:border-dark-primary transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-light-headings dark:text-dark-headings mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-light-accent dark:border-dark-accent bg-light-background dark:bg-dark-background text-light-headings dark:text-dark-headings placeholder-light-body dark:placeholder-dark-body focus:outline-none focus:border-light-primary dark:focus:border-dark-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-light-primary dark:bg-dark-primary text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-light-secondary dark:border-dark-secondary text-center">
            <p className="text-xs text-light-body dark:text-dark-body">
              🔒 This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;