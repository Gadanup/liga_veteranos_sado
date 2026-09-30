"use client";
import React, { createContext, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../styles/theme";
import { theme as muiTheme } from "../theme/theme";

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

/**
 * Theme wrapper component.
 *
 * Holds both themes for now: MUI's, which until this point was never mounted
 * at all, and the plain object the app reads through sx and inline style.
 * They describe the same colours. The object goes away with C11, and this
 * wrapper is replaced by AppProviders in step 1.3.2.
 */
export const ThemeWrapper = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </ThemeProvider>
  );
};
