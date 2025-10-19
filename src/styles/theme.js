// theme.js
export const theme = {
  colors: {
    // Primary colors - based on #6b4ba1 (main purple)
    primary: {
      50: "#f7f5fc", // Very light purple
      100: "#efebf8", // Light purple
      200: "#e2d9f2", // Lighter purple
      300: "#dbcef3", // Your specified lighter color
      400: "#b199d6", // Medium-light purple
      500: "#8f73c2", // Medium purple
      600: "#6b4ba1", // Your main color
      700: "#5a3d87", // Darker purple
      800: "#4a326f", // Dark purple
      900: "#3b2858", // Very dark purple
    },

    // Gold/Yellow colors - based on #ffd700 (hover effects)
    accent: {
      50: "#fffef7", // Very light gold
      100: "#fffaeb", // Light gold
      200: "#fff3c4", // Lighter gold
      300: "#ffe89d", // Light-medium gold
      400: "#ffdc76", // Medium gold
      500: "#ffd700", // Your main gold color
      600: "#e6c200", // Darker gold
      700: "#ccad00", // Dark gold
      800: "#b39900", // Very dark gold
      900: "#998500", // Deep gold
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
      sidebar: "#6b4ba1", // Your main purple
      card: "#ffffff", // White cards
      cardHover: "#f7f5fc", // Light purple on hover
      overlay: "rgba(107, 75, 161, 0.8)", // Purple overlay
      gradient:
        "linear-gradient(135deg, #6b4ba1 0%, #8f73c2 50%, #dbcef3 100%)",
    },

    // Text colors - optimized for readability
    text: {
      primary: "#1f2937", // Dark gray for main text
      secondary: "#6b7280", // Medium gray for secondary text
      tertiary: "#9ca3af", // Light gray for tertiary text
      inverse: "#ffffff", // White text on dark backgrounds
      muted: "#d1d5db", // Muted text
      accent: "#6b4ba1", // Purple text for emphasis
      gold: "#ffd700", // Gold text for special elements
    },

    // Border colors
    border: {
      primary: "#e5e7eb", // Light gray borders
      secondary: "#d1d5db", // Medium gray borders
      focus: "#ffd700", // Gold focus borders
      error: "#ef4444", // Red error borders
      purple: "#dbcef3", // Light purple borders
    },

    // Sports-specific colors (harmonized with your theme)
    sports: {
      win: "#22c55e", // Green for wins
      draw: "#ffd700", // Orange for draws
      loss: "#ef4444", // Red for losses
      home: "#6b4ba1", // Your purple for home team
      away: "#64748b", // Slate gray for away team
      goals: "#10b981", // Emerald for goals
      cards: "#f59e0b", // Amber for yellow cards
      redCard: "#ef4444", // Red for red cards
      points: "#ffd700", // Gold for points highlighting
    },

    // Additional themed colors
    themed: {
      lightPurple: "#dbcef3", // Your specified light purple
      mainPurple: "#6b4ba1", // Your main purple
      hoverGold: "#ffd700", // Your hover gold
      darkPurple: "#4a326f", // Darker version of main
      softGold: "#fff3c4", // Soft gold background
      purpleGradient: "linear-gradient(135deg, #6b4ba1 0%, #8f73c2 100%)",
      goldGradient: "linear-gradient(135deg, #ffd700 0%, #ffdc76 100%)",
      heroGradient:
        "linear-gradient(135deg, #6b4ba1 0%, #8f73c2 50%, #ffd700 100%)",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
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
      shadow: "0 4px 6px -1px rgba(107, 75, 161, 0.1)",
      hoverShadow: "0 10px 15px -3px rgba(107, 75, 161, 0.2)",
    },
    table: {
      headerBg: "#f7f5fc",
      stripedBg: "#fafafa",
      borderColor: "#dbcef3",
      hoverBg: "#f7f5fc",
    },
    navbar: {
      background: "#6b4ba1",
      hoverBackground: "rgba(255, 215, 0, 0.1)",
      activeBackground: "rgba(255, 215, 0, 0.2)",
      textColor: "#ffffff",
      hoverTextColor: "#ffd700",
    },
    sidebar: {
      background: "#6b4ba1",
      hoverBackground: "rgba(255, 255, 255, 0.1)",
      activeBackground: "rgba(255, 215, 0, 0.15)",
      textColor: "#ffffff",
      activeTextColor: "#ffd700",
    },
  },
};
