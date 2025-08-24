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
      className="fixed top-4 right-4"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

export default ThemeToggler;
