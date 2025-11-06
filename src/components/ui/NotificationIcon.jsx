import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, Loader2, CheckCircle2, Circle } from "lucide-react";
import { getNotifications, markNotificationAsSeen } from "../../api/notifications";
import "./NotificationIcon.css";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const iconRef = useRef(null);

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

  /** 🧹 Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (iconRef.current && !iconRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /** 🔔 Handle dropdown toggle */
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
          className="fixed z-50 mt-2 w-80 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
          style={{
            top: iconRef.current.getBoundingClientRect().bottom + 10,
            right:
              window.innerWidth -
              iconRef.current.getBoundingClientRect().right -
              10,
          }}
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Notifications
            </h3>
            {unseenCount > 0 && (
              <span className="text-xs font-semibold text-red-500">
                {unseenCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <div className="flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.notification_id}
                  className={`p-4 flex justify-between items-start transition ${
                    !n.seen
                      ? "bg-blue-50/80 dark:bg-blue-950/30 hover:bg-blue-100/80"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                      {n.notification_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                      {new Date(n.date).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="ml-3 mt-1">
                    {!n.seen ? (
                      <Circle className="h-4 w-4 text-blue-500 fill-blue-500 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  /** 🔔 Bell Icon */
  return (
    <div className="relative" ref={iconRef}>
      <button
        onClick={handleIconClick}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>
      {dropdown}
    </div>
  );
};

export default NotificationIcon;
