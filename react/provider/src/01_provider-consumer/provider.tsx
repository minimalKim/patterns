import React, { createContext, useState } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextState = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeContext = createContext<ThemeContextState>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>("light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      ${children}
    </ThemeContext.Provider>
  );
}
