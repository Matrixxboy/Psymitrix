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
      primary: isDark ? '#E1A79E' : '#A5645A',
      secondary: isDark ? '#F0D2A8' : '#E5C397',
      accent: isDark ? '#F1B18F' : '#D87D62',
      yellow: isDark ? '#F6D9B8' : '#F7E4CF',
      blue: isDark ? '#B8897B' : '#C9A496',
      purple: isDark ? '#D59580' : '#B06E60',
      headings: isDark ? '#F8F1EB' : '#4B2F2A',
      body: isDark ? '#E5DAD2' : '#4A433F',
      background: isDark ? '#1C1A1A' : '#F4F4F2',
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
