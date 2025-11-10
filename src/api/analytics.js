import api from './index.js';

export const analyticsAPI = {
  getInsights: async (timeframe = 'month') => {
    try {
      const response = await api.get(`/ai_analytics/insights`, {
        params: { timeframe }
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  },

  getMoodTrends: async (timeframe = 'month') => {
    try {
      const response = await api.get(`/ai_analytics/mood-trends`, {
        params: { timeframe }
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching mood trends:', error);
      throw error;
    }
  },

  getWellnessSummary: async (timeframe = 'month') => {
    try {
      const response = await api.get(`/ai_analytics/wellness-summary`, {
        params: { timeframe }
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching wellness summary:', error);
      throw error;
    }
  }
};
