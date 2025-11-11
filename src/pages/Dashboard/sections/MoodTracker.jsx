import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { moodTrendsAPI } from '../../../api/mood_trends';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const moodOptions = [
  { value: 'angry', emoji: '😞', label: 'Angry' },
  { value: 'sad', emoji: '😕', label: 'Sad' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'calm', emoji: '😊', label: 'Calm' },
  { value: 'happy', emoji: '😄', label: 'Happy' },
  { value: 'excited', emoji: '🤩', label: 'Excited' }
];

const moodScores = {
  'angry': 2,
  'sad': 3,
  'neutral': 5,
  'calm': 7,
  'happy': 8,
  'excited': 10
};

const MoodTracker = ({ mood, setMood, onMoodSaved }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitMood = async () => {
    if (!mood) return;

    setLoading(true);
    setError(null);

    try {
      const response = await moodTrendsAPI.storeMood(mood);
      
      if (response.success) {
        setSubmitted(true);
        if (onMoodSaved) {
          onMoodSaved(mood);
        }
        
        // Reset after 2 seconds
        setTimeout(() => {
          setSubmitted(false);
          setMood('');
        }, 2000);
      } else {
        setError('Failed to save mood. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error submitting mood:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentMoodLabel = mood ? moodOptions.find(m => m.value === mood)?.label : 'Select mood';
  const currentMoodEmoji = mood ? moodOptions.find(m => m.value === mood)?.emoji : '❓';

  return (
    <motion.div variants={cardVariants}>
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-4">
          How are you feeling?
        </h3>

        {/* Mood Display */}
        <div className="mb-4 p-3 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg text-center">
          <span className="text-4xl">{currentMoodEmoji}</span>
          <p className="text-sm text-light-body dark:text-dark-body mt-2 font-semibold">
            {currentMoodLabel}
          </p>
        </div>

        {/* Mood Emojis */}
        <div className="flex items-center justify-between text-3xl px-2 mb-4">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setMood(option.value)}
              className={`transition-transform duration-200 ${
                mood === option.value ? 'scale-125' : 'scale-100 hover:scale-110'
              }`}
              title={option.label}
            >
              {option.emoji}
            </button>
          ))}
        </div>

        {/* Mood Scale */}
        <div className="mb-5">
          <input
            type="range"
            min="1"
            max="6"
            value={mood ? Object.keys(moodOptions).indexOf(moodOptions.findIndex(m => m.value === mood)) + 1 : 0}
            onChange={(e) => {
              const index = parseInt(e.target.value) - 1;
              if (index >= 0 && index < moodOptions.length) {
                setMood(moodOptions[index].value);
              }
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-white/10 accent-light-primary dark:accent-dark-primary"
          />
          <div className="flex justify-between text-xs text-light-body/60 dark:text-dark-body/60 mt-1 px-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitMood}
          disabled={!mood || loading || submitted}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            submitted
              ? 'bg-green-500 dark:bg-green-600 text-white'
              : 'bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : submitted ? (
            <>
              <Check className="w-4 h-4" />
              Mood saved!
            </>
          ) : (
            'Submit Mood'
          )}
        </button>

        {/* Help Text */}
        <p className="text-xs text-light-body/60 dark:text-dark-body/60 mt-3 text-center">
          Track your mood regularly to get better insights
        </p>
      </GlassCard>
    </motion.div>
  );
};

export default MoodTracker;
