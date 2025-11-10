import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiActivity,
  FiCheckSquare,
  FiAward,
  FiTrendingUp,
  FiMoon,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { getAchievements } from '../../api/achievements';
import { fetchUserProfile as getUser } from '../../api/auth'; // Assuming a getUser function exists in auth.js
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Components
import LineChart from '../../components/charts/LineChart';
import RadarChart from '../../components/charts/RadarChart';
import DonutChart from '../../components/charts/DonutChart';
import Achievements from './Achievements';
import DashboardSkeleton from '../Dashboard/sections/DashboardSkeleton';
import ChartCard from '../Dashboard/ChartCard';
import GlassCard from '../../components/ui/GlassCard';

// Utils
import {
  processMoodTrendsData,
  calculateWellnessBalance,
  calculateActivityBreakdown,
  getMoodScore,
  filterDataByTimeframe,
} from '../../utils/dataProcessing';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/* -------------------------------------------------------------------------- */
/*                                SMALL COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const TimeframeButton = ({ label, value, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm ${selected
        ? 'bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white shadow-lg'
        : 'bg-light-secondary/10 dark:bg-dark-secondary/10 text-light-headings dark:text-dark-headings hover:bg-light-secondary/20 dark:hover:bg-dark-secondary/20'
      }`}
  >
    {label}
  </button>
);

const StatCard = ({ title, value, icon: Icon, subtitle }) => (
  <GlassCard className="p-5 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <h5 className="text-sm font-semibold text-light-headings dark:text-dark-headings">
        {title}
      </h5>
      <Icon className="text-light-primary dark:text-dark-primary text-xl" />
    </div>
    <div className="mt-3">
      <p className="text-3xl font-bold text-light-headings dark:text-dark-headings">{value || 'N/A'}</p>
      {subtitle && (
        <p className="text-xs text-light-body/70 dark:text-dark-body/70 mt-1">{subtitle}</p>
      )}
    </div>
  </GlassCard>
);

/* -------------------------------------------------------------------------- */
/*                                 MAIN PAGE                                  */
/* -------------------------------------------------------------------------- */

const ProgressPage = () => {
  const { user, setUser } = useAuth(); // Get setUser from useAuth
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [achievements, setAchievements] = useState([]);
  const [sleepDataForChart, setSleepDataForChart] = useState({ labels: [], datasets: [] });

  const wellnessMetrics = user?.mental_health_profile?.wellness_metrics || [];

  useEffect(() => {
      // Prepare data for chart
      const sortedMetrics = [...wellnessMetrics]
          .filter(metric => metric.sleep_hours !== undefined && metric.sleep_hours !== null)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

      const labels = sortedMetrics.map(metric => new Date(metric.date).toLocaleDateString());
      const data = sortedMetrics.map(metric => metric.sleep_hours);

      setSleepDataForChart({
          labels,
          datasets: [
              {
                  label: 'Sleep Hours',
                  data,
                  borderColor: 'rgba(153, 102, 255, 1)',
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                  fill: true,
                  tension: 0.4,
              },
          ],
      });
  }, [wellnessMetrics]);

  const sleepChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { position: 'top', labels: { color: 'rgb(156 163 175)' } },
          title: {
              display: true,
              text: 'Sleep Hours Over Time',
              color: 'rgb(229 231 235)',
          },
      },
      scales: {
          x: {
              ticks: { color: 'rgb(156 163 175)' },
              grid: { color: 'rgba(107, 114, 128, 0.2)' },
          },
          y: {
              ticks: { color: 'rgb(156 163 175)' },
              grid: { color: 'rgba(107, 114, 128, 0.2)' },
          },
      },
  };

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getUser(); // Fetch updated user data
      setUser(response.data.data); // Update user in AuthProvider
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const fetchedAchievements = await getAchievements();
        setAchievements(fetchedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  useEffect(() => {
    if (!user) return;

    try {
      const moodTrend = processMoodTrendsData(user.mood_trends || [], timeframe);
      const activityBreakdown = calculateActivityBreakdown(user);
      const wellnessBalance = calculateWellnessBalance(user);

      const filteredMoods = filterDataByTimeframe(user.mood_trends || [], timeframe);
      const avgMoodScore =
        filteredMoods.length > 0
          ? (
            filteredMoods.reduce((sum, m) => sum + getMoodScore(m.mood), 0) /
            filteredMoods.length
          ).toFixed(1)
          : 'N/A';

      setData({
        moodTrend,
        activityBreakdown,
        wellnessBalance,
        avgMoodScore,
        moodEntries: filteredMoods.length,
      });
    } catch (error) {
      console.error('Error processing progress data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, timeframe]);

  if (loading || !data) return <DashboardSkeleton />;

  /* ---------------------------- Animations ---------------------------- */
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /* -------------------------------------------------------------------------- */
  /*                                  RENDER UI                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen p-6 md:p-10 text-light-body dark:text-dark-body mt-[60px]">
      <main className="max-w-7xl mx-auto">

        {/* ========================== HEADER ========================== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-light-headings dark:text-dark-headings tracking-tight">
            Your Growth Journey
          </h1>
          <p className="mt-3 text-md text-light-body/80 dark:text-dark-body/80">
            Visualize your emotional and wellness evolution through time.
          </p>
        </motion.div>

        {/* ====================== TIMEFRAME FILTER ====================== */}
        <motion.div
          className="flex justify-center mb-10 gap-4 flex-wrap"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {['week', 'month', 'year'].map((tf) => (
            <TimeframeButton
              key={tf}
              label={tf.charAt(0).toUpperCase() + tf.slice(1)}
              value={tf}
              selected={timeframe === tf}
              onClick={() => setTimeframe(tf)}
            />
          ))}
        </motion.div>

        {/* ====================== SUMMARY STATS ====================== */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <StatCard
            title="Average Mood"
            value={data.avgMoodScore}
            icon={FiTrendingUp}
            subtitle={`${data.moodEntries} entries`}
          />
          <StatCard
            title="Current Streak"
            value={`${user?.streak || 0} days`}
            icon={FiTrendingUp}
            subtitle={`Best: ${user?.longest_streak || 0}`}
          />
          <StatCard
            title="Assessments"
            value={user?.mental_health_profile?.assessment_results?.length || 0}
            icon={FiCheckSquare}
            subtitle="Total completed"
          />
          <StatCard
            title="Achievements"
            value={achievements.length}
            icon={FiAward}
            subtitle="Unlocked"
          />
        </motion.div>
        <div className='grid grid-rows-5 lg:grid-rows-3'>
          {/* ====================== MAIN ANALYTICS ====================== */}
          <div className="row-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  gap-8 mb-12">
            {/* Mood Trend */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <ChartCard
                title={`Mood Trend (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`}
                icon={FiBarChart2}
              >
                <div className="h-80">
                  {data.moodTrend.values.length > 0 ? (
                    <LineChart {...data.moodTrend} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-light-body/60 dark:text-dark-body/60">
                      No mood data for this period.
                    </div>
                  )}
                </div>
              </ChartCard>
            </motion.div>


            {/* ====================== SLEEP TRACKER ====================== */}

            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <ChartCard
                title="Log Daily Sleep"
                icon={FiMoon}
              >
                <div className="h-80">
                  {sleepDataForChart.labels.length > 0 ? (
                      <Line data={sleepDataForChart} options={sleepChartOptions} />
                  ) : (
                      <div className="flex items-center justify-center h-full text-light-body/60 dark:text-dark-body/60">
                          Not enough data to display chart.
                      </div>
                  )}
                </div>
              </ChartCard>
            </motion.div>

           
          </div>

          {/* ====================== BOTTOM SECTION ====================== */}
          
          <div className="row-span-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Wellness Radar */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <ChartCard title="Wellness Balance" icon={FiActivity}>
                <div className="h-80">
                  <RadarChart {...data.wellnessBalance} />
                </div>
              </ChartCard>
            </motion.div>
            {/* Activity Breakdown */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <ChartCard title="Activity Breakdown" icon={FiActivity}>
                <div className="h-80 flex items-center justify-center">
                  {user?.games?.length > 0 ? (
                    <DonutChart
                      value={data.activityBreakdown.value}
                      label={data.activityBreakdown.label}
                    />
                  ) : (
                    <div className="text-center text-light-body/60 dark:text-dark-body/60">
                      <p className="text-sm">No activity data yet</p>
                      <p className="text-xs mt-1">
                        Play games to see your activity breakdown.
                      </p>
                    </div>
                  )}
                </div>
              </ChartCard>
            </motion.div>
          </div>

          <div className='row-span-1 grid grid-cols-1 gap-8'>
                  {/* Achievements */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <ChartCard title="Recent Achievements" icon={FiAward}>
                {achievements.length > 0 ? (
                  <Achievements items={achievements} />
                ) : (
                  <div className="flex items-center justify-center h-40 text-light-body/60 dark:text-dark-body/60">
                    No achievements unlocked yet. Keep going!
                  </div>
                )}
              </ChartCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
