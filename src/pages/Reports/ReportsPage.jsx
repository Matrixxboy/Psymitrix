import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Loader, TrendingUp, Brain } from 'lucide-react';
import { reportsAPI } from '../../api/reports';
import GlassCard from '../../components/ui/GlassCard';

const ReportsPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const data = await reportsAPI.getAnalysis();
      setAnalysis(data);
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
      <div className="min-h-screen bg-gradient-to-br from-light-background to-light-secondary dark:from-dark-background dark:to-dark-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-light-accent dark:text-dark-accent" />
          <p className="text-light-body dark:text-dark-body">Loading your mental health analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-background to-light-secondary dark:from-dark-background dark:to-dark-secondary p-4 md:p-8 flex items-center justify-center">
        <GlassCard className="p-6 max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={loadAnalysis}
            className="mt-4 w-full px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-background to-light-secondary dark:from-dark-background dark:to-dark-secondary p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Brain className="w-8 h-8 text-light-accent dark:text-dark-accent" />
            <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">
              Your Mental Health Report
            </h1>
          </div>
          <p className="text-light-body dark:text-dark-body text-lg">
            Comprehensive insights based on your mental health data
          </p>
        </motion.div>

        {/* Generate Report Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-4">
              Generate Comprehensive Report
            </h2>
            <p className="text-light-body dark:text-dark-body mb-6">
              Create a detailed PDF report with charts, research insights, and personalized recommendations based on your data.
            </p>
            
            {reportFile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
              >
                <p className="text-green-700 dark:text-green-300 font-semibold mb-3">
                  ✅ Report Generated Successfully!
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Generated: {new Date(reportFile.generated_at).toLocaleString()}
                    </p>
                  </div>
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
                className="flex items-center gap-2 px-6 py-3 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Analysis Sections */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Assessment Summary */}
              {Object.keys(analysis.assessment_summary || {}).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-6">
                      <TrendingUp className="w-6 h-6 inline mr-2" />
                      Assessment Summary
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {analysis.assessment_summary.phq9 && (
                        <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg border border-white/20">
                          <p className="text-light-body/60 dark:text-dark-body/60 text-sm mb-2">Depression (PHQ-9)</p>
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-3xl font-bold text-light-headings dark:text-dark-headings">
                              {analysis.assessment_summary.phq9.latest_score}
                            </span>
                            <span className="text-light-body/60 dark:text-dark-body/60">/27</span>
                          </div>
                          <p className="text-sm text-light-body dark:text-dark-body mb-2">
                            Average: {analysis.assessment_summary.phq9.average_score.toFixed(1)}
                          </p>
                          <div className="inline-block px-2 py-1 bg-light-accent/20 dark:bg-dark-accent/20 rounded text-xs font-semibold text-light-accent dark:text-dark-accent">
                            {analysis.assessment_summary.phq9.trend}
                          </div>
                        </div>
                      )}
                      {analysis.assessment_summary.gad7 && (
                        <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg border border-white/20">
                          <p className="text-light-body/60 dark:text-dark-body/60 text-sm mb-2">Anxiety (GAD-7)</p>
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-3xl font-bold text-light-headings dark:text-dark-headings">
                              {analysis.assessment_summary.gad7.latest_score}
                            </span>
                            <span className="text-light-body/60 dark:text-dark-body/60">/21</span>
                          </div>
                          <p className="text-sm text-light-body dark:text-dark-body mb-2">
                            Average: {analysis.assessment_summary.gad7.average_score.toFixed(1)}
                          </p>
                          <div className="inline-block px-2 py-1 bg-light-accent/20 dark:bg-dark-accent/20 rounded text-xs font-semibold text-light-accent dark:text-dark-accent">
                            {analysis.assessment_summary.gad7.trend}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Mood Trends */}
              {analysis.mood_trends && analysis.mood_trends.most_common_mood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GlassCard className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-6">
                      Mood Trends
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg border border-white/20">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-sm mb-2">Most Common Mood</p>
                        <p className="text-3xl font-bold text-light-headings dark:text-dark-headings capitalize">
                          {analysis.mood_trends.most_common_mood}
                        </p>
                      </div>
                      <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg border border-white/20">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-sm mb-2">Current Mood</p>
                        <p className="text-3xl font-bold text-light-headings dark:text-dark-headings capitalize">
                          {analysis.mood_trends.last_recorded}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Research-Based Insights */}
              {analysis.research_based_insights && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlassCard className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-6">
                      Research-Based Insights
                    </h3>
                    <div className="space-y-6">
                      {/* Birth Season */}
                      {analysis.research_based_insights.birth_season?.season !== 'Unknown' && (
                        <div>
                          <h4 className="font-bold text-light-headings dark:text-dark-headings mb-3">
                            Birth Season Profile
                          </h4>
                          <p className="text-light-body dark:text-dark-body mb-3">
                            {analysis.research_based_insights.birth_season.season}
                          </p>
                          <div className="space-y-2">
                            {analysis.research_based_insights.birth_season.characteristics.map((char, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span className="text-light-accent dark:text-dark-accent">✓</span>
                                <p className="text-light-body dark:text-dark-body text-sm">{char}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Birth Order */}
                      {analysis.research_based_insights.birth_order && (
                        <div>
                          <h4 className="font-bold text-light-headings dark:text-dark-headings mb-3">
                            Birth Order Profile
                          </h4>
                          <p className="text-light-body dark:text-dark-body mb-3">
                            {analysis.research_based_insights.birth_order.birth_order}
                          </p>
                          <div className="space-y-2">
                            {analysis.research_based_insights.birth_order.traits.map((trait, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span className="text-light-accent dark:text-dark-accent">→</span>
                                <p className="text-light-body dark:text-dark-body text-sm">{trait}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Blood Type */}
                      {analysis.research_based_insights.blood_type?.blood_group !== 'Unknown' && (
                        <div>
                          <h4 className="font-bold text-light-headings dark:text-dark-headings mb-3">
                            Blood Type Profile (Type {analysis.research_based_insights.blood_type.blood_group})
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-light-body/60 dark:text-dark-body/60 mb-2">Strengths</p>
                              <div className="space-y-1">
                                {analysis.research_based_insights.blood_type.strengths.map((s, idx) => (
                                  <p key={idx} className="text-light-body dark:text-dark-body text-sm">• {s}</p>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-light-body/60 dark:text-dark-body/60 mb-2">Growth Areas</p>
                              <div className="space-y-1">
                                {analysis.research_based_insights.blood_type.growth_areas.map((g, idx) => (
                                  <p key={idx} className="text-light-body dark:text-dark-body text-sm">• {g}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Engagement Stats */}
              {analysis.lifestyle_factors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassCard className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-6">
                      Your Engagement
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-sm">Engagement Level</p>
                        <p className="text-2xl font-bold text-light-headings dark:text-dark-headings mt-1">
                          {analysis.lifestyle_factors.engagement_level}
                        </p>
                      </div>
                      <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-sm">Total Interactions</p>
                        <p className="text-2xl font-bold text-light-headings dark:text-dark-headings mt-1">
                          {analysis.lifestyle_factors.total_interactions}
                        </p>
                      </div>
                      <div className="p-4 bg-white/10 dark:bg-white/5 rounded-lg">
                        <p className="text-light-body/60 dark:text-dark-body/60 text-sm">Sessions Attended</p>
                        <p className="text-2xl font-bold text-light-headings dark:text-dark-headings mt-1">
                          {analysis.lifestyle_factors.session_count}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsPage;
