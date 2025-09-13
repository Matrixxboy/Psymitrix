import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import GlassCard from '../../../components/ui/GlassCard';

const MentalHealthMetricsSection = () => {
  const mentalHealthData = [
    { 
      id: 1, 
      metric: 'Overall Wellness', 
      value: '7.8/10', 
      change: '+0.5', 
      status: 'improving',
    },
    { 
      id: 2, 
      metric: 'Anxiety Level', 
      value: 'Low', 
      change: '-10%', 
      status: 'improving',
    },
    { 
      id: 3, 
      metric: 'Depression Scale', 
      value: 'Mild', 
      change: '+2%', 
      status: 'concerning',
    },
    { 
      id: 4, 
      metric: 'Sleep Quality', 
      value: 'Good', 
      change: '+8%', 
      status: 'improving',
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'improving':
        return <FiTrendingUp className="text-success" />;
      case 'concerning':
        return <FiTrendingDown className="text-error" />;
      default:
        return <FiMinus className="text-warning" />;
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-4">
        Mental Health Metrics
      </h3>
      <div className="space-y-4">
        {mentalHealthData.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-light-primary/20 dark:bg-dark-primary/20 mr-4">
                {getStatusIcon(item.status)}
              </div>
              <div>
                <p className="font-semibold text-light-headings dark:text-dark-headings">{item.metric}</p>
                <p className="text-sm text-light-body dark:text-dark-body">{item.value}</p>
              </div>
            </div>
            <p className={`font-semibold ${item.status === 'improving' ? 'text-success' : item.status === 'concerning' ? 'text-error' : 'text-warning'}`}>
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default MentalHealthMetricsSection;
