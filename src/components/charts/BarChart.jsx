import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '../../providers/ThemeProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const readPaletteFromDOM = (theme) => {
  if (typeof window === 'undefined') {
    return { primary: '#A5645A', accent: '#D87D62', body: '#4A433F', background: '#F4F4F2' };
  }
  const s = getComputedStyle(document.documentElement);
  const prefix = theme === 'dark' ? '--dark-' : '--light-';
  return {
    primary: s.getPropertyValue(`${prefix}primary`).trim(),
    accent: s.getPropertyValue(`${prefix}accent`).trim(),
    body: s.getPropertyValue(`${prefix}body`).trim(),
    background: s.getPropertyValue(`${prefix}background`).trim(),
  };
};

const usePalette = () => {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => readPaletteFromDOM(theme));
  useEffect(() => { setPalette(readPaletteFromDOM(theme)); }, [theme]);
  return palette;
};

const BarChart = ({ labels = [], values = [], title = '' }) => {
  const pal = usePalette();

  const data = useMemo(() => ({
    labels,
    datasets: [{
      label: title,
      data: values,
      backgroundColor: labels.map((_, i) => i % 2 === 0 ? `${pal.primary}BB` : `${pal.accent}BB`),
      borderRadius: 10,
      borderWidth: 0,
      hoverBackgroundColor: labels.map((_, i) => i % 2 === 0 ? pal.primary : pal.accent),
    }],
  }), [labels, values, pal, title]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: pal.background,
        bodyColor: pal.body,
        titleColor: pal.body,
        borderColor: pal.body,
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: pal.body } },
      y: { grid: { color: `${pal.body}22` }, ticks: { color: pal.body }, beginAtZero: true },
    },
  }), [pal]);

  return <div className="w-full h-full"><Bar data={data} options={options} /></div>;
};

export default BarChart;
