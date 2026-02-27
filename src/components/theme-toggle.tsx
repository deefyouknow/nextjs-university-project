"use client";

import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (  
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface text-muted hover:text-primary border border-muted/20 transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle Theme"
    >
      <FaSun className="w-5 h-5 hidden dark:block text-yellow-400" />
      <FaMoon className="w-5 h-5 block dark:hidden text-primary" />
    </button>
  );
}
