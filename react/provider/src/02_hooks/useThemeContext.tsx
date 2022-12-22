import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextState = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeContext = createContext<ThemeContextState>({
  theme: "light",
  toggleTheme: () => {},
});

function useTheme(): ThemeContextState {
  const [theme, setTheme] = useState<ThemeMode>("light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return { theme, toggleTheme };
}

export function useThemeContext() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return { theme, toggleTheme };
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      ${children}
    </ThemeContext.Provider>
  );
}
