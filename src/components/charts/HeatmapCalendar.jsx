import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const HeatmapCalendar = ({ data = [], days = 35 }) => {
    const intensityMap = useMemo(() => {
        const map = new Map();
        data.forEach(item => {
            const dateKey = new Date(item.date).toDateString();
            map.set(dateKey, Math.max(0, Math.min(1, item.value || 0)));
        });
        return map;
    }, [data]);

    const cells = useMemo(() => {
        const arr = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toDateString();
            const intensity = intensityMap.get(key) ?? -1;
            arr.push({ date: d, intensity });
        }
        return arr;
    }, [days, intensityMap]);

    const getTooltip = (cell) => {
        if (cell.intensity < 0) return `${cell.date.toLocaleDateString()}\nNo data recorded`;
        return `${cell.date.toLocaleDateString()}\nMood Level: ${Math.round(cell.intensity * 10)}`;
    };

    const cellVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <div className="grid grid-cols-7 gap-1.5 p-2">
            {cells.map((cell, idx) => (
                <motion.div
                    key={idx}
                    title={getTooltip(cell)}
                    className="h-5 w-5 rounded-md"
                    style={{
                        backgroundColor: cell.intensity < 0
                            ? 'rgba(128, 128, 128, 0.1)'
                            : `rgba(140, 130, 252, ${0.15 + cell.intensity * 0.85})`
                    }}
                    variants={cellVariants}
                    custom={idx}
                    transition={{ duration: 0.3, delay: idx * 0.015 }}
                />
            ))}
        </div>
    );
};

export default HeatmapCalendar;