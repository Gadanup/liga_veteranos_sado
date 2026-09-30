// theme.js
export const theme = {
  colors: {
    // Primary colors - navy, sampled from the league crest (#14334a is the
    // median of ~44k blue pixels in it; #0c1f33 is the darkest dominant).
    primary: {
      50: "#f2f5f8", // Very light navy tint
      100: "#e2e9f0", // Light navy tint
      200: "#c6d3e0",
      300: "#9db2c8",
      400: "#5f7f9e",
      500: "#2c5474",
      600: "#14334a", // Main navy
      700: "#0f2941",
      800: "#0c1f33", // App bar / deepest panels
      900: "#071626",
    },

    // Gold, sampled from the crest's frame and lettering (#c5944c is the
    // median of ~21k gold pixels). Never use it as text on white: it only
    // reaches ~2.4:1. As a fill with dark text on it, or as text on the navy,
    // it clears AA comfortably.
    accent: {
      50: "#fdfaf4",
      100: "#faf3e4",
      200: "#f2e2c1",
      300: "#e8c37a", // Light gold (highlights)
      400: "#d9ab60",
      500: "#c5944c", // Main gold
      600: "#a67044", // Dark gold
      700: "#8a5c38",
      800: "#6e482c",
      900: "#523521",
    },

    // Complementary colors - cool blues and teals to balance the warm purples/golds
    secondary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },

    // Success colors - for wins, positive stats (harmonious greens)
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },

    // Warning colors - for draws, cautions (warm oranges that complement gold)
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },

    // Error colors - for losses, negative stats (deep reds)
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },

    // Neutral colors - carefully chosen to work with purple/gold theme
    neutral: {
      50: "#fafafa", // Pure light
      100: "#f5f5f5", // Very light gray
      200: "#e5e5e5", // Light gray
      300: "#d4d4d4", // Medium-light gray
      400: "#a3a3a3", // Medium gray
      500: "#737373", // Medium-dark gray
      600: "#525252", // Dark gray
      700: "#404040", // Very dark gray
      800: "#262626", // Almost black
      900: "#171717", // Deep black
    },

    // Background colors - optimized for the purple/gold theme
    background: {
      primary: "#ffffff", // Pure white
      secondary: "#fafafa", // Very light gray
      tertiary: "#f7f5fc", // Very light purple tint
      sidebar: "#14334a", // Your main purple
      card: "#ffffff", // White cards
      cardHover: "#f7f5fc", // Light purple on hover
      overlay: "rgba(20, 51, 74, 0.8)", // Purple overlay
      gradient:
        "linear-gradient(135deg, #14334a 0%, #2c5474 50%, #c6d3e0 100%)",
    },

    // Text colors - optimized for readability
    text: {
      primary: "#1f2937", // Dark gray for main text
      secondary: "#6b7280", // Medium gray for secondary text
      tertiary: "#9ca3af", // Light gray for tertiary text
      inverse: "#ffffff", // White text on dark backgrounds
      muted: "#d1d5db", // Muted text
      accent: "#14334a", // Purple text for emphasis
      gold: "#c5944c", // Gold text for special elements
    },

    // Border colors
    border: {
      primary: "#e5e7eb", // Light gray borders
      secondary: "#d1d5db", // Medium gray borders
      focus: "#c5944c", // Gold focus borders
      error: "#ef4444", // Red error borders
      purple: "#c6d3e0", // Light purple borders
    },

    // Sports-specific colors (harmonized with your theme)
    sports: {
      win: "#22c55e", // Green for wins
      draw: "#c5944c", // Orange for draws
      loss: "#ef4444", // Red for losses
      home: "#14334a", // Your purple for home team
      away: "#64748b", // Slate gray for away team
      goals: "#10b981", // Emerald for goals
      cards: "#f59e0b", // Amber for yellow cards
      redCard: "#ef4444", // Red for red cards
      points: "#c5944c", // Gold for points highlighting
    },

    // Additional themed colors
    // The key names still say "purple" because they are read in ~40 files;
    // renaming them is a separate mechanical change (C11), not a rebrand.
    themed: {
      lightPurple: "#c6d3e0", // Light navy tint
      mainPurple: "#14334a", // Main navy
      hoverGold: "#c5944c", // Crest gold
      darkPurple: "#0c1f33", // Deep navy
      softGold: "#f2e2c1", // Soft gold background
      purpleGradient: "linear-gradient(135deg, #14334a 0%, #0f2941 100%)",
      goldGradient: "linear-gradient(135deg, #c5944c 0%, #e8c37a 100%)",
      heroGradient:
        "linear-gradient(135deg, #0c1f33 0%, #14334a 55%, #c5944c 100%)",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "var(--font-body), system-ui, sans-serif",
      display: "var(--font-display), var(--font-body), sans-serif",
      mono: "var(--font-geist-mono), monospace",
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Spacing
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // Layout
  layout: {
    sidebar: {
      width: {
        collapsed: "64px",
        expanded: "240px",
      },
      transition: "all 0.3s ease-in-out",
    },
    navbar: {
      height: "64px",
    },
    container: {
      maxWidth: "1200px",
      padding: "1rem",
    },
  },

  // Breakpoints
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index
  zIndex: {
    navbar: 1000,
    sidebar: 999,
    modal: 1050,
    tooltip: 1070,
    dropdown: 1000,
  },

  // Transitions
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.3s ease-in-out",
    slow: "0.5s ease-in-out",
  },

  // Component-specific styles
  components: {
    button: {
      padding: {
        sm: "0.5rem 1rem",
        md: "0.75rem 1.5rem",
        lg: "1rem 2rem",
      },
      borderRadius: "0.5rem",
    },
    card: {
      padding: "1.5rem",
      borderRadius: "0.75rem",
      shadow: "0 4px 6px -1px rgba(20, 51, 74, 0.1)",
      hoverShadow: "0 10px 15px -3px rgba(20, 51, 74, 0.2)",
    },
    table: {
      headerBg: "#f7f5fc",
      stripedBg: "#fafafa",
      borderColor: "#c6d3e0",
      hoverBg: "#f7f5fc",
    },
    navbar: {
      background: "#14334a",
      hoverBackground: "rgba(197, 148, 76, 0.1)",
      activeBackground: "rgba(197, 148, 76, 0.2)",
      textColor: "#ffffff",
      hoverTextColor: "#c5944c",
    },
    sidebar: {
      background: "#14334a",
      hoverBackground: "rgba(255, 255, 255, 0.1)",
      activeBackground: "rgba(197, 148, 76, 0.15)",
      textColor: "#ffffff",
      activeTextColor: "#c5944c",
    },
  },
};
