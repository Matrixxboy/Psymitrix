import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const usePalette = () => {
  const read = () => {
    const s = getComputedStyle(document.documentElement);
    return {
      primary: s.getPropertyValue('--color-primary').trim(),
      text: s.getPropertyValue('--color-text').trim(),
      textSecondary: s.getPropertyValue('--color-text-secondary').trim(),
      card: s.getPropertyValue('--color-card').trim(),
      accent: s.getPropertyValue('--color-accent').trim(),
    };
  };
  const [pal, setPal] = useState(read());
  useEffect(() => {
    const onTheme = () => setPal(read());
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener?.('change', onTheme);
    window.addEventListener('storage', onTheme);
    const observer = new MutationObserver(onTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      mql.removeEventListener?.('change', onTheme);
      window.removeEventListener('storage', onTheme);
      observer.disconnect();
    };
  }, []);
  return pal;
};

const LineChart = ({ labels, values, title = 'Progress' }) => {
  const pal = usePalette();

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: pal.primary,
        backgroundColor: `${pal.primary}33`,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  }), [labels, values, pal, title]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: pal.card,
        titleColor: pal.text,
        bodyColor: pal.text,
        borderColor: pal.primary,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: `${pal.textSecondary}22` },
        ticks: { color: pal.textSecondary },
      },
      y: {
        grid: { color: `${pal.textSecondary}22` },
        ticks: { color: pal.textSecondary },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  }), [pal]);

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
