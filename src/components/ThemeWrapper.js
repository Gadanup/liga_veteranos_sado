"use client";
import React, { createContext, useContext } from "react";
import { theme } from "../styles/theme";

// Create theme context
const ThemeContext = createContext(theme);

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeWrapper");
  }
  return context;
};

// Theme wrapper component
export const ThemeWrapper = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
