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

const getSampleData = () => {
  const generateHeatmapData = (days, maxVal) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString(),
        value: Math.random() > 0.3 ? Math.random() * maxVal : 0,
      };
    });
  };

  return {
    moodTrend: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [6, 7, 5, 8, 7, 9, 8],
    },
    activityBreakdown: { value: 65 },
    wellnessBalance: {
      labels: ['Stress', 'Anxiety', 'Depression'],
      datasets: [{ label: 'Current', data: [4, 6, 7] }],
    },
    consistency: generateHeatmapData(35, 1),
    dailyInsight: {
      title: "Today's Prompt",
      text: "What is one small thing you can do today that would bring you a moment of joy?",
    },
    suggestions: {
      activities: [
        { title: 'Breathing Exercise', details: '5 min' },
        { title: 'Mindful Walk', details: '15 min' },
      ],
      tests: [{ title: 'Anxiety Score (GAD-7)', details: 'Quick check-in' }],
    },
  };
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(getSampleData());
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
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
    <div className="min-h-screen text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8">
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
              <motion.div variants={itemVariants}>
                <ChartCard title="Activity Breakdown" icon={FiCheckSquare}>
                  <div className="h-64"><DonutChart {...data.activityBreakdown} /></div>
                </ChartCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ChartCard title="Wellness Balance" icon={FiActivity}>
                  <div className="h-64"><RadarChart {...data.wellnessBalance} /></div>
                </ChartCard>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            <motion.div variants={itemVariants}>
              <MoodTracker mood={mood} setMood={setMood} />
            </motion.div>
            
            <InsightCard {...data.dailyInsight} icon={<FiZap />} itemVariants={itemVariants} />
            
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