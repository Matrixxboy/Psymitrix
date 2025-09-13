import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ChartCard = ({ title, icon: Icon, children }) => (
  <motion.div variants={cardVariants}>
    <GlassCard className="p-6 h-full">
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-4 flex items-center">
        <Icon className="mr-3 text-light-primary dark:text-dark-primary"/>
        {title}
      </h3>
      <div className="h-full min-h-[200px]">
        {children}
      </div>
    </GlassCard>
  </motion.div>
);

export default ChartCard;