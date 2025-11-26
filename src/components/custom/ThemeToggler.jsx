import React from 'react';
import { Moon, Sun } from 'lucide-react'; // Import Lucide icons
import { useTheme } from '../../providers/ThemeProvider';
import Button from '../ui/Button';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full text-lg "
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
};

export default ThemeToggler;