'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-card-border glass glow-on-hover transition-all duration-300 text-foreground cursor-pointer focus:outline-none flex items-center justify-center relative overflow-hidden"
      aria-label="Toggle Dark/Light Mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400 rotate-0 scale-100 transition-all duration-500" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-900 rotate-0 scale-100 transition-all duration-500" />
        )}
      </div>
    </button>
  );
}
