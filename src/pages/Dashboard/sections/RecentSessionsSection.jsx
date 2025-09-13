import React from 'react';
import { FiMessageSquare, FiCheckSquare, FiAward } from 'react-icons/fi';
import GlassCard from '../../../components/ui/GlassCard';

const RecentSessionsSection = () => {
  const sessions = [
    { 
      id: 1, 
      type: 'AI Chat Session', 
      time: '2 hours ago',
      icon: <FiMessageSquare />
    },
    { 
      id: 2, 
      type: 'Anxiety Assessment', 
      time: '1 day ago',
      icon: <FiCheckSquare />
    },
    { 
      id: 3, 
      type: 'Mindfulness Game', 
      time: '2 days ago',
      icon: <FiAward />
    },
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-light-secondary/20 dark:bg-dark-secondary/20 mr-4 text-light-secondary dark:text-dark-secondary">
                {session.icon}
              </div>
              <div>
                <p className="font-semibold text-light-headings dark:text-dark-headings">{session.type}</p>
                <p className="text-sm text-light-body dark:text-dark-body">{session.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default RecentSessionsSection;
