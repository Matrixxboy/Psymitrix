import api from './index';

export const addSleepData = async (sleepHours, date) => {
  try {
    const response = await api.post('/user_crud/user/wellness/sleep', { sleep_hours: sleepHours, date });
    return response.data;
  } catch (error) {
    console.error('Error adding sleep data:', error);
    throw error;
  }
};
