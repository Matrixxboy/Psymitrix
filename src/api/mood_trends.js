import api from './index.js';

export const moodTrendsAPI = {
  storeMood: async (mood) => {
    try {
      const response = await api.post('/mood_trends/store', { mood });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error storing mood:', error);
      return { success: false, error: error.message };
    }
  },

  getMoodTrends: async (timeframe = 'month') => {
    try {
      const response = await api.get(`/mood_trends`, {
        params: { timeframe }
      });
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      console.error('Error fetching mood trends:', error);
      return { success: false, error: error.message };
    }
  }
};
