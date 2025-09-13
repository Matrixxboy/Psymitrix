import React from 'react';
import { FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/ui/GlassCard';

const InsightCard = ({ title, text, icon, itemVariants }) => (
  <motion.div variants={itemVariants}>
    <GlassCard className="p-6 h-full">
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-3 flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </h3>
      <p className="text-light-body dark:text-dark-body opacity-90">{text}</p>
    </GlassCard>
  </motion.div>
);

export default InsightCard;