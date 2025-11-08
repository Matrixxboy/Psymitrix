import api from './index';

const REPORTS_BASE = '/reports';

export const reportsAPI = {
  // Generate mental health report
  generateReport: async (options = {}) => {
    try {
      const response = await api.post(`${REPORTS_BASE}/generate`, {
        include_assessments: options.includeAssessments !== false,
        include_mood_trends: options.includeMoodTrends !== false,
        include_recommendations: options.includeRecommendations !== false,
        date_range_days: options.dateRangeDays || 30
      });
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
  },

  // Download report
  downloadReport: async (fileName) => {
    try {
      const response = await api.get(`${REPORTS_BASE}/download/${fileName}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download report');
    }
  },

  // Get mental health analysis
  getAnalysis: async () => {
    try {
      const response = await api.get(`${REPORTS_BASE}/analysis`);
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analysis');
    }
  }
};
