import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiBarChart2, FiActivity, FiCheckSquare, FiCalendar, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

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

const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
    ? "Good afternoon"
    : "Good evening";
};

const processMoodTrends = (moodTrends) => {
  if (!moodTrends || moodTrends.length === 0) {
    return { labels: [], values: [] };
  }

  const labels = moodTrends.map(trend => {
    const date = new Date(trend.created_at);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const moodScores = {
    'excited': 10,
    'happy': 8,
    'calm': 7,
    'neutral': 5,
    'sad': 3,
    'angry': 2
  };

  const values = moodTrends.map(trend => moodScores[trend.mood]);

  return { labels, values };
};


const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState(3);

  useEffect(() => {
    if (user) {
      const moodTrend = processMoodTrends(user.mood_trends);
      const mapped = {
        moodTrend: moodTrend,
        activityBreakdown: { value: 68, label: "Weekly Goal" },
        wellnessBalance: {labels:["Stress","Sleep","Mood","Energy","Focus"],datasets:[{"label":"This Week","data":[6,5,7,6,5]},{"label":"Last Week","data":[5,6,6,5,6]}]},
        consistency: [{"date":"2025-01-01","value":0.7},{"date":"2025-01-02","value":0.3},{"date":"2025-01-03","value":0.9}],
        dailyInsight: {"title":"Daily mental check","text":"According to your recent interactions, your mood has been stable with slight improvements in focus and energy levels. Keep up the good work!"},
        suggestions: {"activities":[{"title":"Breathing Exercise","details":"5 min"},{"title":"Mindful Walk","details":"15 min"}],"tests":[{"title":"Anxiety Score (GAD-7) gratifying","details":"Quick check-in"}]},
      };
      setData(mapped);
      setLoading(false);
    }
  }, [user]);

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
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <motion.div variants={itemVariants}><PrimaryCTA /></motion.div>
            <motion.div variants={itemVariants}>
              <ChartCard title="Mood Trend" icon={FiBarChart2}>
                <div className="h-64"><LineChart {...data.moodTrend} /></div>
              </ChartCard>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="flex ">
                <ChartCard title="Activity Breakdown" icon={FiCheckSquare} className="w-full">
                  <div className="h-72 flex items-center justify-center">
                    <DonutChart {...data.activityBreakdown} />
                  </div>
                </ChartCard>
              </motion.div>

              <motion.div variants={itemVariants} className="flex">
                <ChartCard title="Wellness Balance" icon={FiActivity} className="w-full">
                  <div className="h-72 flex items-center justify-center">
                    <RadarChart {...data.wellnessBalance} />
                  </div>
                </ChartCard>
              </motion.div>
            </div>
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
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
