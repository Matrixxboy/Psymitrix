import React, { useRef } from 'react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const GlassCard = ({ children, className = '' }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = clamp(((y / rect.height) - 0.5) * -6, -6, 6);
    const ry = clamp(((x / rect.width) - 0.5) * 6, -6, 6);
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--tx', `${(ry / 6) * 3}px`);
    el.style.setProperty('--ty', `${(rx / -6) * 3}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--tx', '0px');
    el.style.setProperty('--ty', '0px');
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative rounded-2xl shadow-lg border border-gray-300/70 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-2xl transition-transform duration-200 [transform-style:preserve-3d] hover:shadow-2xl ${className}`}
      style={{ transform: 'perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translate3d(var(--tx, 0), var(--ty, 0), 0)' }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(600px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.06), transparent 40%)' }} />
      {children}
    </div>
  );
};

export default GlassCard;
