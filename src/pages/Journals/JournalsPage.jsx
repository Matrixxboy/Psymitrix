import React from 'react';
import { FiMessageSquare, FiCheckSquare, FiAward } from 'react-icons/fi';
import GlassCard from '../../components/ui/GlassCard';
import { useAuth } from '../../hooks/useAuth';

const JournalsPage = () => {
  const { user } = useAuth();

  // Use actual user sessions if available, otherwise fallback to dummy data
  const sessions = user?.sessions || [
    {
      id: 1,
      type: 'AI Chat Session',
      time: '2023-10-26T10:00:00Z', // Example with full timestamp
      icon: <FiMessageSquare />,
      details: 'Discussed stress management techniques with the AI.',
    },
    {
      id: 2,
      type: 'Anxiety Assessment',
      time: '2023-10-25T14:30:00Z',
      icon: <FiCheckSquare />,
      details: 'Completed GAD-7 assessment. Score: 12 (Moderate Anxiety).',
    },
    {
      id: 3,
      type: 'Mindfulness Game',
      time: '2023-10-24T18:00:00Z',
      icon: <FiAward />,
      details: 'Played "Focus Flow" for 15 minutes. Achieved a new high score!',
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 text-light-body dark:text-dark-body mt-[60px]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-light-headings dark:text-dark-headings tracking-tight mb-6 text-center">
          Your Journals
        </h1>
        <p className="text-lg text-light-body/80 dark:text-dark-body/80 mb-10 text-center">
          A chronological record of your interactions, assessments, and activities.
        </p>

        <div className="space-y-6">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <GlassCard key={session.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-light-secondary/20 dark:bg-dark-secondary/20 mr-4 text-light-secondary dark:text-dark-secondary text-xl">
                      {session.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-light-headings dark:text-dark-headings">{session.type}</h3>
                      <p className="text-sm text-light-body dark:text-dark-body">
                        {new Date(session.time).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-light-body/70 dark:text-dark-body/70 text-base">
                  {session.details || 'No additional details available for this session.'}
                </p>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-6 text-center text-light-body/60 dark:text-dark-body/60">
              <p className="text-lg">No journal entries yet.</p>
              <p className="text-md mt-2">Start interacting with the app to see your journey here!</p>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
};

export default JournalsPage;
