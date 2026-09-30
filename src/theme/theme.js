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
 * Palette and fonts come from the league crest: navy #14334a with gold
 * #c5944c, both sampled from the image itself, and Barlow Condensed over
 * Source Sans 3.
 *
 * Breakpoints are MUI's defaults, which is also what screen-specs.md §0
 * specifies: xs/sm are the mobile layout, md and up is desktop.
 */

// Kept in step with styles/theme.js until that file goes away (C11).
const NAVY = "#14334a";
const NAVY_LIGHT = "#2c5474";
const NAVY_DARK = "#0c1f33";
const GOLD = "#c5944c";

export const theme = createTheme({
  breakpoints: {
    // Explicit rather than implicit: these are the only breakpoints the app
    // may use. xs 0–599 · sm 600–899 (still mobile) · md 900+ · lg 1200+
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },

  palette: {
    primary: {
      main: NAVY,
      light: NAVY_LIGHT,
      dark: NAVY_DARK,
      contrastText: "#ffffff",
    },
    secondary: {
      main: GOLD,
      light: "#e8c37a",
      dark: "#a67044",
      // Gold needs dark text on it; #1f2937 is the app's primary text colour.
      contrastText: "#1f2937",
    },
    success: { main: "#16a34a" },
    error: { main: "#dc2626" },
    warning: { main: "#ea580c" },
    info: { main: "#0284c7" },
    background: { default: "#eef1f5", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#6b7280", disabled: "#9ca3af" },
    divider: "#e5e7eb",
  },

  typography: {
    // The Geist faces are loaded by next/font in the root layout, which
    // exposes them as CSS variables.
    fontFamily: "var(--font-body), system-ui, -apple-system, sans-serif",
    // Condensed display face for headings, as in the crest wordmark.
    h1: { fontFamily: "var(--font-display), sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-display), sans-serif", fontWeight: 700 },
    h3: { fontFamily: "var(--font-display), sans-serif", fontWeight: 700 },
    h4: { fontFamily: "var(--font-display), sans-serif", fontWeight: 700 },
    h5: { fontFamily: "var(--font-display), sans-serif", fontWeight: 600 },
    h6: { fontFamily: "var(--font-display), sans-serif", fontWeight: 600 },
  },

  shape: { borderRadius: 12 },
});

export default theme;
