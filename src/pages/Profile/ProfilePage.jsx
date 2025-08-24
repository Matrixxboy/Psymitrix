import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserDetailsSection, ChangePasswordSection } from './sections';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
                PsyMitrix
              </Link>
              <nav className="flex space-x-4">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Home
                </Link>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Assessments
                </Link>
                <Link to="/games" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Wellness Games
                </Link>
                <Link to="/progress" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Progress
                </Link>
                <Link to="/profile" className="text-primary-600 dark:text-primary-400 font-medium">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-8">
          <UserDetailsSection />
          <ChangePasswordSection />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
