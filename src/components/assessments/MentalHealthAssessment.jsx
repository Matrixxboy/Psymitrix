import React, { useState } from 'react';
import Button from '../ui/Button';

const MentalHealthAssessment = ({ assessment, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mentalStateIndicators, setMentalStateIndicators] = useState({
    stress: 0,
    anxiety: 0,
    mood: 0,
    energy: 0,
    focus: 0
  });

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));

    // Update mental state indicators based on answers
    updateMentalStateIndicators(questionIndex, value);
  };

  const updateMentalStateIndicators = (questionIndex, value) => {
    // This is a simplified algorithm to estimate mental state
    // In a real application, this would be more sophisticated
    const question = assessment.questions[questionIndex];
    
    if (question.includes('nervous') || question.includes('anxious')) {
      setMentalStateIndicators(prev => ({
        ...prev,
        anxiety: Math.max(prev.anxiety, value)
      }));
    }
    
    if (question.includes('depressed') || question.includes('hopeless')) {
      setMentalStateIndicators(prev => ({
        ...prev,
        mood: Math.max(prev.mood, value)
      }));
    }
    
    if (question.includes('tired') || question.includes('energy')) {
      setMentalStateIndicators(prev => ({
        ...prev,
        energy: Math.max(prev.energy, value)
      }));
    }
    
    if (question.includes('concentrating') || question.includes('focus')) {
      setMentalStateIndicators(prev => ({
        ...prev,
        focus: Math.max(prev.focus, value)
      }));
    }
    
    // General stress indicator
    if (value >= 2) {
      setMentalStateIndicators(prev => ({
        ...prev,
        stress: Math.max(prev.stress, value - 1)
      }));
    }
  };

  const calculateMentalState = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = assessment.questions.length * 3; // Assuming max value is 3
    const percentage = (totalScore / maxScore) * 100;
    
    // Calculate overall mental wellness score (inverted since higher assessment scores mean worse symptoms)
    const wellnessScore = Math.max(1, 10 - (percentage / 10));
    
    return {
      wellnessScore: Math.round(wellnessScore * 10) / 10,
      detailedMetrics: {
        anxiety: Math.max(1, 10 - (mentalStateIndicators.anxiety * 2.5)),
        mood: Math.max(1, 10 - (mentalStateIndicators.mood * 2.5)),
        energy: Math.max(1, 10 - (mentalStateIndicators.energy * 2.5)),
        focus: Math.max(1, 10 - (mentalStateIndicators.focus * 2.5)),
        stress: Math.max(1, 10 - (mentalStateIndicators.stress * 2.5))
      },
      recommendations: generateRecommendations(totalScore, mentalStateIndicators)
    };
  };

  const generateRecommendations = (totalScore, indicators) => {
    const recommendations = [];
    
    if (indicators.anxiety >= 2) {
      recommendations.push('Practice deep breathing exercises daily');
      recommendations.push('Consider guided meditation for anxiety management');
    }
    
    if (indicators.mood >= 2) {
      recommendations.push('Engage in regular physical activity');
      recommendations.push('Try journaling to process emotions');
    }
    
    if (indicators.energy <= 1) {
      recommendations.push('Maintain a consistent sleep schedule');
      recommendations.push('Consider light therapy or vitamin D supplementation');
    }
    
    if (indicators.focus >= 2) {
      recommendations.push('Break tasks into smaller, manageable chunks');
      recommendations.push('Try the Pomodoro technique for better focus');
    }
    
    if (totalScore > assessment.questions.length * 1.5) {
      recommendations.push('Consider discussing these results with our AI therapist');
      recommendations.push('Regular check-ins and monitoring may be beneficial');
    }
    
    return recommendations;
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const mentalState = calculateMentalState();
      const results = {
        type: assessment.id,
        score: Object.values(answers).reduce((sum, score) => sum + score, 0),
        answers,
        mentalState,
        timestamp: new Date()
      };
      onComplete(results);
    }
  };

  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const question = assessment.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Mental State Indicators */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Current Mental State Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {Object.entries(mentalStateIndicators).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-gray-600 dark:text-gray-400 capitalize">{key}</div>
              <div className={`font-semibold ${
                value <= 1 ? 'text-green-600' : 
                value <= 2 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {value === 0 ? 'Good' : value <= 1 ? 'Fair' : value <= 2 ? 'Moderate' : 'High'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Over the last 2 weeks, how often have you been bothered by:
        </h2>
        
        <p className="text-lg text-gray-800 dark:text-gray-200 mb-8">
          {question}
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {assessment.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswerSelect(currentQuestion, option.value)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              answers[currentQuestion] === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 shadow-md'
                : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                answers[currentQuestion] === option.value
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {answers[currentQuestion] === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-900 dark:text-white font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onCancel}
          variant="secondary"
        >
          Cancel Assessment
        </Button>
        <Button
          onClick={handleNext}
          disabled={answers[currentQuestion] === undefined}
          variant="primary"
        >
          {currentQuestion === assessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default MentalHealthAssessment;
