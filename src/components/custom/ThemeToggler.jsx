import React from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import Button from '../ui/Button';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full text-lg"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

export default ThemeToggler;