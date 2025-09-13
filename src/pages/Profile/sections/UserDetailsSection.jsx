import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const UserDetailsSection = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
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
    // Here you would typically update the user data
    console.log('Updated user data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="glass glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          User Details
        </h3>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Role
            </label>
            <Input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter your role"
              disabled
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <p className="mt-1 text-sm text-[var(--color-text)]">
              {user?.name}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="mt-1 text-sm text-[var(--color-text)]">
              {user?.email}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <p className="mt-1 text-sm text-[var(--color-text)] capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsSection;
