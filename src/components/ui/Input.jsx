// AuthProvider: useEffect - checking for stored auth data.

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
  const baseClasses = 'w-full px-4 py-3 rounded-lg bg-white/10 text-light-headings dark:text-dark-headings placeholder:text-light-body/70 dark:placeholder:text-dark-body/70 border border-white/20 focus:outline-none focus:ring-2 shadow-inner transition-all duration-300';
  
  const normalState = 'focus:ring-light-primary dark:focus:ring-dark-primary';
  const errorState = 'border-error focus:ring-error';

  const classes = `${baseClasses} ${error ? errorState : normalState} ${className}`;
  
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