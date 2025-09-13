import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && count > 0) {
      interval = setInterval(() => setCount(count - 1), 1000);
    } else if (isActive && count === 0) {
      if (phase === 'inhale') { setPhase('hold'); setCount(4); }
      else if (phase === 'hold') { setPhase('exhale'); setCount(6); }
      else if (phase === 'exhale') { setPhase('inhale'); setCount(4); setCycle(cycle + 1); }
    }
    return () => clearInterval(interval);
  }, [isActive, count, phase, cycle]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCount(4);
  };

  return (
    <div className="text-center flex flex-col items-center justify-center p-8 h-full">
      <div className={`w-48 h-48 rounded-full flex items-center justify-center text-4xl font-bold text-light-headings dark:text-dark-headings transition-all duration-1000
        ${phase === 'inhale' ? 'bg-light-primary/30 dark:bg-dark-primary/30 scale-110' : ''}
        ${phase === 'hold' ? 'bg-light-secondary/30 dark:bg-dark-secondary/30' : ''}
        ${phase === 'exhale' ? 'bg-light-accent/30 dark:bg-dark-accent/30 scale-90' : ''}
        ${phase === 'ready' ? 'bg-white/20' : ''}
      `}>
        {phase === 'ready' ? 'Ready' : count}
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-2">
          {phase === 'ready' ? 'Ready to Begin?' : phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
        </h3>
        <p className="text-light-body dark:text-dark-body">
          {phase === 'ready' ? 'Click start when you\'re ready' : `${phase.charAt(0).toUpperCase() + phase.slice(1)} for ${count} seconds`}
        </p>
        {cycle > 0 && <p className="text-sm text-light-body dark:text-dark-body mt-2">Cycle: {cycle}</p>}
      </div>

      <div className="flex gap-4">
        {!isActive ? (
          <Button onClick={startExercise} variant="primary">Start</Button>
        ) : (
          <Button onClick={stopExercise} variant="danger">Stop</Button>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;