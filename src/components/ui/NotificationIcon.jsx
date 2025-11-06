import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, Loader2, CheckCircle2, Circle } from "lucide-react";
import NotificationDetails from "./NotificationDetails";
import { getNotifications, markNotificationAsSeen } from "../../api/notifications";
import "./NotificationIcon.css";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const iconRef = useRef(null);
  const detailsRef = useRef(null);

  /** 🧭 Fetch notifications on mount */
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await getNotifications();
        const data = response?.data?.data?.notifications || [];
        setNotifications(data);
        setUnseenCount(data.filter((n) => !n.seen).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  /** 🧹 Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        iconRef.current &&
        !iconRef.current.contains(e.target) &&
        detailsRef.current &&
        !detailsRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /** 📩 Notification click handler */
  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.seen) {
      try {
        await markNotificationAsSeen(notification.notification_id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === notification.notification_id ? { ...n, seen: true } : n
          )
        );
        setUnseenCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error("Error marking notification as seen:", error);
      }
    }
  };

  /** 🔒 Close notification details */
  const handleCloseNotificationDetails = () => {
    setSelectedNotification(null);
  };

  /** 🔔 Toggle dropdown */
  const handleIconClick = async () => {
    setIsOpen((prev) => !prev);

    // When opening, mark unseen as seen
    if (!isOpen && unseenCount > 0) {
      const unseen = notifications.filter((n) => !n.seen);
      await Promise.all(
        unseen.map((n) =>
          markNotificationAsSeen(n.notification_id).catch((err) =>
            console.error("Error marking seen:", err)
          )
        )
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, seen: true }))
      );
      setUnseenCount(0);
    }
  };

  /** 📦 Dropdown Portal */
  const dropdown = isOpen
    ? createPortal(
        <div
          className="notification-dropdown-container animate-slideFadeIn"
          style={{
            top: `${iconRef.current?.getBoundingClientRect().bottom + 8}px`,
            right: `${window.innerWidth - iconRef.current?.getBoundingClientRect().right - 6}px`,
          }}
        >
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unseenCount > 0 && <span>{unseenCount} new</span>}
          </div>

          <div className="notification-dropdown-body">
            {loading ? (
              <div className="notification-loading">
                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <button
                  key={n.notification_id}
                  onClick={() => handleNotificationClick(n)}
                  className={`notification-item ${
                    !n.seen ? "unseen" : "seen"
                  }`}
                >
                  <div className="notification-text">
                    <p className="notification-title">{n.notification_name}</p>
                    <p className="notification-message">{n.message}</p>
                    <p className="notification-time">
                      {new Date(n.date).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="notification-status">
                    {!n.seen ? (
                      <Circle className="h-4 w-4 text-blue-500 fill-blue-500 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="notification-empty">No new notifications</div>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  /** 🔔 Bell Icon */
  return (
    <div className="notification-icon" ref={iconRef}>
      <button
        onClick={handleIconClick}
        className="notification-bell"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        {unseenCount > 0 && (
          <span className="notification-count">
            <span className="notification-ping"></span>
            <span className="notification-dot"></span>
          </span>
        )}
      </button>
      {dropdown}
      <NotificationDetails
        ref={detailsRef}
        notification={selectedNotification}
        onClose={handleCloseNotificationDetails}
      />
    </div>
  );
};

export default NotificationIcon;
