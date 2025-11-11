import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const UserAnalyticsChart = ({ data, refreshFn }) => {
  const [chartType, setChartType] = useState('trend');

  // Convert daily trends to chart data
  const dailyTrendData = data.daily_trends ? Object.entries(data.daily_trends).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    active: count
  })).reverse().slice(-14) : [];

  // Prepare summary data for pie chart
  const summaryData = [
    { name: 'Active Users', value: data.summary.active_users_30_days },
    { name: 'Inactive Users', value: Math.max(0, data.summary.total_users - data.summary.active_users_30_days) }
  ];

  const COLORS = ['#27AE60', '#E74C3C'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Chart Type Selector */}
      <div className="flex gap-3 pb-4 border-b border-light-secondary/20 dark:border-dark-secondary/20">
        {[
          { id: 'trend', label: '📈 Activity Trend', icon: '📊' },
          { id: 'engagement', label: '💪 Engagement Breakdown', icon: '🎯' }
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setChartType(type.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              chartType === type.id
                ? 'bg-light-accent dark:bg-dark-accent text-white'
                : 'text-light-body dark:text-dark-body hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/10'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {chartType === 'trend' && (
        <div className="glass dark:glass-dark rounded-xl p-6">
          <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
            Active Users Trend (Last 14 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}
                cursor={{ stroke: '#666' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#27AE60" 
                strokeWidth={3}
                dot={{ fill: '#27AE60', r: 5 }}
                activeDot={{ r: 7 }}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'engagement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Status Distribution */}
          <div className="glass dark:glass-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
              User Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} users`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Metrics Bar Chart */}
          <div className="glass dark:glass-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
              User Engagement Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-light-body dark:text-dark-body">Sessions Completed</span>
                  <span className="font-bold text-light-accent dark:text-dark-accent">
                    {data.engagement.total_sessions}
                  </span>
                </div>
                <div className="w-full bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-light-accent to-light-primary dark:from-dark-accent dark:to-dark-primary h-2 rounded-full"
                    style={{ width: `${Math.min((data.engagement.total_sessions / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-light-body dark:text-dark-body">Assessments Completed</span>
                  <span className="font-bold text-light-accent dark:text-dark-accent">
                    {data.engagement.total_assessments}
                  </span>
                </div>
                <div className="w-full bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-light-accent to-light-primary dark:from-dark-accent dark:to-dark-primary h-2 rounded-full"
                    style={{ width: `${Math.min((data.engagement.total_assessments / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-light-body dark:text-dark-body">Mood Entries</span>
                  <span className="font-bold text-light-accent dark:text-dark-accent">
                    {data.engagement.total_mood_entries || 0}
                  </span>
                </div>
                <div className="w-full bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-light-accent to-light-primary dark:from-dark-accent dark:to-dark-primary h-2 rounded-full"
                    style={{ width: `${Math.min((data.engagement.total_mood_entries / 2000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retention Stats */}
      <div className="glass dark:glass-dark rounded-xl p-6">
        <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
          📊 User Retention (30-Day Cohort)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg">
            <p className="text-light-body dark:text-dark-body text-sm">Users Created 30d Ago</p>
            <p className="text-2xl font-bold text-light-primary dark:text-dark-primary mt-2">
              {data.retention.users_created_30_days_ago}
            </p>
          </div>
          <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg">
            <p className="text-light-body dark:text-dark-body text-sm">Users Retained</p>
            <p className="text-2xl font-bold text-light-accent dark:text-dark-accent mt-2">
              {data.retention.users_retained_from_30_days_ago}
            </p>
          </div>
          <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg">
            <p className="text-light-body dark:text-dark-body text-sm">Retention Rate</p>
            <p className="text-2xl font-bold text-green-500 mt-2">
              {data.retention.retention_rate_30_days}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserAnalyticsChart;
