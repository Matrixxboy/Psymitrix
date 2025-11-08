import React, { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../providers/ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Reads the current theme's CSS custom properties from the DOM.
 * @param {string} theme - The current theme ('light' or 'dark').
 * @returns {object} An object containing the theme's color palette.
 */
const readPaletteFromDOM = (theme) => {
  if (typeof window === 'undefined') {
    // Return a default palette for server-side rendering
    return {
      primary: '#A5645A', headings: '#4B2F2A', body: '#4A433F', background: '#F4F4F2'
    };
  }
  const s = getComputedStyle(document.documentElement);
  const prefix = theme === 'dark' ? '--dark-' : '--light-';
  return {
    primary: s.getPropertyValue(`${prefix}primary`).trim(),
    headings: s.getPropertyValue(`${prefix}headings`).trim(),
    body: s.getPropertyValue(`${prefix}body`).trim(),
    background: s.getPropertyValue(`${prefix}background`).trim(),
  };
};

/**
 * A hook that provides a reactive color palette based on the current theme.
 * It listens to theme changes from the ThemeContext and re-reads CSS variables.
 */
const usePalette = () => {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => readPaletteFromDOM(theme));

  useEffect(() => {
    setPalette(readPaletteFromDOM(theme));
  }, [theme]);

  return palette;
};

/**
 * A theme-aware, animated doughnut chart component.
 * @param {{value: number, label: string}} props
 * @param {number} props.value - The percentage value to display (0-100).
 * @param {string} props.label - The label to display below the percentage.
 */
const DonutChart = ({ value = 72, label = 'Completion' }) => {
  const pal = usePalette();

  const data = useMemo(() => ({
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [
          pal.primary,
          // Use a semi-transparent version of the heading color for the track
          `${pal.headings}20` 
        ],
        borderWidth: 2,
        borderColor: pal.background, // Add a border that matches the background for a "floating" effect
        hoverOffset: 8,
      },
    ],
  }), [pal, value]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, callbacks: { label: (ctx) => `${label}: ${value}%` } },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  }), [pal, value, label]);

  return (
    <div className="w-full h-full relative">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold" style={{ color: pal.headings }}>
          {value}%
        </span>
        <span className="text-xs tracking-wider" style={{ color: pal.body }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default DonutChart;
