"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

function ThemeCookieSync({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    if (currentTheme) {
      document.cookie = `theme=${currentTheme}; path=/; max-age=31536000`;
    }
  }, [theme, resolvedTheme]);

  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeCookieSync>
        {children}
      </ThemeCookieSync>
    </NextThemesProvider>
  );
}
