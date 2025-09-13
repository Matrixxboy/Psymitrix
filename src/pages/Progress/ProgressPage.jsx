import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMentalHealthSessions, getMentalHealthMetrics } from '../../api/sessions';
import Button from '../../components/ui/Button';
import LineChart from '../../components/charts/LineChart';
import RadarChart from '../../components/charts/RadarChart';
import DonutChart from '../../components/charts/DonutChart';
import HeatmapCalendar from '../../components/charts/HeatmapCalendar';

const ProgressPage = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // week, month, year

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsResponse, metricsResponse] = await Promise.all([
          getMentalHealthSessions(),
          getMentalHealthMetrics()
        ]);
        
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.data);
        }
        
        if (metricsResponse.success) {
          setMetrics(metricsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProgressColor = (change) => {
    if (change.startsWith('+')) return 'text-green-600 dark:text-green-400';
    if (change.startsWith('-') && change.includes('%')) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getWellnessScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <nav className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                PsyMitrix
              </Link>
              <nav className="flex space-x-4">
                <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Home
                </Link>
                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Assessments
                </Link>
                <Link to="/games" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Wellness Games
                </Link>
                <Link to="/progress" className="text-[var(--color-primary)] font-medium">
                  Progress
                </Link>
                <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
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

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Mental Health Progress
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Track your mental wellness journey over time
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'text-white bg-[var(--color-primary)] shadow'
                    : 'glass-button text-[var(--color-text)]'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass glass-card">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Mood Over Time</h3>
              <LineChart
                labels={Array.from({ length: timeframe === 'year' ? 12 : timeframe === 'month' ? 30 : 7 }).map((_, i) => `${i + 1}`)}
                values={Array.from({ length: timeframe === 'year' ? 12 : timeframe === 'month' ? 30 : 7 }).map(() => Math.round((6 + Math.random() * 4) * 10) / 10)}
                title="Mood"
              />
            </div>
            <div className="glass glass-card">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Wellness Balance</h3>
              <RadarChart
                labels={['Sleep', 'Stress', 'Energy', 'Focus', 'Social']}
                values={[7.2, 5.8, 6.9, 7.5, 6.1]}
                title="Balance"
              />
            </div>
            <div className="glass glass-card">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Healing Progress</h3>
              <DonutChart value={Math.min(95, Math.max(20, Math.round(metrics.overallWellness.score * 10)))} label="Completion" />
              <p className="text-center mt-3 text-sm text-[var(--color-text-secondary)]">{metrics.overallWellness.trend} vs last week • {metrics.overallWellness.description}</p>
            </div>
            <div className="glass glass-card">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Mood Calendar</h3>
              <HeatmapCalendar days={30} values={Array.from({ length: 30 }).map((_, i) => ({ date: new Date(Date.now() - (29 - i) * 86400000), value: Math.random() }))} />
            </div>
          </div>
        )}

        {/* Session History */}
        <div className="glass glass-card">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
            Recent Sessions
          </h3>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border-l-4 border-[var(--color-primary)] pl-4 py-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-[var(--color-text)]">
                      {session.type}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.date.toLocaleDateString()} • {session.duration} min
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Score: {session.mentalStateScore}/10
                    </span>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ml-2 ${
                      session.mood === 'Positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      session.mood === 'Calm' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {session.mood}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {session.summary}
                </p>
                {session.insights && session.insights.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Insights:</strong> {session.insights.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
