import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, TrendingUp, Database, FileUp, BarChart3, Loader } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import UserAnalyticsChart from '../../components/Admin/UserAnalyticsChart';
import AssessmentAnalytics from '../../components/Admin/AssessmentAnalytics';
import VectorDBManager from '../../components/Admin/VectorDBManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const adminInfoStr = localStorage.getItem('adminInfo');

    if (!adminToken) {
      navigate('/admin');
      return;
    }

    if (adminInfoStr) {
      setAdminInfo(JSON.parse(adminInfoStr));
    }

    // Fetch dashboard analytics
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get('/api/v1/admin/analytics/dashboard', config);
      
      if (response.data?.data) {
        setAnalytics(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-light-accent dark:text-dark-accent" />
          <p className="text-light-body dark:text-dark-body">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <header className="glass dark:glass-dark sticky top-0 z-50 border-b border-light-secondary/20 dark:border-dark-secondary/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
              🎛️ Admin Dashboard
            </h1>
            <p className="text-light-body dark:text-dark-body text-sm mt-1">
              Welcome, {adminInfo?.first_name || adminInfo?.username}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:shadow-lg transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-6 mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
        >
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-4 overflow-x-auto pb-4 border-b border-light-secondary/20 dark:border-dark-secondary/20">
          {[
            { id: 'overview', label: '📊 Overview', icon: BarChart3 },
            { id: 'users', label: '👥 Users', icon: Users },
            { id: 'assessments', label: '📋 Assessments', icon: TrendingUp },
            { id: 'vector-db', label: '🗄️ Vector DB', icon: Database }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Users"
                value={analytics.users.summary.total_users}
                icon="👥"
                color="from-blue-400 to-blue-600"
              />
              <MetricCard
                title="Active Users (30d)"
                value={analytics.users.summary.active_users_30_days}
                subtitle={`${analytics.users.summary.active_percentage}% active`}
                icon="🟢"
                color="from-green-400 to-green-600"
              />
              <MetricCard
                title="New Users (30d)"
                value={analytics.users.summary.new_users_30_days}
                icon="✨"
                color="from-purple-400 to-purple-600"
              />
              <MetricCard
                title="Verified Users"
                value={analytics.users.summary.verified_users}
                icon="✅"
                color="from-emerald-400 to-emerald-600"
              />
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass dark:glass-dark rounded-xl p-6">
                <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
                  📈 Engagement Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Total Sessions</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.users.engagement.total_sessions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Total Assessments</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.users.engagement.total_assessments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Avg Sessions/User</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.users.engagement.avg_sessions_per_user}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Avg Assessments/User</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.users.engagement.avg_assessments_per_user}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass dark:glass-dark rounded-xl p-6">
                <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
                  💪 Wellness Averages (30d)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Avg Sleep</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.wellness.averages.sleep_hours} hrs
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Avg Activity</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.wellness.averages.activity_minutes} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Avg Stress Level</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.wellness.averages.stress_level}/10
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-light-body dark:text-dark-body">Avg Wellness Score</span>
                    <span className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {analytics.wellness.averages.wellness_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <UserAnalyticsChart data={analytics.users} />
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && analytics && (
          <UserAnalyticsChart data={analytics.users} refreshFn={fetchAnalytics} />
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && analytics && (
          <AssessmentAnalytics data={analytics.assessments} moodData={analytics.mood} />
        )}

        {/* Vector DB Tab */}
        {activeTab === 'vector-db' && (
          <VectorDBManager />
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass dark:glass-dark rounded-xl p-6 border-l-4 border-light-accent dark:border-dark-accent`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-light-body dark:text-dark-body text-sm font-semibold">{title}</p>
        <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-2">
          {value}
        </p>
        {subtitle && (
          <p className="text-light-accent dark:text-dark-accent text-sm mt-1">{subtitle}</p>
        )}
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </motion.div>
);

export default AdminDashboard;
