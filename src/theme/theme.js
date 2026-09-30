import { createTheme } from "@mui/material/styles";

/**
 * The app's MUI theme.
 *
 * Until now no ThemeProvider was mounted at all, so every MUI component ran on
 * MUI's default theme while the app's own colours lived in a plain object in
 * styles/theme.js, applied by hand through sx and inline style. That is why
 * breakpoints drifted: components picked their own numbers (768 mostly) with
 * nothing to check them against.
 *
 * This theme deliberately **mirrors the current look** rather than introducing
 * the redesign palette from reference/screen-specs.md. Nothing should change
 * visually when it is mounted — the redesign lands page by page in Phase 4.
 *
 * Breakpoints are MUI's defaults, which is also what screen-specs.md §0
 * specifies: xs/sm are the mobile layout, md and up is desktop.
 */

// Kept in step with styles/theme.js until that file goes away (C11).
const PURPLE = "#6b4ba1";
const PURPLE_LIGHT = "#8f73c2";
const PURPLE_DARK = "#5a3d87";
const GOLD = "#ffd700";

export const theme = createTheme({
  breakpoints: {
    // Explicit rather than implicit: these are the only breakpoints the app
    // may use. xs 0–599 · sm 600–899 (still mobile) · md 900+ · lg 1200+
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },

  palette: {
    primary: {
      main: PURPLE,
      light: PURPLE_LIGHT,
      dark: PURPLE_DARK,
      contrastText: "#ffffff",
    },
    secondary: {
      main: GOLD,
      light: "#ffe89d",
      dark: "#e6c200",
      // Gold needs dark text on it; #1f2937 is the app's primary text colour.
      contrastText: "#1f2937",
    },
    success: { main: "#16a34a" },
    error: { main: "#dc2626" },
    warning: { main: "#ea580c" },
    info: { main: "#0284c7" },
    background: { default: "#f3f2f5", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#6b7280", disabled: "#9ca3af" },
    divider: "#e5e7eb",
  },

  typography: {
    // The Geist faces are loaded by next/font in the root layout, which
    // exposes them as CSS variables.
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  },

  shape: { borderRadius: 12 },
});

export default theme;
