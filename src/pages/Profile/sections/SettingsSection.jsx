import React, { useState } from 'react';
import { FiBell, FiMoon, FiSun, FiTarget } from 'react-icons/fi';
import Toggle from '../../../components/ui/Toggle';
import { useTheme } from '../../../providers/ThemeProvider';
import { useAuth } from '../../../hooks/useAuth';
import { enableNotifications, disableNotifications } from '../../../api/notifications';

const SettingsSection = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notifications_enabled || false);

  const handleNotificationsToggle = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus); // Optimistic UI update

    try {
      if (newStatus) {
        await enableNotifications();
      } else {
        await disableNotifications();
      }
      // The user object in context will be updated eventually,
      // but the UI already reflects the change.
      await updateUser({ ...user, notifications_enabled: newStatus });
    } catch (error) {
      console.error('Failed to update notification status', error);
      // Revert UI change on error
      setNotificationsEnabled(!newStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Switcher */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
        <div className="flex items-center">
          {theme === 'dark' ? <FiSun className="mr-4" /> : <FiMoon className="mr-4" />}
          <div>
            <h4 className="font-semibold text-light-headings dark:text-dark-headings">Dark Mode</h4>
            <p className="text-sm text-light-body dark:text-dark-body">Toggle between light and dark themes.</p>
          </div>
        </div>
        <Toggle enabled={theme === 'dark'} onToggle={toggleTheme} />
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
        <div className="flex items-center">
          <FiBell className="mr-4" />
          <div>
            <h4 className="font-semibold text-light-headings dark:text-dark-headings">Notifications</h4>
            <p className="text-sm text-light-body dark:text-dark-body">Enable or disable push notifications.</p>
          </div>
        </div>
        <Toggle enabled={notificationsEnabled} onToggle={handleNotificationsToggle} />
      </div>

      {/* Goal Customization */}
      <div className="p-4 rounded-lg bg-white/20">
        <div className="flex items-center">
          <FiTarget className="mr-4" />
          <div>
            <h4 className="font-semibold text-light-headings dark:text-dark-headings">Personal Goal</h4>
            <p className="text-sm text-light-body dark:text-dark-body">What do you want to focus on?</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-center text-light-body dark:text-dark-body">
          <p>Coming Soon!</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
