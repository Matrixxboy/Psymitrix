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
  const baseClasses = 'w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg shadow-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition';
  
  const normalState = 'glass-input text-[var(--color-text)] dark:text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]';
  const errorState = 'glass-input text-[var(--color-text)] dark:text-[var(--color-text)] border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]';

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
