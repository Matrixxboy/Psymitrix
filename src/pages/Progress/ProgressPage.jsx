import React, { useState, useEffect, useMemo } from 'react';
import LineChart from '../../components/charts/LineChart';
import RadarChart from '../../components/charts/RadarChart';
import BarChart from '../../components/charts/BarChart';
import GlassCard from '../../components/ui/GlassCard';
import { getAppData } from '../../api/data';

// Minimal inline icons
const FiTrendingUp = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const FiAward = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
);
const FiActivity = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const FiCheckSquare = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);
const FiPieChart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
);
const FiBarChart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);
const FiStar = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const ChartCard = ({ title, icon: Icon, children }) => (
  <GlassCard>
    <div className="flex items-center gap-3 mb-4">
      <Icon className="text-xl text-light-primary dark:text-dark-primary" />
      <h3 className="text-lg font-semibold text-light-headings dark:text-dark-headings">{title}</h3>
    </div>
    {children}
  </GlassCard>
);

const Achievements = ({ items = [] }) => (
  <div className="space-y-4">
    {items.slice(0, 3).map((ach, i) => (
      <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${ach.achieved ? 'bg-white/10' : 'bg-white/5 opacity-60'}`}>
        <FiStar className={`${ach.achieved ? 'text-yellow-400' : 'text-light-body dark:text-dark-body'} text-xl`} />
        <span className={`font-medium ${ach.achieved ? 'text-light-headings dark:text-dark-headings' : 'text-light-body dark:text-dark-body'}`}>{ach.title}</span>
      </div>
    ))}
    <button className="text-center w-full mt-2 text-sm text-light-primary dark:text-dark-primary font-semibold hover:underline">
      View All
    </button>
  </div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <GlassCard className="flex items-center gap-4">
    <div className="p-3 bg-white/10 rounded-full">
      <Icon className="text-2xl text-light-primary dark:text-dark-primary" />
    </div>
    <div>
      <p className="text-2xl font-bold text-light-headings dark:text-dark-headings">{value}</p>
      <p className="text-sm text-light-body dark:text-dark-body">{label}</p>
    </div>
  </GlassCard>
);

const ProgressPage = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAppData().then((app) => { if (mounted) setProgress(app.progress); });
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => progress?.stats || { avgMood: 0, habitRate: 0, daysStreak: 0, achievementsCount: 0 }, [progress]);
  const chartData = useMemo(() => progress?.[timeframe] || { moodTrend:{}, wellnessBalance:{}, habitConsistency:{}, activityBreakdown:{} }, [progress, timeframe]);

  const TimeframeButton = ({ period, label }) => (
    <button
      onClick={() => setTimeframe(period)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300
        ${timeframe === period
          ? 'bg-light-primary dark:bg-dark-primary text-white shadow-lg'
          : 'bg-white/10 hover:bg-white/20 text-light-headings dark:text-dark-headings'}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-light-headings dark:text-dark-headings">Your Growth Journey</h1>
          <p className="mt-2 text-md text-light-body dark:text-dark-body">Visualize your progress and celebrate your milestones.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FiTrendingUp} value={stats.avgMood} label="Avg. Mood" />
          <StatCard icon={FiCheckSquare} value={`${stats.habitRate}%`} label="Habit Rate" />
          <StatCard icon={FiStar} value={stats.daysStreak} label="Days Streak" />
          <StatCard icon={FiAward} value={stats.achievementsCount} label="Achievements" />
        </div>

        <div className="mb-8 flex justify-center gap-3">
          <TimeframeButton period="week" label="Week" />
          <TimeframeButton period="month" label="Month" />
          <TimeframeButton period="year" label="Year" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Mood Trend" icon={FiTrendingUp}>
            <div className="h-80"><LineChart {...(chartData.moodTrend || {})} /></div>
          </ChartCard>

          <ChartCard title="Habit Consistency (Days)" icon={FiBarChart}>
            <div className="h-80"><BarChart {...(chartData.habitConsistency || {})} /></div>
          </ChartCard>

          <ChartCard title="Wellness Balance" icon={FiActivity}>
            <div className="h-80"><RadarChart labels={chartData.wellnessBalance?.labels || []} datasets={[{ label: 'Wellness', data: chartData.wellnessBalance?.values || [] }]} /></div>
          </ChartCard>

          <ChartCard title="Activity Breakdown (Mins)" icon={FiPieChart}>
            <div className="h-80"><BarChart {...(chartData.activityBreakdown || {})} title="Minutes" /></div>
          </ChartCard>

          <div className="lg:col-span-2">
            <ChartCard title="Recent Achievements" icon={FiAward}>
              <Achievements items={progress?.achievements || []} />
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
