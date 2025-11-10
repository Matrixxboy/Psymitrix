import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const UserDetailsSection = () => {
  const { user, updateUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find only changed fields
    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== user[key]) {
        changedFields[key] = formData[key];
      }
    });

    // If no fields changed, do nothing
    if (Object.keys(changedFields).length === 0) {
      console.log('No changes detected');
      setIsEditing(false);
      return;
    }

    console.log('Changed fields:', changedFields);

    try {
      // Send only changed fields to API
      await updateUser(changedFields);
      console.log('User data updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings">
          Account Details
        </h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your Username"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  username: user?.username || '',
                  email: user?.email || '',
                });
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-light-body dark:text-dark-body">Username</p>
            <p className="font-semibold text-light-headings dark:text-dark-headings">
              {user?.username}
            </p>
          </div>
          <div>
            <p className="text-sm text-light-body dark:text-dark-body">Email</p>
            <p className="font-semibold text-light-headings dark:text-dark-headings">
              {user?.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsSection;
