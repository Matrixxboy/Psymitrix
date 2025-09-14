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
import { getAppData } from '../../api/data';

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
    let mounted = true;
    getAppData().then((app) => {
      if (!mounted) return;
      const mapped = {
        moodTrend: app.charts.moodTrend,
        activityBreakdown: { value: app.charts.completion.value, label: app.charts.completion.label },
        wellnessBalance: app.charts.radar,
        consistency: app.charts.heatmap,
        dailyInsight: app.dashboard?.dailyInsight,
        suggestions: app.dashboard?.suggestions || { activities: [], tests: [] },
      };
      setData(mapped);
      setLoading(false);
    });
    return () => { mounted = false; };
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
