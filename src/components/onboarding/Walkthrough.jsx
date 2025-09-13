import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiBarChart2, FiHeart, FiGrid, FiPlayCircle } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

const Walkthrough = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const steps = useMemo(() => ([
    { icon: <FiHeart />, title: 'A Safe Space for Your Mind', desc: 'Psymitrix is a gentle, private, and supportive environment where you are in control of your mental wellness journey.' },
    { icon: <FiMessageCircle />, title: 'Empathetic AI Chat', desc: 'Chat with Aura, an AI companion that understands you, offers support, and suggests helpful exercises.' },
    { icon: <FiBarChart2 />, title: 'Track Mood & Progress', desc: 'Use daily check-ins, assessments, and journals to measure your growth and celebrate your progress.' },
    { icon: <FiPlayCircle />, title: 'Relax with Calming Games', desc: 'Unwind and refocus with a selection of calming games and guided breathing exercises designed to soothe your mind.' },
    { icon: <FiGrid />, title: 'Your Personal Dashboard', desc: 'Visualize your healing journey with soft, encouraging visuals and get a clear overview of your progress.' }
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
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-light-background/50 /50 backdrop-blur-2xl">
      <GlassCard className="max-w-md w-full text-center p-8">
        <div className="mb-6 text-5xl text-light-primary dark:text-dark-primary mx-auto w-20 h-20 flex items-center justify-center bg-white/20 rounded-full shadow-inner">
          {steps[index].icon}
        </div>
        <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings">{steps[index].title}</h3>
        <p className="mt-2 text-light-body dark:text-dark-body">{steps[index].desc}</p>

        <div className="mt-8 flex items-center justify-center space-x-3">
            {steps.map((_, i) => (
              <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-light-primary dark:bg-dark-primary' : 'w-2 bg-white/30'}`} />
            ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 items-center text-light-headings dark:text-dark-headings">
            <Button onClick={onPrev} disabled={index === 0} variant="outline" className="font-semibold disabled:opacity-50 text-left">Previous</Button>
            
            {index === steps.length - 1 ? (
              <Button onClick={onGetStarted} variant="primary" className="col-span-1">Get Started</Button>
            ) : (
              <Button onClick={onNext} variant="primary" className="col-span-1">Next</Button>
            )}

            <Button onClick={onSkip} variant="outline" className="font-semibold disabled:opacity-50 text-right">Skip</Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Walkthrough;
