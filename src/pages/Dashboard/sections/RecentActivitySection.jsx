import React from 'react';

const RecentActivitySection = () => {
  const activities = [
    { id: 1, action: 'User logged in', time: '2 minutes ago' },
    { id: 2, action: 'New patient registered', time: '1 hour ago' },
    { id: 3, action: 'Session completed', time: '3 hours ago' },
    { id: 4, action: 'Report generated', time: '1 day ago' }
  ];

  return (
    <div className="glass glass-card p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {activity.action}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivitySection;
