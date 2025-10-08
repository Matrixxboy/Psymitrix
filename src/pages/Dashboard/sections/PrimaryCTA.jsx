import React from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const PrimaryCTA = () => (
    <motion.div variants={cardVariants}>
        <GlassCard className="p-6 flex flex-col md:flex-row items-center justify-between bg-dark-primary dark:bg-light-primary">
            <div>
                <h2 className="text-2xl font-bold">Ready for a new session?</h2>
                <p className="mt-1">Start a chat with Aura or try a calming activity.</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
                <button className="px-6 py-3 font-semibold rounded-lg text-dark-primary dark:text-light-primary bg-black/50 dark:bg-white/60 dark:hover:bg-white/40 hover:bg-black/30 transition-all">Chat with AI</button>
                <button className="px-6 py-3 font-semibold rounded-lg text-dark-primary dark:text-light-primary bg-black/50 dark:bg-white/60 dark:hover:bg-white/40 hover:bg-black/30 transition-all">Activities</button>
            </div>
        </GlassCard>
    </motion.div>
);

export default PrimaryCTA;