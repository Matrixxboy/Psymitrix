import React, { useEffect, useMemo, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend,
} from 'chart.js';
import { useTheme } from '../../providers/ThemeProvider';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- Simplified, Reusable Theming Hook ---
const readPaletteFromDOM = (theme) => {
  if (typeof window === 'undefined') {
    return { primary: '#6C63FF', secondary: '#00BFA6', accent: '#FF6B6B', headings: '#2C3E50', body: '#4F4F4F', background: '#F5F7FA' };
  }
  const s = getComputedStyle(document.documentElement);
  const prefix = theme === 'dark' ? '--dark-' : '--light-';
  return {
    primary: s.getPropertyValue(`${prefix}primary`).trim(),
    secondary: s.getPropertyValue(`${prefix}secondary`).trim(),
    accent: s.getPropertyValue(`${prefix}accent`).trim(),
    headings: s.getPropertyValue(`${prefix}headings`).trim(),
    body: s.getPropertyValue(`${prefix}body`).trim(),
    background: s.getPropertyValue(`${prefix}background`).trim(),
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

/**
 * An advanced, theme-aware radar chart for comparing multiple datasets.
 * @param {{
 * labels: string[], 
 * datasets: Array<{label: string, data: number[]}>
 * }} props
 * @param {string[]} props.labels - The labels for the points of the radar chart (e.g., 'Stress', 'Anxiety').
 * @param {Array<{label: string, data: number[]}>} props.datasets - An array of dataset objects to compare.
 */
const RadarChart = ({ labels, datasets = [] }) => {
  const pal = usePalette();
  const themeColors = useMemo(() => [pal.primary, pal.secondary, pal.accent], [pal]);

  const data = useMemo(() => ({
    labels,
    datasets: datasets.map((dataset, index) => {
      const color = themeColors[index % themeColors.length];
      return {
        label: dataset.label,
        data: dataset.data,
        backgroundColor: `${color}33`, // Use color with ~20% opacity for the fill
        borderColor: color,
        pointBackgroundColor: color,
        borderWidth: 2.5,
        pointBorderColor: pal.background,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: pal.background,
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      };
    }),
  }), [labels, datasets, pal, themeColors]);

  const options = useMemo(() => {
    // Dynamically calculate the max value across all datasets for a responsive scale
    const allData = datasets.flatMap(ds => ds.data);
    const maxValue = Math.max(...allData, 0);
    const suggestedMax = Math.ceil(maxValue * 1.25); // Add 25% padding
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        // The legend is now enabled and themed, crucial for comparing datasets
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: pal.body,
            font: { size: 12 },
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: pal.background,
          titleColor: pal.headings,
          bodyColor: pal.body,
          borderColor: pal.body,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        r: {
          angleLines: { color: `${pal.body}33` },
          grid: { color: `${pal.body}33` },
          pointLabels: {
            color: pal.headings,
            font: { size: 13, weight: '500' },
          },
          // Ticks are now visible and styled for better data interpretation
          ticks: {
            display: true,
            color: pal.body,
            backdropColor: `${pal.background}99`,
            stepSize: Math.ceil(suggestedMax / 5), // Aim for ~5 tick marks
          },
          beginAtZero: true,
          suggestedMax: suggestedMax > 0 ? suggestedMax : 10,
        },
      },
    };
  }, [pal, datasets]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;