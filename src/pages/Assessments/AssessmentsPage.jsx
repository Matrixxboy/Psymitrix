import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const AssessmentsPage = () => {
  const { user, logout } = useAuth();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const assessments = [
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Assessment',
      description: 'A 9-question screening tool for depression',
      duration: '5-10 minutes',
      questions: [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling or staying asleep, or sleeping too much',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself',
        'Trouble concentrating on things',
        'Moving or speaking slowly, or being fidgety',
        'Thoughts that you would be better off dead'
      ],
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'A 7-question screening tool for anxiety',
      duration: '3-5 minutes',
      questions: [
        'Feeling nervous, anxious, or on edge',
        'Not being able to stop or control worrying',
        'Worrying too much about different things',
        'Trouble relaxing',
        'Being so restless that it\'s hard to sit still',
        'Becoming easily annoyed or irritable',
        'Feeling afraid as if something awful might happen'
      ],
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    }
  ];

  const calculateResults = (assessmentId, answers) => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    
    if (assessmentId === 'phq9') {
      if (totalScore <= 4) return { level: 'Minimal', color: 'green', description: 'Minimal depression symptoms' };
      if (totalScore <= 9) return { level: 'Mild', color: 'yellow', description: 'Mild depression symptoms' };
      if (totalScore <= 14) return { level: 'Moderate', color: 'orange', description: 'Moderate depression symptoms' };
      if (totalScore <= 19) return { level: 'Moderately Severe', color: 'red', description: 'Moderately severe depression symptoms' };
      return { level: 'Severe', color: 'red', description: 'Severe depression symptoms' };
    } else if (assessmentId === 'gad7') {
      if (totalScore <= 4) return { level: 'Minimal', color: 'green', description: 'Minimal anxiety symptoms' };
      if (totalScore <= 9) return { level: 'Mild', color: 'yellow', description: 'Mild anxiety symptoms' };
      if (totalScore <= 14) return { level: 'Moderate', color: 'orange', description: 'Moderate anxiety symptoms' };
      return { level: 'Severe', color: 'red', description: 'Severe anxiety symptoms' };
    }
  };

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const assessmentResults = calculateResults(selectedAssessment.id, answers);
      setResults(assessmentResults);
      setIsCompleted(true);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResults(null);
  };

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-app">
        <nav className="glass shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                  PsyMitrix
                </Link>
                <nav className="flex space-x-4">
                  <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                    Home
                  </Link>
                  <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                    Dashboard
                  </Link>
                  <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                    AI Chat
                  </Link>
                  <Link to="/assessments" className="text-[var(--color-primary)] font-medium">
                    Assessments
                  </Link>
                  <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                    Profile
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {user?.name}
                </span>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="glass glass-card text-center">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
              Assessment Complete
            </h2>
            <div className="inline-block px-6 py-3 rounded-full text-white font-semibold mb-4" style={{ backgroundColor: (results.color==='green'?'var(--color-success)':results.color==='yellow'||results.color==='orange'?'var(--color-warning)':'var(--color-error)') }}>
              {results.level}
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {results.description}
            </p>
            <div className="space-y-3">
              <Button onClick={resetAssessment} variant="primary" className="w-full">
                Take Another Assessment
              </Button>
              <Link to="/chat">
                <Button variant="secondary" className="w-full">
                  Discuss Results with AI
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (selectedAssessment) {
    const question = selectedAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100;

    return (
      <div className="min-h-screen bg-app">
        <nav className="glass shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                  PsyMitrix
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedAssessment.title}
                </span>
              </div>
              <Button variant="secondary" size="sm" onClick={resetAssessment}>
                Exit Assessment
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Question {currentQuestion + 1} of {selectedAssessment.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-8">
              {question}
            </p>

            <div className="space-y-3">
              {selectedAssessment.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(currentQuestion, option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    answers[currentQuestion] === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQuestion] === option.value
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}></div>
                    <span className="text-gray-900 dark:text-white">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                variant="primary"
              >
                {currentQuestion === selectedAssessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <nav className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-semibold text-[var(--color-text)]">
                PsyMitrix
              </Link>
              <nav className="flex space-x-4">
                <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Home
                </Link>
                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-primary)] font-medium">
                  Assessments
                </Link>
                <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mental Health Assessments
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Take standardized assessments to track your mental health progress
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="glass glass-card">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {assessment.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {assessment.description}
              </p>
              <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-4">
                <span>Duration: {assessment.duration}</span>
              </div>
              <Button
                onClick={() => setSelectedAssessment(assessment)}
                variant="primary"
                className="w-full"
              >
                Start Assessment
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AssessmentsPage;
