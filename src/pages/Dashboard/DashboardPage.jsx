import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiBarChart2, FiActivity, FiCheckSquare, FiCalendar, FiZap, FiTrendingUp, FiBook } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

import LineChart from '../../components/charts/LineChart';
import RadarChart from '../../components/charts/RadarChart';
import DonutChart from '../../components/charts/DonutChart';
import HeatmapCalendar from '../../components/charts/HeatmapCalendar';

import DashboardHeader from './sections/DashboardHeader';
import PrimaryCTA from './sections/PrimaryCTA';
import MoodTracker from './sections/MoodTracker';
import SuggestionCard from './sections/SuggestionCard';
import InsightCard from './sections/InsightCard';
import DashboardSkeleton from './sections/DashboardSkeleton';
import ChartCard from './ChartCard';
import GlassCard from '../../components/ui/GlassCard';

const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
    ? "Good afternoon"
    : "Good evening";
};

const processMoodTrends = (moodTrends, timeframe = 'month') => {
  if (!moodTrends || moodTrends.length === 0) {
    return { labels: [], values: [] };
  }

  const now = new Date();
  let cutoffDate;
  
  if (timeframe === 'week') {
    cutoffDate = new Date(now.setDate(now.getDate() - 7));
  } else if (timeframe === 'year') {
    cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
  } else {
    cutoffDate = new Date(now.setDate(now.getDate() - 30));
  }

  const filtered = moodTrends.filter(trend => new Date(trend.created_at) >= cutoffDate);

  const labels = filtered.map(trend => {
    const date = new Date(trend.created_at);
    if (timeframe === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeframe === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  });

  const moodScores = {
    'excited': 10,
    'happy': 8,
    'calm': 7,
    'neutral': 5,
    'sad': 3,
    'angry': 2
  };

  const values = filtered.map(trend => moodScores[trend.mood]);

  return { labels, values };
};

const TimeframeButton = ({ label, value, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      selected
        ? 'bg-light-primary dark:bg-dark-primary text-white shadow-md'
        : 'bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-headings dark:text-dark-headings hover:bg-light-secondary/30 dark:hover:bg-dark-secondary/30'
    }`}
  >
    {label}
  </button>
);

const MetricCard = ({ title, value, icon: Icon, subtitle }) => (
  <GlassCard className="p-4 flex flex-col items-start">
    <div className="flex items-center justify-between w-full mb-2">
      <h5 className="text-sm font-semibold text-light-headings dark:text-dark-headings">{title}</h5>
      <Icon className="text-light-primary dark:text-dark-primary text-lg" />
    </div>
    <p className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-1">{value || 'N/A'}</p>
    {subtitle && <p className="text-xs text-light-body/70 dark:text-dark-body/70">{subtitle}</p>}
  </GlassCard>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [mood, setMood] = useState(5);
  const [aiInsights, setAiInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const moodTrend = processMoodTrends(user.mood_trends, timeframe);
          
          const mapped = {
            moodTrend: moodTrend,
            activityBreakdown: { value: 68, label: "Weekly Goal" },
            wellnessBalance: { labels: ["Stress", "Sleep", "Mood", "Energy", "Focus"], datasets: [{ label: "This Week", data: [6, 5, 7, 6, 5] }, { label: "Last Week", data: [5, 6, 6, 5, 6] }] },
            consistency: [{ date: "2025-01-01", value: 0.7 }, { date: "2025-01-02", value: 0.3 }, { date: "2025-01-03", value: 0.9 }],
            dailyInsight: { title: "Mental Health Status", text: "Your mood has been stable with positive trends. Keep up the consistency!" },
            suggestions: { activities: [{ title: "Breathing Exercise", details: "5 min" }, { title: "Mindful Walk", details: "15 min" }], tests: [{ title: "Anxiety Score (GAD-7)", details: "Quick check-in" }] },
          };
          
          setData(mapped);

          // Fetch AI insights
          try {
            const insightsResponse = await axios.get(
              `/api/v1/ai_analytics/insights?timeframe=${timeframe}`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (insightsResponse.data?.data) {
              setAiInsights(insightsResponse.data.data);
            }
          } catch (err) {
            console.log('AI Insights not available yet');
          }

          // Fetch recommendations
          try {
            const recsResponse = await axios.get(
              `/api/v1/recommendations/personalized`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (recsResponse.data?.data) {
              setRecommendations(recsResponse.data.data);
            }
          } catch (err) {
            console.log('Recommendations not available yet');
          }

        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, timeframe]);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8 mt-[50px]">
      <main className="max-w-7xl mx-auto">
        <DashboardHeader user={user} greeting={getGreeting()} />

        {/* Timeframe Filter */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 flex gap-3 flex-wrap"
        >
          <TimeframeButton
            label="Week"
            value="week"
            selected={timeframe === 'week'}
            onClick={() => setTimeframe('week')}
          />
          <TimeframeButton
            label="Month"
            value="month"
            selected={timeframe === 'month'}
            onClick={() => setTimeframe('month')}
          />
          <TimeframeButton
            label="Year"
            value="year"
            selected={timeframe === 'year'}
            onClick={() => setTimeframe('year')}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <motion.div variants={itemVariants}>
              <PrimaryCTA />
            </motion.div>

            {/* Wellness Metrics Cards */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard 
                  title="Avg Mood"
                  value={data.moodTrend.values.length > 0 ? Math.round(data.moodTrend.values.reduce((a, b) => a + b, 0) / data.moodTrend.values.length) : 'N/A'}
                  icon={FiZap}
                  subtitle={`${data.moodTrend.values.length} entries`}
                />
                <MetricCard 
                  title="Current Streak"
                  value={`${user.streak} days`}
                  icon={FiTrendingUp}
                  subtitle={`Best: ${user.longest_streak}`}
                />
                <MetricCard 
                  title="Assessments"
                  value={user.mental_health_profile.assessment_results.length}
                  icon={FiCheckSquare}
                  subtitle="Total completed"
                />
              </div>
            </motion.div>

            {/* Mood Trend Chart */}
            <motion.div variants={itemVariants}>
              <ChartCard title={`Mood Trend (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`} icon={FiBarChart2}>
                <div className="h-64">
                  <LineChart {...data.moodTrend} />
                </div>
              </ChartCard>
            </motion.div>

            {/* Activity and Wellness Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="flex">
                <ChartCard title="Activity Breakdown" icon={FiActivity} className="w-full">
                  <div className="h-64 flex items-center justify-center">
                    <DonutChart {...data.activityBreakdown} />
                  </div>
                </ChartCard>
              </motion.div>

              <motion.div variants={itemVariants} className="flex">
                <ChartCard title="Wellness Balance" icon={FiCheckSquare} className="w-full">
                  <div className="h-64 flex items-center justify-center">
                    <RadarChart {...data.wellnessBalance} />
                  </div>
                </ChartCard>
              </motion.div>
            </div>

            {/* AI Insights Section */}
            {aiInsights && (
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiBook className="text-light-primary dark:text-dark-primary" />
                    <h3 className="text-lg font-semibold text-light-headings dark:text-dark-headings">AI Insights</h3>
                  </div>
                  <div className="space-y-3">
                    {aiInsights.overall_insights?.slice(0, 3).map((insight, idx) => (
                      <p key={idx} className="text-sm text-light-body dark:text-dark-body leading-relaxed">
                        • {insight}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-light-secondary/30 dark:border-dark-secondary/30">
                    <h4 className="text-sm font-semibold text-light-headings dark:text-dark-headings mb-2">Suggested Actions:</h4>
                    <ul className="space-y-2">
                      {aiInsights.suggested_actions?.slice(0, 2).map((action, idx) => (
                        <li key={idx} className="text-xs text-light-body dark:text-dark-body flex items-start gap-2">
                          <span className="text-light-primary dark:text-dark-primary mt-1">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            <InsightCard {...data.dailyInsight} icon={<FiZap />} itemVariants={itemVariants} />

            <motion.div variants={itemVariants}>
              <MoodTracker mood={mood} setMood={setMood} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ChartCard title="Consistency" icon={FiCalendar}>
                <HeatmapCalendar data={data.consistency} />
              </ChartCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SuggestionCard title="Suggested Activities" items={data.suggestions.activities} />
            </motion.div>

            {/* Quick Recommendations */}
            {recommendations && (
              <motion.div variants={itemVariants}>
                <GlassCard className="p-4">
                  <h4 className="text-sm font-semibold text-light-headings dark:text-dark-headings mb-3 flex items-center gap-2">
                    <FiTrendingUp className="text-light-primary dark:text-dark-primary" />
                    Weekly Goals
                  </h4>
                  <ul className="space-y-2 text-xs text-light-body dark:text-dark-body">
                    {recommendations.weekly_goals?.slice(0, 4).map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-light-primary dark:text-dark-primary mt-0.5">→</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
