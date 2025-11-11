import api from './index';

export const getAchievements = async () => {
  try {
    const response = await api.get('/achievements');
    return response.data.data.achievements;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};
