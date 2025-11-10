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

const getMoodScore = (mood) => {
  const moodScores = {
    'excited': 10,
    'happy': 8,
    'calm': 7,
    'neutral': 5,
    'sad': 3,
    'angry': 2
  };
  return moodScores[mood] || 5;
};

const filterDataByTimeframe = (data, timeframe = 'month') => {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  let cutoffDate;
  
  if (timeframe === 'week') {
    cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeframe === 'year') {
    cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  } else {
    cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return data.filter(item => {
    try {
      const itemDate = new Date(item.created_at);
      return itemDate >= cutoffDate;
    } catch {
      return true;
    }
  });
};

const processMoodTrendsData = (moodTrends, timeframe = 'month') => {
  const filteredMoods = filterDataByTimeframe(moodTrends, timeframe);
  
  if (filteredMoods.length === 0) {
    return { labels: [], values: [] };
  }

  const labels = filteredMoods.map(trend => {
    const date = new Date(trend.created_at);
    if (timeframe === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeframe === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  });

  const values = filteredMoods.map(trend => getMoodScore(trend.mood));

  return { labels, values };
};

const calculateWellnessBalance = (user) => {
  if (!user?.mental_health_profile?.assessment_results || user.mental_health_profile.assessment_results.length === 0) {
    return {
      labels: ["Stress", "Sleep", "Mood", "Energy", "Focus"],
      datasets: [
        {
          label: "This Week",
          data: [5, 5, 5, 5, 5]
        },
        {
          label: "Last Week",
          data: [5, 5, 5, 5, 5]
        }
      ]
    };
  }

  // Calculate based on assessment data
  const recentAssessments = filterDataByTimeframe(user.mental_health_profile.assessment_results, 'month');
  
  let stressScore = 5;
  let moodScore = 5;
  let focusScore = 5;

  if (recentAssessments.length > 0) {
    const latestGAD7 = recentAssessments.find(a => a.assessment_type === 'GAD-7');
    const latestPHQ9 = recentAssessments.find(a => a.assessment_type === 'PHQ-9');

    // GAD7 (anxiety/stress) - convert score to 1-10 scale (lower is better)
    if (latestGAD7) {
      stressScore = 10 - Math.min(latestGAD7.score, 9);
    }

    // PHQ9 - affects mood score
    if (latestPHQ9) {
      moodScore = 10 - Math.min(latestPHQ9.score, 9);
    }

    focusScore = moodScore; // Correlation between mood and focus
  }

  // Get sleep and activity from wellness metrics
  let sleepScore = 5;
  let energyScore = 5;

  if (user.mental_health_profile?.wellness_metrics && user.mental_health_profile.wellness_metrics.length > 0) {
    const latestMetric = user.mental_health_profile.wellness_metrics[user.mental_health_profile.wellness_metrics.length - 1];
    
    if (latestMetric.sleep_hours) {
      // 7-9 hours is optimal (score 10)
      sleepScore = Math.max(1, Math.min(10, Math.round((latestMetric.sleep_hours / 8) * 10)));
    }

    if (latestMetric.daily_wellness_score) {
      energyScore = Math.round((latestMetric.daily_wellness_score || 0) / 10);
    }
  }

  return {
    labels: ["Stress", "Sleep", "Mood", "Energy", "Focus"],
    datasets: [
      {
        label: "Current",
        data: [10 - stressScore, sleepScore, moodScore, energyScore, focusScore]
      },
      {
        label: "Average",
        data: [5, 5, 5, 5, 5]
      }
    ]
  };
};

const calculateActivityBreakdown = (user) => {
  if (!user?.games || user.games.length === 0) {
    return {
      value: 0,
      label: "No activities yet"
    };
  }

  const totalGameTime = user.games.reduce((sum, game) => sum + (game.total_time_played || 0), 0);
  const weeklyGoal = 150; // minutes per week
  const percentage = Math.min(100, Math.round((totalGameTime / weeklyGoal) * 100));

  return {
    value: percentage,
    label: `${percentage}% of weekly goal (${totalGameTime}min)`
  };
};

const generateConsistencyData = (moodTrends) => {
  // Generate heatmap data from mood trends
  if (!moodTrends || moodTrends.length === 0) {
    return [];
  }

  const data = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const moodForDay = moodTrends.find(m => {
      const moodDate = new Date(m.created_at).toISOString().split('T')[0];
      return moodDate === dateStr;
    });

    // If there's a mood entry, value is 0.8 (tracked), otherwise 0.3 (not tracked)
    data.push({
      date: dateStr,
      value: moodForDay ? 0.8 : 0.3
    });
  }

  return data;
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
  const [mood, setMood] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Process all data from user object
          const moodTrend = processMoodTrendsData(user.mood_trends || [], timeframe);
          const activityBreakdown = calculateActivityBreakdown(user);
          const wellnessBalance = calculateWellnessBalance(user);
          const consistency = generateConsistencyData(user.mood_trends || []);

          // Calculate average mood
          const filteredMoods = filterDataByTimeframe(user.mood_trends || [], timeframe);
          const avgMoodScore = filteredMoods.length > 0
            ? (filteredMoods.reduce((sum, m) => sum + getMoodScore(m.mood), 0) / filteredMoods.length).toFixed(1)
            : 'N/A';

          const mapped = {
            moodTrend: moodTrend,
            activityBreakdown: activityBreakdown,
            wellnessBalance: wellnessBalance,
            consistency: consistency,
            avgMoodScore: avgMoodScore,
            moodEntries: filteredMoods.length,
            dailyInsight: {
              title: "Mental Health Status",
              text: filteredMoods.length > 0
                ? `You've logged ${filteredMoods.length} mood entries. Your average mood is ${avgMoodScore}/10. Keep tracking for better insights!`
                : "Start tracking your mood to see personalized insights"
            },
            suggestions: {
              activities: [
                { title: "Breathing Exercise", details: "5 min" },
                { title: "Mindful Walk", details: "15 min" }
              ]
            }
          };

          setData(mapped);

          // Fetch AI insights
          try {
            const insightsResponse = await axios.get(
              `/api/v1/ai_analytics/insights?timeframe=${timeframe}`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
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
              { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
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

  const handleMoodSaved = (newMood) => {
    // Refresh data after mood is saved
    if (user) {
      setMood('');
    }
  };

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
                  value={data.avgMoodScore}
                  icon={FiZap}
                  subtitle={`${data.moodEntries} entries`}
                />
                <MetricCard 
                  title="Current Streak"
                  value={`${user?.streak || 0} days`}
                  icon={FiTrendingUp}
                  subtitle={`Best: ${user?.longest_streak || 0}`}
                />
                <MetricCard 
                  title="Assessments"
                  value={user?.mental_health_profile?.assessment_results?.length || 0}
                  icon={FiCheckSquare}
                  subtitle="Total completed"
                />
              </div>
            </motion.div>

            {/* Mood Trend Chart */}
            <motion.div variants={itemVariants}>
              <ChartCard title={`Mood Trend (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`} icon={FiBarChart2}>
                <div className="h-64">
                  {data.moodTrend.values.length > 0 ? (
                    <LineChart {...data.moodTrend} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-light-body/60 dark:text-dark-body/60">
                      No mood data yet. Start tracking your mood!
                    </div>
                  )}
                </div>
              </ChartCard>
            </motion.div>

            {/* Activity and Wellness Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="flex">
                <ChartCard title="Activity Breakdown" icon={FiActivity} className="w-full">
                  <div className="h-64 flex items-center justify-center">
                    {user?.games && user.games.length > 0 ? (
                      <DonutChart value={data.activityBreakdown.value} label={data.activityBreakdown.label} />
                    ) : (
                      <div className="text-center text-light-body/60 dark:text-dark-body/60">
                        <p className="text-sm">No activity data yet</p>
                        <p className="text-xs mt-1">Start games or activities to see breakdown</p>
                      </div>
                    )}
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
              <MoodTracker mood={mood} setMood={setMood} onMoodSaved={handleMoodSaved} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ChartCard title="Consistency" icon={FiCalendar}>
                {data.consistency.length > 0 ? (
                  <HeatmapCalendar data={data.consistency} />
                ) : (
                  <div className="flex items-center justify-center h-full text-light-body/60 dark:text-dark-body/60">
                    No data yet
                  </div>
                )}
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
