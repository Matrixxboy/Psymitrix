import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserDetailsSection, ChangePasswordSection } from './sections';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app">
      <nav className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                PsyMitrix
              </Link>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-8 space-x-4">
                <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Assessments
                </Link>
                <Link to="/games" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Wellness Games
                </Link>
                <Link to="/progress" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Progress
                </Link>
                <Link to="/profile" className="text-[var(--color-primary)] font-medium px-3 py-2 rounded-md text-sm">
                  Profile
                </Link>
              </nav>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Chat
                </Link>
                <Link
                  to="/assessments"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Assessments
                </Link>
                <Link
                  to="/games"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Wellness Games
                </Link>
                <Link
                  to="/progress"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Progress
                </Link>
                <Link
                  to="/profile"
                  className="text-[var(--color-primary)] font-medium block px-3 py-2 rounded-md text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </div>
                  <div className="px-3">
                    <Button variant="secondary" size="sm" onClick={logout} className="w-full">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)]">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <UserDetailsSection />
          <ChangePasswordSection />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
