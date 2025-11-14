import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ChangePasswordSection = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        '/api/v1/auth/change-password',
        {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      if (response.data.code === 'OK') {
        setSuccess('Password changed successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(response.data.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-6">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Current Password" required />
        <Input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="New Password" required />
        <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm New Password" required />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordSection;
