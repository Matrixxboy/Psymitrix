import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RecentSessionsSection, MentalHealthMetricsSection } from './sections';
import Button from '../../components/ui/Button';
import LineChart from '../../components/charts/LineChart';
import RadarChart from '../../components/charts/RadarChart';
import DonutChart from '../../components/charts/DonutChart';
import HeatmapCalendar from '../../components/charts/HeatmapCalendar';

const DashboardPage = () => {
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
                <Link to="/dashboard" className="text-[var(--color-primary)] font-medium px-3 py-2 rounded-md text-sm">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Assessments
                </Link>
                <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </nav>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
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
                  className="text-primary-600 dark:text-primary-400 font-medium block px-3 py-2 rounded-md text-base"
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
                  to="/profile"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] block px-3 py-2 rounded-md text-base font-medium"
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

      <main className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)]">
            Mental Health Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)]">
            Welcome back, {user?.name}! Here's your mental wellness journey overview.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="glass glass-card">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3">Mood Over Time</h3>
            <LineChart labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} values={[6.5,7.1,6.8,7.6,7.9,7.2,7.5]} title="Mood" />
          </div>
          <div className="glass glass-card">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3">Wellness Balance</h3>
            <RadarChart labels={["Sleep","Stress","Energy","Focus","Social"]} values={[7.2,5.8,6.9,7.5,6.1]} />
          </div>
          <div className="glass glass-card">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3">Healing Progress</h3>
            <DonutChart value={72} label="Completion" />
          </div>
          <div className="glass glass-card">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3">Mood Calendar</h3>
            <HeatmapCalendar days={30} values={Array.from({length:30}).map((_,i)=>({date:new Date(Date.now()-(29-i)*86400000), value: Math.random()}))} />
          </div>
          <RecentSessionsSection />
          <MentalHealthMetricsSection />
        </div>

        {/* Quick Actions */}
        <div className="glass glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/chat">
              <Button variant="primary" size="lg" className="w-full">
                Start AI Chat Session
              </Button>
            </Link>
            <Link to="/assessments">
              <Button variant="secondary" size="lg" className="w-full">
                Take Assessment
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="outline" size="lg" className="w-full">
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
