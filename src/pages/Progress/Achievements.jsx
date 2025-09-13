import React from 'react';
import { FiAward, FiStar, FiZap } from 'react-icons/fi';

const Achievements = () => {
  const achievements = [
    { icon: <FiAward />, title: 'First Steps', description: 'Completed your first session.', achieved: Math.random() > 0.5 },
    { icon: <FiStar />, title: 'Consistency King', description: '7-day login streak.', achieved: Math.random() > 0.5 },
    { icon: <FiZap />, title: 'Mindful Master', description: 'Completed 5 breathing exercises.', achieved: Math.random() > 0.5 },
    { icon: <FiAward />, title: 'Insightful', description: 'Completed your first assessment.', achieved: Math.random() > 0.5 },
    { icon: <FiStar />, title: 'Journalist', description: 'Wrote in your journal for 3 days.', achieved: Math.random() > 0.5 },
    { icon: <FiZap />, title: 'Perfect Week', description: 'Logged your mood every day for a week.', achieved: Math.random() > 0.5 },
  ];

  return (
    <div className="space-y-4">
      {achievements.map((achievement, index) => (
        <div 
          key={index}
          className={`flex items-center p-4 rounded-lg transition-all ${
            achievement.achieved 
              ? 'bg-white/30 dark:bg-white/10' 
              : 'bg-white/10 dark:bg-white/5 opacity-60'
          }`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full mr-4 ${
              achievement.achieved 
                ? 'text-warning bg-warning/20' 
                : 'text-light-body dark:text-dark-body bg-white/10'
            }`}
          >
            {achievement.icon}
          </div>
          <div>
            <h4 className="font-semibold text-light-headings dark:text-dark-headings">
              {achievement.title}
            </h4>
            <p className="text-sm text-light-body dark:text-dark-body">
              {achievement.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievements;