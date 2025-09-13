import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Walkthrough = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const steps = useMemo(() => ([
    { title: 'This is your safe healing space 🌿', desc: 'Gentle, private, and supportive. You are in control.' },
    { title: 'Track Mood & Progress', desc: 'Daily check-ins, tests, and journals to measure your growth.' },
    { title: 'Play & Heal', desc: 'Relax with calming games and guided breathing exercises.' },
    { title: 'AI Support', desc: 'Chat with an AI companion that understands you and suggests exercises.' },
    { title: 'Beautiful Progress Dashboard', desc: 'See your healing journey with soft, encouraging visuals.' }
  ]), []);

  useEffect(() => {
    const seen = localStorage.getItem('walkthroughSeen');
    if (!seen) setOpen(true);
  }, []);

  if (!open) return null;

  const onSkip = () => {
    localStorage.setItem('walkthroughSeen', 'true');
    setOpen(false);
  };

  const onNext = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const onPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const onGetStarted = () => {
    localStorage.setItem('walkthroughSeen', 'true');
    setOpen(false);
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(107,174,214,0.25)] via-[rgba(199,185,255,0.18)] to-[rgba(163,217,165,0.22)] dark:from-[rgba(74,144,226,0.18)] dark:via-[rgba(168,144,255,0.16)] dark:to-[rgba(129,201,149,0.18)]" />
      <div className="absolute inset-0 backdrop-blur-xl" />

      <div className="relative glass glass-card max-w-md w-full text-center">
        <div className="mb-4">
          <div className="mx-auto h-14 w-14 rounded-2xl glass-button flex items-center justify-center text-2xl">💙</div>
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-text)]">{steps[index].title}</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{steps[index].desc}</p>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={onSkip} className="text-sm text-[var(--color-text-secondary)] hover:opacity-80">Skip</button>
          <div className="flex items-center space-x-2">
            {steps.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-secondary)]/30'}`} />
            ))}
          </div>
          {index === steps.length - 1 ? (
            <button onClick={onGetStarted} className="px-4 py-2 rounded-lg text-white bg-[var(--color-primary)] hover:brightness-110">Get Started</button>
          ) : (
            <button onClick={onNext} className="px-4 py-2 rounded-lg text-white bg-[var(--color-primary)] hover:brightness-110">Next</button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={onPrev} disabled={index === 0} className="text-sm text-[var(--color-text-secondary)] disabled:opacity-40">← Previous</button>
          <span className="text-xs text-[var(--color-text-secondary)]">{index + 1} / {steps.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
