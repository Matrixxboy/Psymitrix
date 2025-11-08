
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

export const getNotificationStatus = () => {
  return api.get('/notifications/status');
};

export const enableNotifications = () => {
  return api.post('/notifications/enable');
};

export const disableNotifications = () => {
  return api.post('/notifications/disable');
};
