
import React from 'react';
import './NotificationDetails.css';

const NotificationDetails = React.forwardRef(({ notification, onClose }, ref) => {
  if (!notification) {
    return null;
  }

  return (
    <div className="notification-details-overlay" ref={ref}>
      <div className="notification-details-panel">
        <div className="notification-details-header">
          <h3 className="text-lg font-semibold text-gray-800">Notification Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="notification-details-content">
          <p className="text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
});

export default NotificationDetails;
