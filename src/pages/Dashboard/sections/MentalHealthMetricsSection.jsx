import React from 'react';

const MentalHealthMetricsSection = () => {
  const mentalHealthData = [
    { 
      id: 1, 
      metric: 'Overall Wellness Score', 
      value: '7.2/10', 
      change: '+0.8', 
      status: 'improving',
      description: 'Based on last 7 sessions'
    },
    { 
      id: 2, 
      metric: 'Anxiety Level', 
      value: 'Moderate', 
      change: '-12%', 
      status: 'improving',
      description: 'Decreased from last week'
    },
    { 
      id: 3, 
      metric: 'Depression Scale', 
      value: 'Mild', 
      change: '-8%', 
      status: 'improving',
      description: 'PHQ-9 Score: 6'
    },
    { 
      id: 4, 
      metric: 'Sleep Quality', 
      value: 'Good', 
      change: '+15%', 
      status: 'improving',
      description: 'Average 7.2 hours'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'improving':
        return 'text-[var(--color-success)]';
      case 'stable':
        return 'text-[var(--color-warning)]';
      case 'concerning':
        return 'text-[var(--color-error)]';
      default:
        return 'text-[var(--color-text-secondary)]';
    }
  };

  return (
    <div className="glass glass-card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-4">
        Mental Health Metrics
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {mentalHealthData.map((item) => (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-[var(--color-text)]">
                  {item.metric}
                </p>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  {item.description}
                </p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-sm sm:text-base font-semibold text-[var(--color-text)]">
                  {item.value}
                </p>
                <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentalHealthMetricsSection;
