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
        return 'text-green-600 dark:text-green-400';
      case 'stable':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'concerning':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Mental Health Metrics
      </h3>
      <div className="space-y-4">
        {mentalHealthData.map((item) => (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.metric}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
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
