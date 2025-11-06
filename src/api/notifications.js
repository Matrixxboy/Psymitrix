
import api from './index';

export const getNotifications = () => {
  return api.get('/notifications/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const markNotificationAsSeen = (id) => {
  return api.post(`/notifications/${id}/seen`);
};
