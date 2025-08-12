"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 relative hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 border border-transparent hover:border-primary/20 dark:hover:border-primary/30"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-500" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-card/95 dark:bg-card/95 backdrop-blur-sm border border-primary/10 dark:border-primary/20"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
        >
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          <span className={theme === "light" ? "font-semibold text-primary" : ""}>
            Light
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-500" />
          <span className={theme === "dark" ? "font-semibold text-primary" : ""}>
            Dark
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
        >
          <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className={theme === "system" ? "font-semibold text-primary" : ""}>
            System
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
