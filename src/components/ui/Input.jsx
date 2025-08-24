import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  disabled = false, 
  error = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white';
  
  const classes = `${baseClasses} ${stateClasses} ${className}`;
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
      {...props}
    />
  );
};

export default Input;
