import React from "react";
import { ThemeContext, ThemeProvider } from "./provider";

export const LandingPage = () => {
  <ThemeProvider>
    <TopNav />
    <Toggle />
  </ThemeProvider>;
};

const TopNav = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <div
          style={{ backgroundColor: theme === "light" ? "#fff" : "#000 " }}
        />
      )}
    </ThemeContext.Consumer>
  );
};

const Toggle = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <button
          onClick={() => toggleTheme()}
          style={{
            backgroundColor: theme === "light" ? "#fff" : "#000",
            color: theme === "light" ? "#000" : "#fff",
          }}
        >
          Use {theme === "light" ? "Dark" : "Light"} Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
};
