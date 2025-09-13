import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMentalHealthSessions, getMentalHealthMetrics } from '../../api/sessions';
import Button from '../../components/ui/Button';

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
                <Link to="/progress" className="text-primary-600 dark:text-primary-400 font-medium">
                  Progress
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

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mental Health Progress
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
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
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Wellness Score */}
        {metrics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Overall Wellness Score
              </h2>
              <div className={`text-6xl font-bold mb-2 ${getWellnessScoreColor(metrics.overallWellness.score)}`}>
                {metrics.overallWellness.score}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-4">
                out of 10
              </div>
              <div className={`text-lg font-medium ${getProgressColor(metrics.overallWellness.trend)}`}>
                {metrics.overallWellness.trend} from last week
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {metrics.overallWellness.description}
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Anxiety Level
              </h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metrics.anxiety.level}
              </div>
              <div className={`text-sm font-medium ${getProgressColor(metrics.anxiety.change)}`}>
                {metrics.anxiety.change}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metrics.anxiety.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Depression Scale
              </h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metrics.depression.level}
              </div>
              <div className={`text-sm font-medium ${getProgressColor(metrics.depression.change)}`}>
                {metrics.depression.change}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metrics.depression.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sleep Quality
              </h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metrics.sleepQuality.level}
              </div>
              <div className={`text-sm font-medium ${getProgressColor(metrics.sleepQuality.change)}`}>
                {metrics.sleepQuality.change}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metrics.sleepQuality.description}
              </p>
            </div>
          </div>
        )}

        {/* Session History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Sessions
          </h3>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border-l-4 border-primary-500 pl-4 py-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
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
