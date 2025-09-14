import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../providers/ThemeProvider';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// --- Simplified, Reusable Theming Hook ---
const readPaletteFromDOM = (theme) => {
  if (typeof window === 'undefined') {
    return { primary: '#6C63FF', headings: '#2C3E50', body: '#4F4F4F', background: '#F5F7FA' };
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

const usePalette = () => {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => readPaletteFromDOM(theme));

  useEffect(() => {
    setPalette(readPaletteFromDOM(theme));
  }, [theme]);

  return palette;
};

/**
 * A theme-aware, animated line chart component.
 * @param {{labels: string[], values: number[], title: string}} props
 * @param {string[]} props.labels - The labels for the X-axis.
 * @param {number[]} props.values - The numerical data points for the Y-axis.
 * @param {string} props.title - The title for the dataset.
 */
const LineChart = ({ labels, values, title = 'Progress' }) => {
  const pal = usePalette();

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: title,
        data: values,
        fill: true,
        borderColor: pal.primary,
        backgroundColor: `${pal.primary}33`, // Use primary color with ~20% opacity for the area fill
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: pal.primary,
        pointBorderColor: pal.background,
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: pal.primary,
      },
    ],
  }), [labels, values, pal, title]);

  const options = useMemo(() => {
    // Calculate a dynamic maximum for the Y-axis to give the chart some breathing room
    const maxValue = Math.max(...values, 0);
    const suggestedMax = Math.ceil(maxValue * 1.2); // Add 20% padding

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: pal.body, boxWidth: 0 } },
        tooltip: {
          backgroundColor: pal.background,
          titleColor: pal.headings,
          bodyColor: pal.body,
          borderColor: pal.primary,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (ctx) => `Value: ${ctx.parsed.y}`,
            title: (items) => items[0]?.label ?? ''
          }
        },
      },
      scales: {
        x: {
          grid: { drawOnChartArea: false, borderColor: `${pal.body}44` },
          ticks: { color: pal.body, padding: 10 },
        },
        y: {
          grid: { color: `${pal.body}22`, borderColor: 'transparent' },
          ticks: { color: pal.body, padding: 10 },
          suggestedMin: 0,
          suggestedMax: suggestedMax > 0 ? suggestedMax : 10, // Fallback for empty data
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    };
  }, [pal, values]);

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
