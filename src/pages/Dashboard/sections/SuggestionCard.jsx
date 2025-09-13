import React from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const SuggestionCard = ({ title, items = [] }) => (
    <motion.div variants={cardVariants}>
        <GlassCard className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings">{title}</h3>
            {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all cursor-pointer">
                    <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm opacity-80">{item.details}</p>
                    </div>
                    <FiArrowRight />
                </div>
            ))}
        </GlassCard>
    </motion.div>
);

export default SuggestionCard;