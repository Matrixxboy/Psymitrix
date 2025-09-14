import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../providers/ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * An advanced, theme-aware pie chart.
 * @param {{
 * labels: string[],
 * datasets: Array<{label: string, data: number[]}>,
 * title?: string
 * }} props
 * @param {string[]} props.labels - Labels for each slice of the pie.
 * @param {Array<{label: string, data: number[]}>} props.datasets - Should contain a single dataset object for the pie chart.
 * @param {string} [props.title] - Optional title displayed above the chart.
 */
const PieChart = ({ labels, datasets = [], title }) => {
  const { theme } = useTheme();

  // Define a rich, theme-aware color palette
  const pal = useMemo(() => {
    const isDark = theme === 'dark';
    const baseColors = {
      primary: isDark ? '#8C82FC' : '#6C63FF',
      secondary: isDark ? '#26D7AE' : '#00BFA6',
      accent: isDark ? '#FF8A80' : '#FF6B6B',
      yellow: isDark ? '#F2C94C' : '#F2C94C',
      blue: isDark ? '#56CCF2' : '#2F80ED',
      purple: isDark ? '#BB86FC' : '#9B51E0',
      headings: isDark ? '#E0E0E0' : '#2C3E50',
      body: isDark ? '#BDBDBD' : '#4F4F4F',
      background: isDark ? '#121212' : '#F5F7FA',
    };
    return {
      ...baseColors,
      // Create a dynamic array of colors for chart segments
      chartColors: [baseColors.primary, baseColors.secondary, baseColors.accent, baseColors.yellow, baseColors.blue, baseColors.purple]
    };
  }, [theme]);

  const data = useMemo(() => {
    // A pie chart typically uses only the first dataset provided.
    const sourceDataset = datasets[0] || { data: [] };

    return {
      labels,
      datasets: [{
        ...sourceDataset,
        // Dynamically assign colors to each data point
        backgroundColor: sourceDataset.data.map((_, index) =>
          `${pal.chartColors[index % pal.chartColors.length]}B3` // Add alpha for transparency
        ),
        hoverBackgroundColor: sourceDataset.data.map((_, index) =>
          pal.chartColors[index % pal.chartColors.length]
        ),
        borderColor: pal.background,
        borderWidth: 3,
        hoverOffset: 10,
      }],
    };
  }, [labels, datasets, pal]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: pal.body,
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: pal.background,
        titleColor: pal.headings,
        bodyColor: pal.body,
        borderColor: `${pal.body}50`, // Softer border color
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        // Enhanced callback to show label, value, and percentage
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            return `${label}: ${value} (${percentage})`;
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: pal.headings,
        font: { size: 16, weight: '600' },
        padding: { bottom: 20 },
      },
    },
  }), [pal, title]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;