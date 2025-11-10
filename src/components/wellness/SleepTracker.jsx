import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import { FiMoon, FiPlayCircle, FiStopCircle, FiClock, FiPlusCircle } from 'react-icons/fi';
import { addSleepData } from '../../api/wellness';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SleepTracker = ({ wellnessMetrics = [], onSleepDataAdded }) => {
  const [mode, setMode] = useState('hours'); // 'hours' | 'time' | 'timer'
  const [sleepHoursInput, setSleepHoursInput] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sleepDataForChart, setSleepDataForChart] = useState({ labels: [], datasets: [] });
  const [averageSleep, setAverageSleep] = useState(0);

  // Timer state
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Prepare data for chart
    const sortedMetrics = [...wellnessMetrics]
      .filter(metric => metric.sleep_hours !== undefined && metric.sleep_hours !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = sortedMetrics.map(metric => new Date(metric.date).toLocaleDateString());
    const data = sortedMetrics.map(metric => metric.sleep_hours);

    // Calculate average
    const avg =
      data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1) : 0;
    setAverageSleep(avg);

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

  // Timer functionality
  useEffect(() => {
    if (isSleeping) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - sleepStartTime);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSleeping, sleepStartTime]);

  const handleStartTimer = () => {
    setSleepStartTime(Date.now());
    setIsSleeping(true);
  };

  const handleStopTimer = async () => {
    setIsSleeping(false);
    const hoursSlept = elapsedTime / (1000 * 60 * 60);
    if (hoursSlept > 0) {
      await addSleepData(parseFloat(hoursSlept.toFixed(2)), new Date().toISOString());
      setElapsedTime(0);
      onSleepDataAdded();
    }
  };

  const calculateSleepDuration = () => {
    if (sleepTime && wakeTime) {
      const sleepDate = new Date(`1970-01-01T${sleepTime}:00`);
      const wakeDate = new Date(`1970-01-01T${wakeTime}:00`);
      let duration = (wakeDate - sleepDate) / (1000 * 60 * 60);
      if (duration < 0) duration += 24; // Crossed midnight
      setSleepHoursInput(duration.toFixed(2));
    }
  };

  const handleAddSleep = async () => {
    if (sleepHoursInput && selectedDate) {
      try {
        await addSleepData(parseFloat(sleepHoursInput), new Date(selectedDate).toISOString());
        setSleepHoursInput('');
        setSelectedDate('');
        setSleepTime('');
        setWakeTime('');
        onSleepDataAdded();
      } catch (error) {
        console.error('Failed to add sleep data:', error);
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: 'rgb(156 163 175)' } },
      title: {
        display: true,
        text: 'Sleep Hours Over Time',
        color: '',
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

  const formatElapsedTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-4 flex items-center">
        <FiMoon className="mr-2" /> Sleep Tracker
      </h3>

      {/* Average Sleep Display */}
      <div className="text-center mb-4">
        <h4 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
          {averageSleep} hrs
        </h4>
        <p className="text-sm text-light-body/60 dark:text-dark-body/60">Average Sleep</p>
      </div>

      {/* Mode Switch */}
      <div className="flex justify-center mb-4 space-x-2">
        {['hours', 'time', 'timer'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-lg text-sm ${
              mode === m
                ? 'bg-light-primary text-white dark:bg-dark-primary'
                : 'bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-body dark:text-dark-body'
            }`}
          >
            {m === 'hours' ? 'Enter Hours' : m === 'time' ? 'Sleep/Wake' : 'Timer'}
          </button>
        ))}
      </div>

      {/* Inputs by Mode */}
      {mode === 'hours' && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border text-light-body dark:text-dark-body"
          />
          <input
            type="number"
            step="0.1"
            min="0"
            max="24"
            placeholder="Hours slept"
            value={sleepHoursInput}
            onChange={(e) => setSleepHoursInput(e.target.value)}
            className="w-32 p-2 rounded-lg bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border text-light-body dark:text-dark-body"
          />
          <button
            onClick={handleAddSleep}
            className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors"
          >
            <FiPlusCircle size={22} />
          </button>
        </div>
      )}

      {mode === 'time' && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="time"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="p-2 rounded-lg bg-light-background dark:bg-dark-background border text-light-body dark:text-dark-body"
          />
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => {
              setWakeTime(e.target.value);
              calculateSleepDuration();
            }}
            className="p-2 rounded-lg bg-light-background dark:bg-dark-background border text-light-body dark:text-dark-body"
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 rounded-lg bg-light-background dark:bg-dark-background border text-light-body dark:text-dark-body"
          />
          <button
            onClick={handleAddSleep}
            className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors"
          >
            <FiPlusCircle size={22} />
          </button>
        </div>
      )}

      {mode === 'timer' && (
        <div className="text-center mb-4">
          {isSleeping ? (
            <>
              <p className="text-lg text-light-body dark:text-dark-body mb-2">
                Sleeping... {formatElapsedTime(elapsedTime)}
              </p>
              <button
                onClick={handleStopTimer}
                className="flex items-center justify-center mx-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <FiStopCircle className="mr-2" /> Stop Timer
              </button>
            </>
          ) : (
            <button
              onClick={handleStartTimer}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <FiPlayCircle className="mr-2" /> Start Sleep Timer
            </button>
          )}
        </div>
      )}

      {/* Past Entries */}
      <div className="mb-4">
        <h4 className="font-semibold text-light-headings dark:text-dark-headings mb-2">
          Past Sleep Entries:
        </h4>
        {wellnessMetrics
          .filter(m => m.sleep_hours)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7)
          .map((m, i) => (
            <div key={i} className="flex justify-between text-sm text-light-body dark:text-dark-body py-1">
              <span>{new Date(m.date).toLocaleDateString()}</span>
              <span>{m.sleep_hours} hrs</span>
            </div>
          ))}
      </div>

      {/* Full Chart */}
      <div className="mt-4 h-64">
        {sleepDataForChart.labels.length > 0 ? (
          <Line data={sleepDataForChart} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-light-body/60 dark:text-dark-body/60">
            Not enough data to display chart.
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default SleepTracker;
