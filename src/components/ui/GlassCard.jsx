import React from 'react';

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/20 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

export default GlassCard;
