import React, { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend,
} from 'chart.js';
import { useTheme } from '../../providers/ThemeProvider';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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
  const { theme } = useTheme();

  // Define colors based on the current theme
  const pal = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      primary: isDark ? '#E1A79E' : '#A5645A',
      secondary: isDark ? '#F0D2A8' : '#E5C397',
      accent: isDark ? '#F1B18F' : '#D87D62',
      headings: isDark ? '#F8F1EB' : '#4B2F2A',
      body: isDark ? '#E5DAD2' : '#4A433F',
      background: isDark ? '#1C1A1A' : '#F4F4F2',
    };
  }, [theme]);

  const themeColors = useMemo(() => [pal.primary, pal.secondary, pal.accent], [pal]);

  const data = useMemo(() => ({
    labels,
    datasets: datasets.map((dataset, index) => {
      const color = themeColors[index % themeColors.length];
      return {
        label: dataset.label,
        data: dataset.data,
        backgroundColor: `${color}33`,
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
    const allData = datasets.flatMap(ds => ds.data);
    const maxValue = Math.max(...allData, 0);
    const suggestedMax = Math.ceil(maxValue * 1.25);
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
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
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.r}`
          }
        },
      },
      scales: {
        r: {
          angleLines: { color: pal.body },
          grid: { color: pal.body },
          pointLabels: {
            color: pal.headings,
            font: { size: 13, weight: '500' },
          },
          ticks: {
            display: true,
            color: pal.body,
            backdropColor: `${pal.background}99`,
            stepSize: Math.ceil(suggestedMax / 5),
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
