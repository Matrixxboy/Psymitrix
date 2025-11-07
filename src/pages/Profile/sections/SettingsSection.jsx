import React from 'react';
import { FiBell, FiMoon, FiSun, FiTarget } from 'react-icons/fi';
import Toggle from '../../../components/ui/Toggle';
import { useTheme } from '../../../providers/ThemeProvider';
import { useAuth } from '../../../hooks/useAuth';
import { enableNotifications, disableNotifications } from '../../../api/notifications';

const SettingsSection = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const handleNotificationsToggle = async () => {
    console.log({ updateUser });
    try {
      const newStatus = !user.notifications_enabled;
      if (newStatus) {
        await enableNotifications();
      } else {
        await disableNotifications();
      }
      await updateUser({ ...user, notifications_enabled: newStatus });
    } catch (error) {
      console.error('Failed to update notification status', error);
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
        <Toggle enabled={user?.notifications_enabled || false} onToggle={handleNotificationsToggle} />
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
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <button className="p-2 rounded-lg bg-light-primary/20 text-light-primary font-semibold">Manage Anxiety</button>
          <button className="p-2 rounded-lg bg-white/20">Improve Sleep</button>
          <button className="p-2 rounded-lg bg-white/20">Build Confidence</button>
          <button className="p-2 rounded-lg bg-white/20">Reduce Stress</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
