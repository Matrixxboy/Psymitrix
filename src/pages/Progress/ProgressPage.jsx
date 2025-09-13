import React, { useState, useEffect, useMemo } from 'react';
import { Line, Radar, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title
);

// --- SVG Icon Components (Replaced react-icons) ---
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


// --- Mock Theme Provider Hook ---
// In a real app, this would come from your ThemeProvider context.
const useTheme = () => {
  const [theme] = useState('dark'); // Default to 'dark' for demonstration
  return { theme };
};

// --- Reusable Theming Hook for Charts ---
const readPaletteFromDOM = (theme) => {
  // Mock palette for this standalone component.
  // In your actual app, this would read your CSS variables.
  if (theme === 'dark') {
    return {
      primary: '#8B5CF6', // violet-500
      secondary: '#34D399', // emerald-400
      accent: '#F472B6', // pink-400
      headings: '#F3F4F6', // gray-100
      body: '#D1D5DB', // gray-300
      background: '#1F2937', // gray-800
      cardBg: 'rgba(31, 41, 55, 0.5)',
      gridColor: 'rgba(255, 255, 255, 0.1)',
    };
  }
  return {
    primary: '#6366F1', // indigo-500
    secondary: '#10B981', // emerald-500
    accent: '#EC4899', // pink-500
    headings: '#111827', // gray-900
    body: '#4B5563', // gray-600
    background: '#F9FAFB', // gray-50
    cardBg: 'rgba(255, 255, 255, 0.5)',
    gridColor: 'rgba(0, 0, 0, 0.1)',
  };
};

const usePalette = () => {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => readPaletteFromDOM(theme));

  useEffect(() => {
    setPalette(readPaletteFromDOM(theme));
  }, [theme]);

  return palette;
};

// --- Reusable Chart Components ---

const LineChart = ({ labels, values, title }) => {
  const pal = usePalette();
  const data = {
    labels,
    datasets: [{
      label: title,
      data: values,
      fill: true,
      backgroundColor: `${pal.primary}33`,
      borderColor: pal.primary,
      tension: 0.4,
      pointBackgroundColor: pal.primary,
      pointBorderColor: pal.background,
    }],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: pal.gridColor }, ticks: { color: pal.body } },
      y: { grid: { color: pal.gridColor }, ticks: { color: pal.body }, beginAtZero: true },
    },
  };
  return <Line data={data} options={options} />;
};

const RadarChart = ({ labels, values }) => {
  const pal = usePalette();
  const data = {
    labels,
    datasets: [{
      label: 'Wellness Score',
      data: values,
      backgroundColor: `${pal.secondary}33`,
      borderColor: pal.secondary,
      pointBackgroundColor: pal.secondary,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: pal.secondary,
    }],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        angleLines: { color: pal.gridColor },
        grid: { color: pal.gridColor },
        pointLabels: { color: pal.headings, font: { size: 13 } },
        ticks: { color: pal.body, backdropColor: 'transparent' },
        suggestedMin: 0, suggestedMax: 10
      },
    },
  };
  return <Radar data={data} options={options} />;
};

const BarChart = ({ labels, values, title }) => {
  const pal = usePalette();
  const data = {
    labels,
    datasets: [{
      label: title,
      data: values,
      backgroundColor: labels.map((_, i) => i % 2 === 0 ? pal.primary : pal.accent),
      borderColor: pal.background,
      borderWidth: 2,
      borderRadius: 8,
    }],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: pal.body } },
      y: { grid: { color: pal.gridColor }, ticks: { color: pal.body }, beginAtZero: true },
    },
  };
  return <Bar data={data} options={options} />;
};

const DoughnutChart = ({ labels, values, title }) => {
  const pal = usePalette();
  const data = {
    labels,
    datasets: [{
      label: title,
      data: values,
      backgroundColor: [pal.primary, pal.secondary, pal.accent, '#FBBF24'],
      borderColor: pal.background,
      borderWidth: 4,
      hoverOffset: 8,
    }],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: pal.body, boxWidth: 12, padding: 20 }
      }
    },
    cutout: '65%',
  };
  return <Doughnut data={data} options={options} />;
};


// --- UI Components (Mocks) ---
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-black/20 rounded-2xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
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

const Achievements = () => {
  const pal = usePalette();
  const allAchievements = useMemo(() => [
    { title: 'First Session', achieved: Math.random() > 0.3 },
    { title: '7-Day Streak', achieved: Math.random() > 0.5 },
    { title: 'Mindful Master', achieved: Math.random() > 0.2 },
    { title: 'Assessment Complete', achieved: Math.random() > 0.7 },
    { title: 'Journal Entry', achieved: Math.random() > 0.4 },
    { title: 'Perfect Week', achieved: Math.random() > 0.6 },
  ], []);

  const displayedAchievements = allAchievements.slice(0, 3); // Show top 3 or so

  return (
    <div className="space-y-4">
      {displayedAchievements.map((ach, i) => (
        <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${ach.achieved ? 'bg-white/10' : 'bg-white/5 opacity-60'}`}>
          <FiStar className={`${ach.achieved ? 'text-yellow-400' : pal.body} text-xl`} />
          <span className={`font-medium ${ach.achieved ? 'text-light-headings dark:text-dark-headings' : 'text-light-body dark:text-dark-body'}`}>{ach.title}</span>
        </div>
      ))}
      <button className="text-center w-full mt-2 text-sm text-light-primary dark:text-dark-primary font-semibold hover:underline">
        View All
      </button>
    </div>
  );
};

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


// --- Main Progress Page Component ---
const ProgressPage = () => {
  const [timeframe, setTimeframe] = useState('month');

  const generateRandomStat = (min, max, decimalPlaces = 0) => {
    const rand = Math.random() * (max - min) + min;
    return parseFloat(rand.toFixed(decimalPlaces));
  };

  const stats = useMemo(() => ({
    avgMood: generateRandomStat(6, 9, 1),
    habitRate: generateRandomStat(60, 95),
    daysStreak: Math.floor(generateRandomStat(7, 60)),
    achievementsCount: Math.floor(generateRandomStat(3, 15)),
  }), [timeframe]); // Recalculate stats when timeframe changes

  const getChartData = (timeframe) => {
    const generateRandomData = (length, min, max) => Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);

    switch (timeframe) {
      case 'week':
        return {
          moodTrend: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: generateRandomData(7, 5, 9) },
          wellnessBalance: { labels: ['Stress', 'Anxiety', 'Sleep', 'Focus', 'Energy'], values: generateRandomData(5, 4, 9) },
          habitConsistency: { labels: ['Meditate', 'Journal', 'Exercise', 'Gratitude'], values: generateRandomData(4, 1, 7) },
          activityBreakdown: { labels: ['Guided', 'Silent', 'Walking', 'Breathing'], values: generateRandomData(4, 10, 40) }
        };
      case 'month':
        return {
          moodTrend: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: generateRandomData(4, 6, 8) },
          wellnessBalance: { labels: ['Stress', 'Anxiety', 'Sleep', 'Focus', 'Energy'], values: generateRandomData(5, 5, 8) },
          habitConsistency: { labels: ['Meditate', 'Journal', 'Exercise', 'Gratitude'], values: generateRandomData(4, 10, 25) },
          activityBreakdown: { labels: ['Guided', 'Silent', 'Walking', 'Breathing'], values: generateRandomData(4, 50, 150) }
        };
      case 'year':
        return {
          moodTrend: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], values: generateRandomData(12, 6, 9) },
          wellnessBalance: { labels: ['Stress', 'Anxiety', 'Sleep', 'Focus', 'Energy'], values: generateRandomData(5, 5, 7) },
          habitConsistency: { labels: ['Meditate', 'Journal', 'Exercise', 'Gratitude'], values: generateRandomData(4, 50, 200) },
          activityBreakdown: { labels: ['Guided', 'Silent', 'Walking', 'Breathing'], values: generateRandomData(4, 300, 800) }
        };
      default:
        return { moodTrend: {}, wellnessBalance: {}, habitConsistency: {}, activityBreakdown: {} };
    }
  };

  const chartData = getChartData(timeframe);

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
    <div className="min-h-screen bg-light-background dark:bg-gray-900 text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8 font-sans">
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
            <div className="h-80"><LineChart {...chartData.moodTrend} /></div>
          </ChartCard>

          <ChartCard title="Habit Consistency (Days)" icon={FiBarChart}>
            <div className="h-80"><BarChart {...chartData.habitConsistency} /></div>
          </ChartCard>

          <ChartCard title="Wellness Balance" icon={FiActivity}>
            <div className="h-80"><RadarChart {...chartData.wellnessBalance} /></div>
          </ChartCard>

          <ChartCard title="Activity Breakdown (Mins)" icon={FiPieChart}>
            <div className="h-80"><DoughnutChart {...chartData.activityBreakdown} /></div>
          </ChartCard>

          <div className="lg:col-span-2">
            <ChartCard title="Recent Achievements" icon={FiAward}>
              <Achievements />
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;

