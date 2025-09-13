import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const UserDetailsSection = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated user data:', formData);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings">Account Details</h3>
        {!isEditing && <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">Edit</Button>}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email" />
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" size="sm">Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-light-body dark:text-dark-body">Name</p>
            <p className="font-semibold text-light-headings dark:text-dark-headings">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-light-body dark:text-dark-body">Email</p>
            <p className="font-semibold text-light-headings dark:text-dark-headings">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsSection;
