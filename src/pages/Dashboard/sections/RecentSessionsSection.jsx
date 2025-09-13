import React from 'react';

const RecentSessionsSection = () => {
  const sessions = [
    { 
      id: 1, 
      type: 'AI Chat Session', 
      duration: '45 min',
      mood: 'Positive',
      time: '2 hours ago',
      summary: 'Discussed coping strategies for work stress'
    },
    { 
      id: 2, 
      type: 'Anxiety Assessment', 
      duration: '15 min',
      mood: 'Neutral',
      time: '1 day ago',
      summary: 'GAD-7 assessment completed'
    },
    { 
      id: 3, 
      type: 'Mindfulness Game', 
      duration: '20 min',
      mood: 'Calm',
      time: '2 days ago',
      summary: 'Breathing exercise and meditation'
    },
    { 
      id: 4, 
      type: 'Progress Check', 
      duration: '30 min',
      mood: 'Optimistic',
      time: '3 days ago',
      summary: 'Weekly progress review and goal setting'
    }
  ];

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case 'positive':
      case 'optimistic':
        return 'bg-[color-mix(in_oklab,var(--color-secondary),white_85%)] text-[color-mix(in_oklab,var(--color-text),black_20%)]';
      case 'calm':
        return 'bg-[color-mix(in_oklab,var(--color-primary),white_85%)] text-[color-mix(in_oklab,var(--color-text),black_20%)]';
      case 'neutral':
        return 'bg-[rgba(255,255,255,0.6)] text-[var(--color-text)]';
      case 'anxious':
      case 'stressed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-[rgba(255,255,255,0.6)] text-[var(--color-text)]';
    }
  };

  return (
    <div className="glass glass-card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-4">
        Recent Sessions
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1 space-y-1 sm:space-y-0">
                  <p className="text-sm sm:text-base font-medium text-[var(--color-text)]">
                    {session.type}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full w-fit ${getMoodColor(session.mood)}`}>
                    {session.mood}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-1">
                  {session.summary}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Duration: {session.duration}
                </p>
              </div>
              <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] sm:ml-4">
                {session.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSessionsSection;
