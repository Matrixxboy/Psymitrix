import React from 'react';
import { motion } from 'framer-motion';

const Orb3D = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full"
        style={{
          background: 'conic-gradient(from 45deg, rgba(108,99,255,0.6), rgba(38,215,174,0.5), rgba(255,138,128,0.5), rgba(108,99,255,0.6))',
          filter: 'blur(24px)',
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateZ: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/2 -left-10 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(140,130,252,0.35), rgba(140,130,252,0) 60%)',
          filter: 'blur(18px)',
          transform: 'translateZ(0) rotateX(25deg) rotateY(15deg)',
          transformOrigin: 'center',
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default Orb3D;
