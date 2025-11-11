import React from 'react';
import { FiStar, FiLock, FiCheckCircle } from 'react-icons/fi';
import GlassCard from '../../components/ui/GlassCard';

const AchievementIcon = ({ achieved, icon }) => {
  const Icon = icon || FiStar;
  return (
    <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
      achieved ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-light-body/50 dark:text-dark-body/50'
    }`}>
      <Icon size={24} />
      {!achieved && <FiLock className="absolute w-4 h-4 text-light-body/30 dark:text-dark-body/30" />}
    </div>
  );
};

const AchievementItem = ({ achievement }) => (
  <div className="flex items-center gap-4 p-3">
    <AchievementIcon achieved={!!achievement.date_earned} />
    <div className="flex-1">
      <h4 className={`font-semibold ${
        achievement.date_earned ? 'text-light-headings dark:text-dark-headings' : 'text-light-body/70 dark:text-dark-body/70'
      }`}>
        {achievement.achievement_name.replace(/_/g, ' ')}
      </h4>
      <p className="text-xs text-light-body/60 dark:text-dark-body/60">{achievement.description}</p>
    </div>
    {achievement.date_earned && (
      <div className="text-right">
        <p className="text-xs font-medium text-green-500 flex items-center gap-1">
          <FiCheckCircle />
          Unlocked
        </p>
        <p className="text-xs text-light-body/50 dark:text-dark-body/50">
          {new Date(achievement.date_earned).toLocaleDateString()}
        </p>
      </div>
    )}
  </div>
);

const Achievements = ({ items = [] }) => {
  // Define a list of all possible achievements
  const allAchievementDefinitions = [
    { achievement_name: "First_Login", description: "You logged in for the first time!" },
    { achievement_name: "7_Day_Streak", description: "Maintained a login streak for 7 consecutive days!" },
    { achievement_name: "14_Day_Streak", description: "Kept up a 2-week login streak!" },
    { achievement_name: "30_Day_Streak", description: "Achieved a 1-month login streak!" },
    { achievement_name: "First_Assessment", description: "Completed your first mental health assessment!" },
    { achievement_name: "Profile_Complete", description: "Completed your user profile!" },
    { achievement_name: "First_Mood_Entry", description: "Tracked your mood for the first time!" },
  ];

  // Create a map of achieved items for quick lookup
  const achievedItemsMap = new Map(items.map(item => [item.achievement_name, item]));

  // Merge the full list with the achieved items
  const allAchievements = allAchievementDefinitions.map(def => {
    return achievedItemsMap.has(def.achievement_name)
      ? achievedItemsMap.get(def.achievement_name)
      : def;
  });

  return (
    <GlassCard className="p-4">
      <div className="space-y-2">
        {allAchievements.map((ach, i) => (
          <AchievementItem key={i} achievement={ach} />
        ))}
      </div>
    </GlassCard>
  );
};

export default Achievements;