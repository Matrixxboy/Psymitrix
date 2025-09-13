import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const GamesPage = () => {
  const { user, logout } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState({});

  const games = [
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Guided breathing exercises to reduce anxiety and promote relaxation',
      duration: '3-10 minutes',
      type: 'mindfulness',
      color: 'blue'
    },
    {
      id: 'mood-journal',
      title: 'Mood Journal',
      description: 'Track your daily mood and identify patterns',
      duration: '5-15 minutes',
      type: 'tracking',
      color: 'green'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Daily gratitude exercises to improve positive thinking',
      duration: '5-10 minutes',
      type: 'positivity',
      color: 'yellow'
    },
    {
      id: 'progressive-relaxation',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematic muscle relaxation to reduce physical tension',
      duration: '10-20 minutes',
      type: 'relaxation',
      color: 'purple'
    }
  ];

  const BreathingExercise = () => {
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [count, setCount] = useState(4);
    const [cycle, setCycle] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      let interval = null;
      
      if (isActive && count > 0) {
        interval = setInterval(() => {
          setCount(count - 1);
        }, 1000);
      } else if (isActive && count === 0) {
        if (phase === 'inhale') {
          setPhase('hold');
          setCount(4);
        } else if (phase === 'hold') {
          setPhase('exhale');
          setCount(6);
        } else if (phase === 'exhale') {
          setPhase('inhale');
          setCount(4);
          setCycle(cycle + 1);
        }
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
      <div className="text-center">
        <div className="mb-8">
          <div className={`mx-auto w-32 h-32 rounded-full border-4 flex items-center justify-center text-2xl font-bold transition-all duration-1000 ${
            phase === 'inhale' ? 'border-blue-500 bg-blue-100 dark:bg-blue-900 scale-110' :
            phase === 'hold' ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900' :
            phase === 'exhale' ? 'border-green-500 bg-green-100 dark:bg-green-900 scale-90' :
            'border-gray-300 bg-gray-100 dark:bg-gray-700'
          }`}>
            {phase === 'ready' ? 'Ready' : count}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {phase === 'ready' ? 'Ready to begin' :
             phase === 'inhale' ? 'Breathe In' :
             phase === 'hold' ? 'Hold' :
             'Breathe Out'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {phase === 'ready' ? 'Click start when you\'re ready' :
             `${phase.charAt(0).toUpperCase() + phase.slice(1)} for ${count} seconds`}
          </p>
          {cycle > 0 && <p className="text-sm text-gray-500 mt-2">Cycle: {cycle}</p>}
        </div>

        <div className="space-x-4">
          {!isActive ? (
            <Button onClick={startExercise} variant="primary">
              Start Breathing Exercise
            </Button>
          ) : (
            <Button onClick={stopExercise} variant="secondary">
              Stop Exercise
            </Button>
          )}
        </div>
      </div>
    );
  };

  const MoodJournal = () => {
    const [mood, setMood] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const moods = [
      { emoji: '😊', label: 'Great', value: 'great' },
      { emoji: '🙂', label: 'Good', value: 'good' },
      { emoji: '😐', label: 'Okay', value: 'okay' },
      { emoji: '😔', label: 'Low', value: 'low' },
      { emoji: '😞', label: 'Bad', value: 'bad' }
    ];

    const handleSubmit = () => {
      if (mood) {
        setSubmitted(true);
        // Here you would save to backend
      }
    };

    if (submitted) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Mood Logged!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for tracking your mood. Keep it up!
          </p>
          <Button onClick={() => setSubmitted(false)} variant="primary">
            Log Another Entry
          </Button>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          How are you feeling today?
        </h3>
        
        <div className="grid grid-cols-5 gap-4 mb-6">
          {moods.map((moodOption) => (
            <button
              key={moodOption.value}
              onClick={() => setMood(moodOption.value)}
              className={`p-4 rounded-lg text-center transition-colors ${
                mood === moodOption.value
                  ? 'bg-primary-100 border-2 border-primary-500 dark:bg-primary-900'
                  : 'bg-gray-100 border-2 border-transparent hover:border-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className="text-3xl mb-2">{moodOption.emoji}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{moodOption.label}</div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's on your mind? (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share any thoughts or experiences from today..."
            className="w-full glass-input px-3 py-2 rounded-md placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            rows="4"
          />
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!mood}
            variant="primary"
          >
            Log Mood
          </Button>
        </div>
      </div>
    );
  };

  const GratitudePractice = () => {
    const [gratitudes, setGratitudes] = useState(['', '', '']);
    const [submitted, setSubmitted] = useState(false);

    const handleGratitudeChange = (index, value) => {
      const newGratitudes = [...gratitudes];
      newGratitudes[index] = value;
      setGratitudes(newGratitudes);
    };

    const handleSubmit = () => {
      if (gratitudes.some(g => g.trim())) {
        setSubmitted(true);
      }
    };

    if (submitted) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Gratitude Recorded!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Focusing on gratitude can improve your overall well-being.
          </p>
          <Button onClick={() => { setSubmitted(false); setGratitudes(['', '', '']); }} variant="primary">
            Practice Again
          </Button>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          What are you grateful for today?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          List three things you're grateful for, big or small.
        </p>
        
        <div className="space-y-4 mb-6">
          {gratitudes.map((gratitude, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {index + 1}. I'm grateful for...
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => handleGratitudeChange(index, e.target.value)}
                placeholder="Something you appreciate today"
                className="w-full glass-input px-3 py-2 rounded-md placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!gratitudes.some(g => g.trim())}
            variant="primary"
          >
            Save Gratitude Practice
          </Button>
        </div>
      </div>
    );
  };

  const renderGameContent = () => {
    switch (selectedGame.id) {
      case 'breathing':
        return <BreathingExercise />;
      case 'mood-journal':
        return <MoodJournal />;
      case 'gratitude':
        return <GratitudePractice />;
      case 'progressive-relaxation':
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Progressive Muscle Relaxation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This guided exercise will be available in the next update.
            </p>
            <Button onClick={() => setSelectedGame(null)} variant="secondary">
              Back to Games
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-app">
        <nav className="glass shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                  PsyMitrix
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedGame.title}
                </span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSelectedGame(null)}>
                Back to Games
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="glass glass-card">
            {renderGameContent()}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <nav className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                PsyMitrix
              </Link>
              <nav className="flex space-x-4">
                <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Home
                </Link>
                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Assessments
                </Link>
                <Link to="/games" className="text-[var(--color-primary)] font-medium">
                  Wellness Games
                </Link>
                <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Mental Wellness Games
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Interactive activities to support your mental health journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {games.map((game) => (
            <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className={`inline-block p-2 rounded-lg mb-4 bg-${game.color}-100 dark:bg-${game.color}-900`}>
                <div className="w-8 h-8 bg-current rounded opacity-20"></div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {game.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {game.description}
              </p>
              <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-4">
                <span>Duration: {game.duration}</span>
              </div>
              <Button
                onClick={() => setSelectedGame(game)}
                variant="primary"
                className="w-full"
              >
                Start Activity
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GamesPage;
