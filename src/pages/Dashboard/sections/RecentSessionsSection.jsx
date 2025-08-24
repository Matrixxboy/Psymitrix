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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'calm':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'anxious':
      case 'stressed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Sessions
      </h3>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.type}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getMoodColor(session.mood)}`}>
                    {session.mood}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {session.summary}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Duration: {session.duration}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
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
