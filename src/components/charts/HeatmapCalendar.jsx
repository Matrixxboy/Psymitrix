import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../../providers/ThemeProvider'; // Assuming this path is correct

// --- Reusable Theming Hook (from previous examples) ---
const readPaletteFromDOM = (theme) => {
  if (typeof window === 'undefined') {
    return { primary: '#6C63FF', background: '#F5F7FA' };
  }
  const s = getComputedStyle(document.documentElement);
  const prefix = theme === 'dark' ? '--dark-' : '--light-';
  return {
    primary: s.getPropertyValue(`${prefix}primary`).trim(),
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

// --- Improved HeatmapCalendar Component ---

/**
 * A theme-aware heatmap calendar that displays activity intensity over the last several weeks.
 * @param {{weeks: number, values: Array<{date: Date|string, value: number}>}} props
 * @param {number} props.weeks - The number of weeks to display.
 * @param {Array<{date: Date|string, value: number}>} props.values - Array of activity data, value should be 0..1.
 */
const HeatmapCalendar = ({ weeks = 5, values = [] }) => {
  const palette = usePalette();
  const totalDays = weeks * 7;

  // useMemo to create a fast lookup map for activity values
  const activityMap = useMemo(() => {
    const map = new Map();
    values.forEach(v => {
      const key = new Date(v.date).toDateString();
      // Clamp the value between 0 and 1 for safety
      map.set(key, Math.max(0, Math.min(1, v.value)));
    });
    return map;
  }, [values]);

  // useMemo to generate the grid of cells for the calendar
  const cells = useMemo(() => {
    const arr = [];
    const today = new Date();
    
    // To align the last day to the end of a week (Saturday), we find the offset
    const dayOfWeekOffset = today.getDay();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (totalDays - 1) + dayOfWeekOffset);

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toDateString();
      const intensity = activityMap.get(key) ?? 0;
      arr.push({ date: d, intensity });
    }
    return arr;
  }, [totalDays, activityMap]);

  // Helper to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
  }

  const primaryRgb = useMemo(() => hexToRgb(palette.primary), [palette.primary]);
  
  return (
    <div className="grid grid-cols-7 gap-1.5 p-4 rounded-2xl bg-black/5 dark:bg-white/5">
      {cells.map(c => (
        <div
          key={c.date.toDateString()}
          title={`${c.date.toDateString()}: Intensity ${Math.round(c.intensity * 100)}%`}
          className="h-5 w-5 rounded transition-colors duration-300"
          style={{
            // The color is now based on your theme's primary color
            backgroundColor: `rgba(${primaryRgb}, ${0.1 + c.intensity * 0.9})`,
          }}
        />
      ))}
    </div>
  );
};

export default HeatmapCalendar;