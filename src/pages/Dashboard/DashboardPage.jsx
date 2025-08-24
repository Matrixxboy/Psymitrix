import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RecentSessionsSection, MentalHealthMetricsSection } from './sections';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
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
                <Link to="/dashboard" className="text-primary-600 dark:text-primary-400 font-medium">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Assessments
                </Link>
                <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
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

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mental Health Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}! Here's your mental wellness journey overview.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RecentSessionsSection />
          <MentalHealthMetricsSection />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/chat">
              <Button variant="primary" className="w-full">
                Start AI Chat Session
              </Button>
            </Link>
            <Link to="/assessments">
              <Button variant="secondary" className="w-full">
                Take Assessment
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="outline" className="w-full">
                Play Wellness Games
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
