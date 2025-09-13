import React from 'react';
import { FiBell, FiMoon, FiSun, FiTarget } from 'react-icons/fi';

const SettingsSection = () => {

  const Toggle = ({ enabled }) => (
    <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${enabled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-white/30'}`}>
      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-5' : ''}`}></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Theme Switcher */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
        <div className="flex items-center">
          <FiMoon className="mr-4" />
          <div>
            <h4 className="font-semibold text-light-headings dark:text-dark-headings">Dark Mode</h4>
            <p className="text-sm text-light-body dark:text-dark-body">Toggle between light and dark themes.</p>
          </div>
        </div>
        <Toggle enabled={document.documentElement.classList.contains('dark')} />
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
        <Toggle enabled={true} />
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
