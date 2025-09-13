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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl select-none transition duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-[var(--color-primary)] hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    secondary: 'text-[#2C2C2C] dark:text-[var(--color-text)] bg-[var(--color-secondary)] hover:brightness-105 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    outline: 'glass-button text-[var(--color-text)] dark:text-[var(--color-text)] bg-transparent hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]',
    danger: 'text-white bg-[var(--color-error)] hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-error)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
  };
  
  const sizes = {
    sm: 'px-3 py-2 sm:py-1.5 text-sm',
    md: 'px-4 py-3 sm:py-2 text-base sm:text-sm',
    lg: 'px-6 py-4 sm:py-3 text-base sm:text-lg font-semibold'
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
