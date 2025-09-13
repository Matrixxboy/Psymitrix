import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const getVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const DonutChart = ({ value = 72, label = 'Completion' }) => {
  const pal = useMemo(() => ({
    primary: getVar('--color-primary'),
    secondary: getVar('--color-secondary'),
    text: getVar('--color-text'),
    card: getVar('--color-card'),
  }), []);

  const data = useMemo(() => ({
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [pal.primary, `${pal.primary}20`],
        borderWidth: 0,
      },
    ],
  }), [pal, value, label]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: { backgroundColor: pal.card, bodyColor: pal.text } },
  }), [pal]);

  return (
    <div className="h-64 relative">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-[var(--color-text)]">{value}%</div>
        <div className="text-xs text-[var(--color-text-secondary)]">{label}</div>
      </div>
    </div>
  );
};

export default DonutChart;
