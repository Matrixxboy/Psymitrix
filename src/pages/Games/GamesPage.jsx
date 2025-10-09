import React, { useState } from 'react';
import { FiWind, FiZap, FiArrowLeft } from 'react-icons/fi';   // feather icons
import { FaPuzzlePiece, FaSpa } from 'react-icons/fa';                // font awesome
import BreathingExercise from './mini-games/BreathingExercise';
import FocusPuzzle from './mini-games/FocusPuzzle';
import MemoryChallenge from './mini-games/MemoryChallenge';
import GuidedMeditation from './mini-games/GuidedMeditation';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'breathing',
      title: 'Breathing Rhythm',
      description: 'A guided breathing exercise to calm your mind and reduce anxiety.',
      icon: <FiWind />,
      component: <BreathingExercise />
    },
    {
      id: 'meditation',
      title: 'Guided Meditation',
      description: 'A guided meditation to help you relax and find inner peace.',
      icon: <FaSpa />,
      component: <GuidedMeditation />
    },
    // {
    //   id: 'focus',
    //   title: 'Focus Puzzle',
    //   description: 'A simple puzzle to help you focus and enter a state of flow.',
    //   icon: <FaPuzzlePiece />,   // ✅ from Font Awesome
    //   component: <FocusPuzzle />
    // },
    // {
    //   id: 'memory',
    //   title: 'Memory Challenge',
    //   description: 'A light-hearted memory game to sharpen your mind.',
    //   icon: <FiZap />,
    //   component: <MemoryChallenge />
    // },
    
  ];

  const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/20 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );

  const renderGameList = () => (
    <div className="max-w-4xl mx-auto pt-[50px]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">Calming Games</h1>
        <p className="mt-2 text-lg text-light-body dark:text-dark-body">Engage your mind and find your center.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GlassCard key={game.id} className="p-8 flex flex-col text-center items-center">
            <div className="w-16 h-16 text-3xl flex items-center justify-center text-light-primary dark:text-dark-primary bg-white/20 rounded-full mb-4">
              {game.icon}
            </div>
            <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-2">{game.title}</h3>
            <p className="text-light-body dark:text-dark-body flex-grow mb-6">{game.description}</p>
            <button
              onClick={() => setSelectedGame(game)}
              className="w-full mt-auto px-6 py-3 font-semibold rounded-lg bg-light-headings/20 dark:bg-white/20 hover:bg-white/30 transition-all text-light-headings dark:text-dark-headings"
            >
              Play
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderSelectedGame = () => {
    const game = selectedGame;
    return (
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedGame(null)}
          className="flex items-center gap-2 text-light-body dark:text-dark-body font-semibold mb-4"
        >
          <FiArrowLeft /> Back to Games
        </button>
        <GlassCard className="h-[60vh]">
          {game.component}
        </GlassCard>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {selectedGame ? renderSelectedGame() : renderGameList()}
    </div>
  );
};

export default GamesPage;
  