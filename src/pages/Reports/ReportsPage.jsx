import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Loader, TrendingUp, Brain, CheckCircle, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { reportsAPI } from '../../api/reports';
import { analyticsAPI } from '../../api/analytics';
import { recommendationsAPI } from '../../api/recommendations';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/ui/GlassCard';

const ReportsPage = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    loadAllData();
  }, [timeframe]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load analysis
      const analysisData = await reportsAPI.getAnalysis();
      setAnalysis(analysisData);

      // Load AI insights
      try {
        const insightsData = await analyticsAPI.getInsights(timeframe);
        setAiInsights(insightsData);
      } catch (err) {
        console.log('AI insights not available');
      }

      // Load recommendations
      try {
        const recsData = await recommendationsAPI.getPersonalized();
        setRecommendations(recsData);
      } catch (err) {
        console.log('Recommendations not available');
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      const data = await reportsAPI.generateReport({
        includeAssessments: true,
        includeMoodTrends: true,
        includeRecommendations: true,
        dateRangeDays: 30
      });
      setReportFile(data);
    } catch (err) {
      console.error('Failed to generate report:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async () => {
    try {
      if (!reportFile?.file_name) return;
      
      const blob = await reportsAPI.downloadReport(reportFile.file_name);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = reportFile.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Failed to download report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  p-4 md:p-8 flex items-center justify-center mt-[50px]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-light-accent dark:text-dark-accent" />
          <p className="text-light-body dark:text-dark-body">Generating your mental health report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  p-4 md:p-8 flex items-center justify-center mt-[50px]">
        <GlassCard className="p-6 max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={loadAllData}
            className="mt-4 w-full px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 mt-[50px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Brain className="w-8 h-8 text-light-primary dark:text-dark-primary" />
            <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">
              Your Mental Health Report
            </h1>
          </div>
          <p className="text-light-body dark:text-dark-body text-lg max-w-2xl mx-auto">
            Comprehensive AI-driven analysis of your mental wellness journey with personalized insights and actionable recommendations.
          </p>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex gap-3 justify-center flex-wrap"
        >
          {['week', 'month', 'year'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                timeframe === tf
                  ? 'bg-light-primary dark:bg-dark-primary text-white shadow-md'
                  : 'bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-headings dark:text-dark-headings hover:bg-light-secondary/30'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Generate Report Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-light-primary dark:text-dark-primary" />
              <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">
                Download PDF Report
              </h2>
            </div>
            <p className="text-light-body dark:text-dark-body mb-6">
              Generate a detailed PDF report with your mental health analysis, mood trends, assessment results, and professional recommendations. Perfect for sharing with your healthcare provider.
            </p>
            
            {reportFile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    Report Generated Successfully!
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Generated: {new Date(reportFile.generated_at).toLocaleString()}
                  </p>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex items-center gap-2 px-6 py-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {generating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Report
                  </>
                )}
              </button>
            )}
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Analysis Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Summary */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                    <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings">
                      Assessment Summary
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* PHQ-9 */}
                    <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg border border-light-secondary/30 dark:border-dark-secondary/30">
                      <p className="text-light-body/60 dark:text-dark-body/60 text-sm font-semibold mb-2">
                        Depression (PHQ-9)
                      </p>
                      {analysis.assessment_summary?.phq9 ? (
                        <>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-bold text-light-headings dark:text-dark-headings">
                              {analysis.assessment_summary.phq9.latest_score}
                            </span>
                            <span className="text-light-body/60 dark:text-dark-body/60">/27</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-light-body dark:text-dark-body">
                              <span className="font-semibold">Average:</span> {analysis.assessment_summary.phq9.average_score?.toFixed(1) || 'N/A'}
                            </p>
                            <div className="inline-block px-3 py-1 bg-light-primary/20 dark:bg-dark-primary/20 rounded text-xs font-semibold text-light-primary dark:text-dark-primary">
                              {analysis.assessment_summary.phq9.trend || 'Not assessed'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-light-body/70 dark:text-dark-body/70 text-sm">Not yet assessed. Complete your first PHQ-9 to start tracking.</p>
                      )}
                    </div>

                    {/* GAD-7 */}
                    <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg border border-light-secondary/30 dark:border-dark-secondary/30">
                      <p className="text-light-body/60 dark:text-dark-body/60 text-sm font-semibold mb-2">
                        Anxiety (GAD-7)
                      </p>
                      {analysis.assessment_summary?.gad7 ? (
                        <>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-bold text-light-headings dark:text-dark-headings">
                              {analysis.assessment_summary.gad7.latest_score}
                            </span>
                            <span className="text-light-body/60 dark:text-dark-body/60">/21</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-light-body dark:text-dark-body">
                              <span className="font-semibold">Average:</span> {analysis.assessment_summary.gad7.average_score?.toFixed(1) || 'N/A'}
                            </p>
                            <div className="inline-block px-3 py-1 bg-light-accent/20 dark:bg-dark-accent/20 rounded text-xs font-semibold text-light-accent dark:text-dark-accent">
                              {analysis.assessment_summary.gad7.trend || 'Not assessed'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-light-body/70 dark:text-dark-body/70 text-sm">Not yet assessed. Complete your first GAD-7 to start tracking.</p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Mood Analysis */}
            {aiInsights?.mood_analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-6 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                    Mood Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white/10 dark:bg-white/5 rounded-lg">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-xs font-semibold mb-1">Avg Mood Score</p>
                        <p className="text-2xl font-bold text-light-headings dark:text-dark-headings">{aiInsights.mood_analysis.average_mood_score}/10</p>
                      </div>
                      <div className="p-3 bg-white/10 dark:bg-white/5 rounded-lg">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-xs font-semibold mb-1">Trend</p>
                        <p className="text-lg font-bold text-light-primary dark:text-dark-primary capitalize">{aiInsights.mood_analysis.mood_trend}</p>
                      </div>
                      <div className="p-3 bg-white/10 dark:bg-white/5 rounded-lg">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-xs font-semibold mb-1">Stability</p>
                        <p className="text-lg font-bold text-light-accent dark:text-dark-accent">{(10 - aiInsights.mood_analysis.mood_volatility).toFixed(1)}/10</p>
                      </div>
                    </div>
                    <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg border border-light-secondary/30 dark:border-dark-secondary/30">
                      <p className="text-light-body dark:text-dark-body text-sm">
                        <span className="font-semibold">Dominant Mood:</span> <span className="capitalize">{aiInsights.mood_analysis.dominant_mood}</span>
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Wellness Metrics */}
            {aiInsights?.wellness_analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-6">
                    Wellness Metrics
                  </h3>
                  <div className="space-y-4">
                    {aiInsights.wellness_analysis.insights?.map((insight, idx) => (
                      <div key={idx} className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-light-primary dark:text-dark-primary flex-shrink-0 mt-1" />
                        <p className="text-light-body dark:text-dark-body text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Metrics */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h4 className="text-lg font-bold text-light-headings dark:text-dark-headings mb-4">Key Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-light-body/60 dark:text-dark-body/60 font-semibold mb-1">Current Streak</p>
                      <p className="text-2xl font-bold text-light-primary dark:text-dark-primary">{user.streak}</p>
                      <p className="text-xs text-light-body/70 dark:text-dark-body/70">days</p>
                    </div>
                    <div>
                      <p className="text-xs text-light-body/60 dark:text-dark-body/60 font-semibold mb-1">Assessments Done</p>
                      <p className="text-2xl font-bold text-light-accent dark:text-dark-accent">{user.mental_health_profile.assessment_results.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-light-body/60 dark:text-dark-body/60 font-semibold mb-1">Chat Sessions</p>
                      <p className="text-2xl font-bold text-light-secondary dark:text-dark-secondary">{user.sessions_chat_history.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-light-body/60 dark:text-dark-body/60 font-semibold mb-1">Achievements</p>
                      <p className="text-2xl font-bold text-light-primary dark:text-dark-primary">{user.achievements.length}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Recommended Actions */}
            {recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                    <h4 className="text-lg font-bold text-light-headings dark:text-dark-headings">Weekly Goals</h4>
                  </div>
                  <ul className="space-y-2">
                    {recommendations.weekly_goals?.slice(0, 5).map((goal, idx) => (
                      <li key={idx} className="text-sm text-light-body dark:text-dark-body flex gap-2">
                        <span className="text-light-primary dark:text-dark-primary font-bold">✓</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            )}

            {/* Overall Status */}
            {aiInsights?.overall_insights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-6 border-light-primary/30 dark:border-dark-primary/30">
                  <h4 className="text-lg font-bold text-light-headings dark:text-dark-headings mb-3">Summary</h4>
                  <div className="space-y-2">
                    {aiInsights.overall_insights?.map((insight, idx) => (
                      <p key={idx} className="text-sm text-light-body dark:text-dark-body">• {insight}</p>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
