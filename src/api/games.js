import api from './index';

export const saveGameData = async (gameData) => {
  try {
    const response = await api.post('/games/data/save', gameData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error saving game data:', error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred while saving game data';
    return { success: false, error: errorMessage };
  }
};