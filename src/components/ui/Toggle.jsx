
import React from 'react';

const Toggle = ({ enabled, onToggle }) => (
  <div 
    className={`w-12 h-6 flex  items-center rounded-full p-1 cursor-pointer ${enabled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-200 dark:bg-gray-100/30'}`}
    onClick={onToggle}
  >
    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-5' : ''}`}></div>
  </div>
);

export default Toggle;
