import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ChangePasswordSection = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Password changed successfully!');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-6">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} placeholder="Current Password" />
        <Input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="New Password" />
        <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm New Password" />
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
