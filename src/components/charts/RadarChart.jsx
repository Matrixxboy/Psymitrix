import React, { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const getVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const RadarChart = ({ labels, values, title = 'Balance' }) => {
  const pal = useMemo(() => ({
    primary: getVar('--color-primary'),
    text: getVar('--color-text'),
    textSecondary: getVar('--color-text-secondary'),
    card: getVar('--color-card'),
    accent: getVar('--color-accent'),
  }), [getVar('--color-text')]);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: `${pal.accent}33`,
        borderColor: pal.accent,
        pointBackgroundColor: pal.accent,
        borderWidth: 2,
      },
    ],
  }), [labels, values, pal, title]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: pal.card, bodyColor: pal.text, borderColor: pal.accent, borderWidth: 1 } },
    scales: {
      r: {
        angleLines: { color: `${pal.textSecondary}22` },
        grid: { color: `${pal.textSecondary}22` },
        pointLabels: { color: pal.textSecondary },
        ticks: { display: false, maxTicksLimit: 5, beginAtZero: true, suggestedMax: 10 },
      },
    },
  }), [pal]);

  return <div className="h-64"><Radar data={data} options={options} /></div>;
};

export default RadarChart;
