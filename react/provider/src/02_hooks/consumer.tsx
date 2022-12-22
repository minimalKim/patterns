import React from "react";
import { ThemeProvider } from "./useThemeContext";
import { useThemeContext } from "./useThemeContext";

export const LandingPage = () => {
  <ThemeProvider>
    <TopNav />
    <Toggle />
  </ThemeProvider>;
};

const TopNav = () => {
  const { theme } = useThemeContext();
  return (
    <div
      style={{ backgroundColor: theme === "light" ? "#fff" : "#000 " }}
    ></div>
  );
};

const Toggle = () => {
  const { theme, toggleTheme } = useThemeContext();
  return (
    <button
      onClick={() => toggleTheme()}
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#000",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Use {theme === "light" ? "Dark" : "Light"} Theme
    </button>
  );
};
