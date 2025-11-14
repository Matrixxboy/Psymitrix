import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Eye, EyeClosed } from "lucide-react";


const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: 'utsav005@gmail.com',
    password: 'utsavlankapati2'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>

      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
        </button>
      </div>

      {error && (
        <div className="text-error text-sm p-3 bg-error/10 rounded-lg border border-error/20">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
