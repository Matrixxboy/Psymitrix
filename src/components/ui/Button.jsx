import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg select-none transition duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-light-primary dark:bg-dark-primary hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary',
    secondary: 'text-white bg-light-secondary dark:bg-dark-secondary hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-light-secondary dark:focus:ring-dark-secondary',
    outline: 'bg-white/20 hover:bg-white/30 text-light-headings dark:text-dark-headings focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary',
    danger: 'text-white bg-error hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-error'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;