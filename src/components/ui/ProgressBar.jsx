import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, label }) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
      <motion.div
        className="bg-light-primary dark:bg-dark-primary h-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
          {label && `${label}: `}{progress}%
        </span>
      </motion.div>
    </div>
  );
};

export default ProgressBar;