import React from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const MoodTracker = ({ mood, setMood }) => (
    <motion.div variants={cardVariants}>
        <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-4">How are you feeling?</h3>
            <div className="flex items-center justify-between text-3xl px-2">
                <span>😞</span>
                <span>😐</span>
                <span>😊</span>
                <span>😄</span>
                <span>🤩</span>
            </div>
            <input
                type="range"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer mt-4 bg-white/30 dark:bg-white/10 accent-light-primary dark:accent-dark-primary"
            />
        </GlassCard>
    </motion.div>
);

export default MoodTracker;