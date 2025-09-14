import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiArrowLeft } from 'react-icons/fi';
import GlassCard from '../../components/ui/GlassCard';
import { getAppData, recordAssessmentResult } from '../../api/data';

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAppData().then((data) => {
      if (mounted) setAssessments(data.assessments || []);
    });
    return () => { mounted = false; };
  }, []);

  const totalScore = useMemo(() => Object.values(answers).reduce((sum, v) => sum + (Number(v) || 0), 0), [answers]);

  const calculateResults = (assessmentId, score) => {
    if (assessmentId === 'phq9') {
      if (score <= 4) return { level: 'Minimal Depression', color: 'success' };
      if (score <= 9) return { level: 'Mild Depression', color: 'warning' };
      if (score <= 14) return { level: 'Moderate Depression', color: 'warning' };
      return { level: 'Severe Depression', color: 'error' };
    } else if (assessmentId === 'gad7') {
      if (score <= 4) return { level: 'Minimal Anxiety', color: 'success' };
      if (score <= 9) return { level: 'Mild Anxiety', color: 'warning' };
      if (score <= 14) return { level: 'Moderate Anxiety', color: 'warning' };
      return { level: 'Severe Anxiety', color: 'error' };
    }
    return { level: 'Result', color: 'success' };
  };

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
    setTimeout(handleNext, 200);
  };

  const handleNext = async () => {
    if (currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const res = calculateResults(selectedAssessment.id, totalScore);
      setResults({ ...res, score: totalScore, max: selectedAssessment.questions.length * 3 });
      await recordAssessmentResult(selectedAssessment.id, totalScore, res.level, answers);
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

  const renderResults = () => (
    <div className="max-w-2xl mx-auto text-center">
      <GlassCard className="p-8">
        <FiCheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
        <h2 className="text-3xl font-bold text-light-headings dark:text-dark-headings mb-2">Assessment Complete</h2>
        {results && (
          <>
            <p className={`text-2xl font-semibold text-${results.color} mb-1`}>{results.level}</p>
            <p className="text-sm text-light-body dark:text-dark-body mb-4">Score: {results.score} / {results.max}</p>
          </>
        )}
        <p className="text-light-body dark:text-dark-body mb-8">Your results have been saved to your progress page.</p>
        <div className="space-y-4">
          <button onClick={resetAssessment} className="w-full px-6 py-3 font-semibold rounded-lg bg-light-primary dark:bg-dark-primary text-white transition-all">Take Another Assessment</button>
          <Link to="/dashboard" className="block w-full px-6 py-3 font-semibold rounded-lg bg-white/20 hover:bg-white/30 transition-all">Back to Dashboard</Link>
        </div>
      </GlassCard>
    </div>
  );

  const renderAssessment = () => {
    const question = selectedAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={resetAssessment} className="flex items-center gap-2 text-light-body dark:text-dark-body font-semibold mb-4">
          <FiArrowLeft /> Back to list
        </button>
        <GlassCard className="p-8">
          <div className="mb-6">
            <p className="text-sm text-light-body dark:text-dark-body mb-2">Question {currentQuestion + 1} of {selectedAssessment.questions.length}</p>
            <div className="w-full bg-white/20 rounded-full h-2.5"><div className="bg-light-primary dark:bg-dark-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
          </div>
          <h2 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-8">{question}</h2>
          <div className="space-y-3">
            {selectedAssessment.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(currentQuestion, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 text-light-headings dark:text-dark-headings
                  ${answers[currentQuestion] === option.value
                    ? 'border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10'
                    : 'border-white/30 dark:border-white/20 bg-white/20 hover:bg-white/30'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  };

  const renderAssessmentList = () => (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">Assessments</h1>
        <p className="mt-2 text-lg text-light-body dark:text-dark-body">Gain insight into your mental well-being.</p>
      </div>
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        {assessments.map((assessment) => (
          <GlassCard key={assessment.id} className="p-6 sm:p-8 flex flex-col">
            <FiClipboard className="w-10 h-10 text-light-primary dark:text-dark-primary mb-4" />
            <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-2">{assessment.title}</h3>
            <p className="text-light-body dark:text-dark-body flex-grow mb-4">{assessment.description}</p>
            <p className="text-sm text-light-body dark:text-dark-body mb-6">Duration: {assessment.duration}</p>
            <button onClick={() => setSelectedAssessment(assessment)} className="w-full mt-auto px-6 py-3 font-semibold rounded-lg bg-light-primary/80 dark:bg-dark-primary/80 text-white transition-all">Start Assessment</button>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {isCompleted ? renderResults() : selectedAssessment ? renderAssessment() : renderAssessmentList()}
    </div>
  );
};

export default AssessmentsPage;
