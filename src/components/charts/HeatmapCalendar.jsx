import React, { useMemo } from 'react';

// values: array of { date: Date|string, value: number 0..1 }
const HeatmapCalendar = ({ days = 30, values = [] }) => {
  const map = useMemo(() => {
    const m = new Map();
    values.forEach(v => {
      const key = new Date(v.date).toDateString();
      m.set(key, Math.max(0, Math.min(1, v.value)));
    });
    return m;
  }, [values]);

  const cells = useMemo(() => {
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const intensity = map.get(key) ?? 0;
      arr.push({ date: key, intensity });
    }
    return arr;
  }, [days, map]);

  return (
    <div className="grid grid-cols-10 gap-1.5">
      {cells.map((c, idx) => (
        <div
          key={idx}
          title={`${c.date}`}
          className="h-6 rounded"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.14))`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: `rgba(107,174,214, ${0.15 + c.intensity * 0.6})`,
          }}
        />
      ))}
    </div>
  );
};

export default HeatmapCalendar;
