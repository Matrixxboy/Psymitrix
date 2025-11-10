import api from './index.js';

export const recommendationsAPI = {
  getPersonalized: async () => {
    try {
      const response = await api.get(`/recommendations/personalized`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      throw error;
    }
  },

  getQuickSuggestions: async (area = 'all') => {
    try {
      const response = await api.get(`/recommendations/quick-suggestions`, {
        params: { area }
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching quick suggestions:', error);
      throw error;
    }
  }
};
