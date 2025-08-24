// Mock mental health sessions API
export const getMentalHealthSessions = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: [
      {
        id: 1,
        type: 'AI Chat Session',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        duration: 45,
        mood: 'Positive',
        summary: 'Discussed coping strategies for work stress',
        insights: ['User showed good emotional regulation', 'Recommended mindfulness exercises'],
        mentalStateScore: 7.5
      },
      {
        id: 2,
        type: 'Anxiety Assessment',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        duration: 15,
        mood: 'Neutral',
        summary: 'GAD-7 assessment completed',
        insights: ['Anxiety levels within normal range', 'Continue current coping strategies'],
        mentalStateScore: 6.8
      },
      {
        id: 3,
        type: 'Mindfulness Game',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 20,
        mood: 'Calm',
        summary: 'Breathing exercise and meditation',
        insights: ['Excellent breathing technique', 'Stress levels decreased significantly'],
        mentalStateScore: 8.2
      }
    ]
  };
};

export const saveMoodEntry = async (moodData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    success: true,
    data: {
      id: Date.now(),
      ...moodData,
      timestamp: new Date()
    }
  };
};

export const saveAssessmentResults = async (assessmentData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      id: Date.now(),
      ...assessmentData,
      timestamp: new Date(),
      recommendations: generateRecommendations(assessmentData)
    }
  };
};

export const getMentalHealthMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    success: true,
    data: {
      overallWellness: {
        score: 7.2,
        trend: '+0.8',
        description: 'Based on last 7 sessions'
      },
      anxiety: {
        level: 'Moderate',
        change: '-12%',
        description: 'Decreased from last week'
      },
      depression: {
        level: 'Mild',
        change: '-8%',
        description: 'PHQ-9 Score: 6'
      },
      sleepQuality: {
        level: 'Good',
        change: '+15%',
        description: 'Average 7.2 hours'
      }
    }
  };
};

const generateRecommendations = (assessmentData) => {
  const recommendations = [];
  
  if (assessmentData.type === 'phq9' && assessmentData.score > 10) {
    recommendations.push('Consider speaking with the AI therapist about depression management');
    recommendations.push('Try daily mood tracking to identify patterns');
  }
  
  if (assessmentData.type === 'gad7' && assessmentData.score > 8) {
    recommendations.push('Practice breathing exercises when feeling anxious');
    recommendations.push('Consider progressive muscle relaxation techniques');
  }
  
  return recommendations;
};
