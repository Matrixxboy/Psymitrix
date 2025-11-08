import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDetails = React.forwardRef(({ notification, onClose }, ref) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!notification) return null;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          ref={ref}
          key="notification-modal"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 sm:mx-0 border border-gray-200/50 dark:border-gray-700/50 relative"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notification Details
              </h3>
              <button
                onClick={onClose}
                aria-label="Close notification details"
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Body */}
            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {notification.message}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    notification.status === "unread"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                  }`}
                >
                  {notification.status}
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(notification.date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

NotificationDetails.displayName = "NotificationDetails";

export default NotificationDetails;
