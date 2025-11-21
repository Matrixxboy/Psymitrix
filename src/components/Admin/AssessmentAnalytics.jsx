import {React,  useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, BarChart2 } from 'lucide-react'; // Import Lucide icons
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AssessmentAnalytics = ({ data, moodData }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const assessmentNames = data.assessments ? Object.keys(data.assessments) : [];

  // Prepare mood chart data
  const moodChartData = moodData && moodData.mood_distribution ? 
    Object.entries(moodData.mood_distribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count
    })) : [];

  const MOOD_COLORS = {
    excited: '#FFD700',
    happy: '#3CB371',
    calm: '#4682B4',
    neutral: '#A9A9A9',
    sad: '#B0C4DE',
    angry: '#DC143C'
  };

  const getMoodColor = (moodName) => {
    const moodKey = moodName.toLowerCase();
    return MOOD_COLORS[moodKey] || '#A5645A';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Assessment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assessmentNames.map((name, idx) => {
          const assessment = data.assessments[name];
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedAssessment(selectedAssessment === name ? null : name)}
              className="glass dark:glass-dark rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all"
            >
              <h3 className="text-sm font-semibold text-light-body dark:text-dark-body mb-2">
                {name}
              </h3>
              <p className="text-3xl font-bold text-light-accent dark:text-dark-accent mb-2">
                {assessment.total_completed}
              </p>
              <p className="text-xs text-light-body dark:text-dark-body">
                Avg Score: <span className="font-bold">{assessment.average_score}</span>
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Assessment Details */}
      {selectedAssessment && data.assessments[selectedAssessment] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass dark:glass-dark rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
            {selectedAssessment} - Severity Breakdown
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(data.assessments[selectedAssessment].severity_breakdown || {}).map(([severity, count]) => (
              <div key={severity} className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg text-center">
                <p className="text-light-body dark:text-dark-body text-sm font-semibold mb-1">
                  {severity}
                </p>
                <p className="text-2xl font-bold text-light-accent dark:text-dark-accent">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mood Distribution Chart */}
      <div className="glass dark:glass-dark rounded-xl p-6">
        <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">
          <Smile size={20} /> Mood Distribution (All Time)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            {moodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getMoodColor(entry.name.toLowerCase())} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} entries`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-light-body dark:text-dark-body">
                No mood data available
              </div>
            )}
          </div>

          {/* Mood Statistics */}
          <div>
            <h4 className="text-md font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">
              <BarChart2 size={18} /> Mood Statistics
            </h4>
            
            <div className="space-y-3">
              {moodChartData.map((mood, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-light-body dark:text-dark-body text-sm">
                      {mood.name}
                    </span>
                    <span className="font-bold text-light-accent dark:text-dark-accent">
                      {mood.value} ({moodData.mood_percentages && moodData.mood_percentages[mood.name.toLowerCase()] || 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-light-secondary/20 dark:bg-dark-secondary/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(moodData.mood_percentages && moodData.mood_percentages[mood.name.toLowerCase()] || 0)}%`,
                        backgroundColor: getMoodColor(mood.name.toLowerCase())
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-light-secondary/20 dark:border-dark-secondary/20">
              <p className="text-light-body dark:text-dark-body text-sm">
                <span className="font-semibold">Total Mood Entries:</span> {moodData.total_mood_entries || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentAnalytics;
