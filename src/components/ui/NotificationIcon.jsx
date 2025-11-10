import React, { useState, useEffect, useRef } from "react";
import { Bell, Loader2, CheckCircle2, Circle, BellOff } from "lucide-react";
import NotificationDetails from "./NotificationDetails";
import { getNotifications, markNotificationAsSeen } from "../../api/notifications";
import { useAuth } from "../../hooks/useAuth";

const NotificationIcon = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const containerRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (!user?.notifications_enabled) return;

    const fetchNotifications = async () => {
      // Only show loader on initial fetch
      if (notifications.length === 0) {
        setLoading(true);
      }
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

    fetchNotifications(); // Initial fetch

    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        detailsRef.current &&
        !detailsRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.seen) {
      try {
        await markNotificationAsSeen(notification.notification_id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === notification.notification_id
              ? { ...n, seen: true }
              : n
          )
        );
        setUnseenCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error("Error marking notification as seen:", error);
      }
    }
  };

  const handleCloseNotificationDetails = () => {
    setSelectedNotification(null);
  };

  const handleIconClick = async () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && unseenCount > 0) {
      const unseen = notifications.filter((n) => !n.seen);
      await Promise.all(
        unseen.map((n) =>
          markNotificationAsSeen(n.notification_id).catch((err) =>
            console.error("Error marking seen:", err)
          )
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnseenCount(0);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={user.notifications_enabled ? handleIconClick : () => {}}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
        disabled={!user.notifications_enabled}
      >
        {user.notifications_enabled ? <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" /> : <BellOff className="h-6 w-6 text-gray-400 dark:text-gray-500" />}
        {user.notifications_enabled && unseenCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>

      {user.notifications_enabled && isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 sm:w-96 max-h-[80vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-50 animate-slideFadeIn"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unseenCount > 0 && (
              <span className="text-sm font-medium text-red-500">
                {unseenCount} new
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="animate-spin h-6 w-6 mr-3 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <button
                  key={n.notification_id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    !n.seen ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {n.notification_name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {new Date(n.date).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {!n.seen ? (
                        <Circle className="h-3 w-3 text-blue-500 fill-current" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}

      <NotificationDetails
        ref={detailsRef}
        notification={selectedNotification}
        onClose={handleCloseNotificationDetails}
      />
    </div>
  );
};

export default NotificationIcon;
