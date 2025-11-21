import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiCheckCircle, FiArrowRight, FiRefreshCcw, FiBookOpen, FiMessageSquare } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import { saveGameData } from '../../../api/games';
import { useAuth } from '../../../hooks/useAuth';

const affirmations = [
  "I am worthy of love and happiness.",
  "I am capable of achieving my goals.",
  "I choose joy and positivity.",
  "I am resilient and strong.",
  "I trust my intuition and inner wisdom.",
  "I am grateful for all that I have.",
  "I release all doubts and fears.",
  "I am a magnet for success and abundance.",
  "I embrace my unique journey.",
  "I am at peace with who I am.",
];

const reflectiveQuestions = [
  "What is one thing you are grateful for today?",
  "How do you feel after reflecting on these affirmations?",
  "What is a small step you can take to bring more positivity into your day?",
];

const AffirmationAscent = () => {
  const { user } = useAuth();
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [affirmedCount, setAffirmedCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [gamePhase, setGamePhase] = useState('affirmations'); // 'affirmations', 'questions', 'summary'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const totalTimeRef = useRef(0); // To track total time played

  const walkthroughSteps = [
    {
      icon: <FiHeart className='w-20 h-20 text-light-headings dark:text-light-secondary animate-pulse' />,
      title: "Welcome to Mindful Reflection Journey",
      text: "Engage with affirmations and reflective questions to boost your mood and gain insights.",
    },
    {
      icon: <FiCheckCircle className='w-20 h-20 text-light-headings dark:text-light-secondary animate-bounce' />,
      title: "Affirm Your Power",
      text: "Read each affirmation. Click 'Affirm' if it resonates, or 'Skip' if not. Your choices help us understand you better.",
    },
    {
      icon: <FiBookOpen className='w-20 h-20 text-light-headings dark:text-light-secondary animate-spin-slow' />,
      title: "Reflect and Grow",
      text: "After affirmations, you'll answer a few questions to deepen your self-awareness. Be honest with yourself!",
    },
    {
      icon: <FiMessageSquare className='w-20 h-20 text-light-headings dark:text-light-secondary animate-pulse' />,
      title: "Your Journey's Summary",
      text: "At the end, you'll receive a summary of your session, highlighting your positive engagement and reflections.",
    },
  ];

  useEffect(() => {
    if (isReady && gamePhase !== 'summary') {
      const interval = setInterval(() => {
        totalTimeRef.current += 1;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isReady, gamePhase]);

  const handleAffirm = () => {
    setAffirmedCount(prevCount => prevCount + 1);
    setFeedbackMessage("Affirmed! Feeling good!");
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (currentAffirmationIndex < affirmations.length - 1) {
        setCurrentAffirmationIndex(prevIndex => prevIndex + 1);
      } else {
        setGamePhase('questions');
      }
    }, 1000);
  };

  const handleSkipAffirmation = () => {
    setFeedbackMessage("It's okay, find what resonates with you.");
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (currentAffirmationIndex < affirmations.length - 1) {
        setCurrentAffirmationIndex(prevIndex => prevIndex + 1);
      } else {
        setGamePhase('questions');
      }
    }, 1000);
  };

  const handleResponseChange = (e) => {
    setCurrentResponse(e.target.value);
  };

  const handleSubmitResponse = () => {
    setUserResponses(prevResponses => ({
      ...prevResponses,
      [reflectiveQuestions[currentQuestionIndex]]: currentResponse,
    }));
    setCurrentResponse('');
    if (currentQuestionIndex < reflectiveQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGamePhase('summary');
      saveGameSession();
    }
  };

  const saveGameSession = async () => {
    const gameData = {
      games: [{
        game_name: 'mindful_reflection_journey',
        total_score: affirmedCount, // Score based on affirmed count
        game_played: 1,
        total_time_played: Math.round(totalTimeRef.current / 60),
        details: {
          affirmed_count: affirmedCount,
          total_affirmations: affirmations.length,
          responses: userResponses,
        }
      }],
      total_score: affirmedCount,
      games_played: 1,
      total_time_played: Math.round(totalTimeRef.current / 60),
    };
    await saveGameData(gameData);
  };

  const handleResetGame = () => {
    setCurrentAffirmationIndex(0);
    setAffirmedCount(0);
    setCurrentQuestionIndex(0);
    setUserResponses({});
    setCurrentResponse('');
    setIsReady(false);
    setWalkthroughStep(0);
    setGamePhase('affirmations');
    setFeedbackMessage('');
    setShowFeedback(false);
    totalTimeRef.current = 0;
  };

  const handleNextWalkthrough = () => {
    if (walkthroughStep < walkthroughSteps.length - 1) {
      setWalkthroughStep(walkthroughStep + 1);
    } else {
      setIsReady(true);
    }
  };

  const handlePreviousWalkthrough = () => {
    if (walkthroughStep > 0) setWalkthroughStep(walkthroughStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px] transition-all duration-500">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key={walkthroughStep}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            {walkthroughSteps[walkthroughStep].icon}
            <h2 className="text-3xl font-semibold text-light-primary mb-2">
              {walkthroughSteps[walkthroughStep].title}
            </h2>
            <p className="text-light-accent dark:text-light-secondary mb-8 text-lg max-w-sm leading-relaxed">
              {walkthroughSteps[walkthroughStep].text}
            </p>

            <div className="flex space-x-4">
              {walkthroughStep > 0 && (
                <Button onClick={handlePreviousWalkthrough}>
                  Previous
                </Button>
              )}
              <Button onClick={handleNextWalkthrough}>
                {walkthroughStep === walkthroughSteps.length - 1 ? 'Start Journey' : 'Next'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-play"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <h2 className="text-3xl font-semibold text-light-primary mb-2">
              Mindful Reflection Journey
            </h2>
            <p className="text-light-accent dark:text-light-secondary mb-4">
              {gamePhase === 'affirmations' && `Affirmed: ${affirmedCount}/${affirmations.length}`}
              {gamePhase === 'questions' && `Question ${currentQuestionIndex + 1}/${reflectiveQuestions.length}`}
            </p>

            {showFeedback && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-500 font-semibold mb-4"
              >
                {feedbackMessage}
              </motion.p>
            )}

            {gamePhase === 'affirmations' && (
              <motion.div
                key={currentAffirmationIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass dark:glass-dark p-8 rounded-xl shadow-lg min-h-[150px] flex items-center justify-center max-w-sm mb-8"
              >
                <p className="text-2xl font-bold text-light-headings dark:text-dark-headings">
                  {affirmations[currentAffirmationIndex]}
                </p>
              </motion.div>
            )}

            {gamePhase === 'questions' && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass dark:glass-dark p-8 rounded-xl shadow-lg min-h-[150px] flex flex-col items-center justify-center max-w-sm mb-8"
              >
                <p className="text-xl font-bold text-light-headings dark:text-dark-headings mb-4">
                  {reflectiveQuestions[currentQuestionIndex]}
                </p>
                <textarea
                  value={currentResponse}
                  onChange={handleResponseChange}
                  className="w-full p-3 rounded-lg bg-light-background dark:bg-dark-background border border-light-accent dark:border-dark-accent text-light-body dark:text-dark-body focus:outline-none focus:border-light-primary dark:focus:border-dark-primary"
                  rows="4"
                  placeholder="Type your reflection here..."
                ></textarea>
              </motion.div>
            )}

            {gamePhase === 'summary' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass dark:glass-dark p-8 rounded-xl shadow-lg min-h-[150px] flex flex-col items-center justify-center max-w-sm mb-8"
              >
                <h3 className="text-2xl font-bold text-light-primary mb-4">Journey Complete!</h3>
                <p className="text-light-headings dark:text-dark-headings mb-2">
                  You affirmed <span className="font-bold">{affirmedCount}</span> out of <span className="font-bold">{affirmations.length}</span> positive thoughts.
                </p>
                {Object.keys(userResponses).length > 0 && (
                  <div className="mt-4 w-full text-left">
                    <p className="font-semibold text-light-headings dark:text-dark-headings mb-2">Your Reflections:</p>
                    {Object.entries(userResponses).map(([question, response], index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm text-light-body dark:text-dark-body italic">"{question}"</p>
                        <p className="text-light-body dark:text-dark-body">{response}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-light-accent dark:text-light-secondary mt-4">
                  Keep nurturing your mind!
                </p>
              </motion.div>
            )}

            <div className="flex space-x-4 mt-4">
              {gamePhase === 'affirmations' && (
                <>
                  <Button onClick={handleAffirm} className="bg-green-500 hover:bg-green-600">
                    <FiCheckCircle className="mr-2" /> Affirm
                  </Button>
                  <Button onClick={handleSkipAffirmation} variant="outline" className="border-light-primary text-light-primary hover:bg-light-primary/10">
                    <FiArrowRight className="mr-2" /> Skip
                  </Button>
                </>
              )}
              {gamePhase === 'questions' && (
                <Button onClick={handleSubmitResponse} disabled={!currentResponse.trim()}>
                  <FiArrowRight className="mr-2" /> Submit Reflection
                </Button>
              )}
              {gamePhase === 'summary' && (
                <Button onClick={handleResetGame} variant="ghost" className="text-light-body dark:text-dark-body hover:underline">
                  <FiRefreshCcw className="mr-2" /> Play Again
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AffirmationAscent;