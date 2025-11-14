import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Eye, EyeClosed } from "lucide-react";


const ChangePasswordSection = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
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
        toast.success('Password changed successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.data.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Current Password */}
        <div className="relative">
          <Input
            name="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
            className="pr-10"
            required
          />

          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showCurrent ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Input
            name="newPassword"
            type={showNew ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="pr-10"
            required
          />

          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showNew ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="pr-10"
            required
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showConfirm ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>

  );
};

export default ChangePasswordSection;
