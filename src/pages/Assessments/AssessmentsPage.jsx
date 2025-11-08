import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader, TrendingDown } from 'lucide-react';
import { assessmentsAPI } from '../../api/assessments';
import GlassCard from '../../components/ui/GlassCard';

const AssessmentsPage = () => {
  const [activeTab, setActiveTab] = useState('select');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previousResults, setPreviousResults] = useState([]);

  useEffect(() => {
    loadPreviousResults();
  }, []);

  const loadPreviousResults = async () => {
    try {
      const data = await assessmentsAPI.getAssessmentResults();
      setPreviousResults(data?.results || []);
    } catch (error) {
      console.error('Failed to load previous results:', error);
    }
  };

  const loadAssessment = async (type) => {
    try {
      setLoading(true);
      const data = type === 'PHQ-9'
        ? await assessmentsAPI.getPHQ9Questions()
        : await assessmentsAPI.getGAD7Questions();
      
      setSelectedAssessment(type);
      setQuestions(data.questions || []);
      setResponses(new Array(data.questions?.length || 0).fill(0));
      setActiveTab('questionnaire');
    } catch (error) {
      console.error('Failed to load assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const submitAssessment = async () => {
    try {
      setLoading(true);
      const data = await assessmentsAPI.submitAssessment(selectedAssessment, responses);
      setResult(data);
      setActiveTab('result');
      loadPreviousResults();
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    const answered = responses.filter(r => r !== 0).length;
    return (answered / responses.length) * 100;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      none: 'text-green-500',
      minimal: 'text-blue-500',
      mild: 'text-yellow-500',
      moderate: 'text-orange-500',
      moderately_severe: 'text-red-500',
      severe: 'text-red-700'
    };
    return colors[severity] || 'text-gray-500';
  };

  const getSeverityBg = (severity) => {
    const colors = {
      none: 'bg-green-100 dark:bg-green-900/30',
      minimal: 'bg-blue-100 dark:bg-blue-900/30',
      mild: 'bg-yellow-100 dark:bg-yellow-900/30',
      moderate: 'bg-orange-100 dark:bg-orange-900/30',
      moderately_severe: 'bg-red-100 dark:bg-red-900/30',
      severe: 'bg-red-200 dark:bg-red-900/50'
    };
    return colors[severity] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-background to-light-secondary dark:from-dark-background dark:to-dark-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings mb-3">
            Mental Health Assessments
          </h1>
          <p className="text-light-body dark:text-dark-body text-lg">
            Track your mental well-being with validated assessments
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Assessment Selection Tab */}
          {activeTab === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Assessment Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    type: 'PHQ-9',
                    title: 'Depression Assessment',
                    description: 'Patient Health Questionnaire (PHQ-9)',
                    duration: '2-3 minutes',
                    icon: '😔'
                  },
                  {
                    type: 'GAD-7',
                    title: 'Anxiety Assessment',
                    description: 'Generalized Anxiety Disorder (GAD-7)',
                    duration: '2-3 minutes',
                    icon: '😰'
                  }
                ].map((assessment) => (
                  <motion.div
                    key={assessment.type}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => loadAssessment(assessment.type)}
                    className="cursor-pointer"
                  >
                    <GlassCard className="p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all">
                      <div>
                        <div className="text-4xl mb-3">{assessment.icon}</div>
                        <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-2">
                          {assessment.title}
                        </h3>
                        <p className="text-light-body dark:text-dark-body mb-3">
                          {assessment.description}
                        </p>
                        <p className="text-sm text-light-body/60 dark:text-dark-body/60">
                          ⏱️ Takes about {assessment.duration}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-light-accent dark:text-dark-accent font-semibold">
                        Start <ArrowRight className="w-5 h-5" />
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Previous Results */}
              {previousResults.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold text-light-headings dark:text-dark-headings mb-4">
                    Your Previous Results
                  </h3>
                  <div className="space-y-3">
                    {previousResults.slice(0, 5).map((result, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/10 dark:bg-white/5 rounded-lg">
                        <div>
                          <p className="font-semibold text-light-headings dark:text-dark-headings">
                            {result.assessment_type}
                          </p>
                          <p className="text-sm text-light-body/60 dark:text-dark-body/60">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`font-bold ${getSeverityColor(result.severity_level)}`}>
                          Score: {result.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {/* Questionnaire Tab */}
          {activeTab === 'questionnaire' && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => {
                        setActiveTab('select');
                        setQuestions([]);
                        setResponses([]);
                      }}
                      className="text-light-primary dark:text-dark-primary hover:opacity-70 transition-opacity"
                    >
                      ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">
                      {selectedAssessment}
                    </h2>
                    <div className="w-12" /> {/* Spacer for centering */}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      className="h-full bg-light-accent dark:bg-dark-accent"
                    />
                  </div>
                  <p className="text-sm text-light-body/60 dark:text-dark-body/60 mt-2">
                    {responses.filter(r => r !== 0).length} of {responses.length} answered
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-white/10 dark:bg-white/5 p-4 rounded-lg mb-6 border border-white/20">
                  <p className="text-light-body dark:text-dark-body text-sm">
                    <strong>Instructions:</strong> Over the last 2 weeks, how often have you been bothered by the following issues? Please rate each item from 0 (Not at all) to 3 (Nearly every day).
                  </p>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {questions.map((question, idx) => (
                    <motion.div
                      key={question.question_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="space-y-2"
                    >
                      <label className="block font-semibold text-light-headings dark:text-dark-headings">
                        {idx + 1}. {question.question_text}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((value) => (
                          <button
                            key={value}
                            onClick={() => updateResponse(idx, value)}
                            className={`p-3 rounded-lg transition-all ${
                              responses[idx] === value
                                ? 'bg-light-accent dark:bg-dark-accent text-white'
                                : 'bg-white/10 dark:bg-white/5 text-light-body dark:text-dark-body hover:bg-white/20 dark:hover:bg-white/10'
                            }`}
                          >
                            <div className="text-xl font-bold">{value}</div>
                            <div className="text-xs mt-1">
                              {['Not', 'Few', 'Half', 'Most'][value]}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('select');
                      setQuestions([]);
                      setResponses([]);
                    }}
                    className="flex-1 px-6 py-3 rounded-lg bg-white/10 dark:bg-white/5 text-light-body dark:text-dark-body hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitAssessment}
                    disabled={loading || responses.every(r => r === 0)}
                    className="flex-1 px-6 py-3 rounded-lg bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Submit Assessment
                      </>
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Result Tab */}
          {activeTab === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Results Card */}
              <GlassCard className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="inline-block"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-light-headings dark:text-dark-headings mb-2">
                    Assessment Complete!
                  </h2>
                </div>

                {/* Score Summary */}
                <div className={`p-6 rounded-lg ${getSeverityBg(result.severity_level)} mb-6`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-light-body/60 dark:text-dark-body/60 mb-1">Assessment Type</p>
                      <p className="text-2xl font-bold text-light-headings dark:text-dark-headings">
                        {result.assessment_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-light-body/60 dark:text-dark-body/60 mb-1">Total Score</p>
                      <p className={`text-2xl font-bold ${getSeverityColor(result.severity_level)}`}>
                        {result.total_score}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Severity Level */}
                <div className="mb-6">
                  <p className="text-sm text-light-body/60 dark:text-dark-body/60 mb-2">Severity Level</p>
                  <p className={`text-xl font-bold capitalize ${getSeverityColor(result.severity_level)}`}>
                    {result.severity_level.replace('_', ' ')}
                  </p>
                </div>

                {/* Interpretation */}
                <div className="bg-white/10 dark:bg-white/5 p-4 rounded-lg mb-6 border border-white/20">
                  <h3 className="font-semibold text-light-headings dark:text-dark-headings mb-2">What This Means</h3>
                  <p className="text-light-body dark:text-dark-body">
                    {result.interpretation}
                  </p>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold text-light-headings dark:text-dark-headings mb-3">
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-3 p-3 bg-white/10 dark:bg-white/5 rounded-lg"
                      >
                        <span className="text-light-accent dark:text-dark-accent flex-shrink-0">✓</span>
                        <p className="text-light-body dark:text-dark-body">{rec}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveTab('select');
                    setResult(null);
                    setQuestions([]);
                    setResponses([]);
                  }}
                  className="flex-1 px-6 py-3 rounded-lg bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-colors"
                >
                  Take Another Assessment
                </button>
                <button
                  onClick={() => window.location.href = '/progress'}
                  className="flex-1 px-6 py-3 rounded-lg bg-white/10 dark:bg-white/5 text-light-body dark:text-dark-body border border-white/20 hover:bg-white/20 transition-colors"
                >
                  View Progress
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssessmentsPage;
