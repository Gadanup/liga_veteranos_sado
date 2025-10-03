import React from "react";
import { Box, Typography } from "@mui/material";
import { SportsSoccer } from "@mui/icons-material";
import { theme } from "../../styles/theme.js";

/**
 * LoadingSkeleton Component
 * Displays a loading animation with custom message
 *
 * @param {string} message - Loading message to display
 */
const LoadingSkeleton = ({ message = "A carregar..." }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      flexDirection="column"
      gap={3}
      sx={{ backgroundColor: theme.colors.background.secondary }}
    >
      <SportsSoccer
        sx={{
          fontSize: 60,
          color: theme.colors.primary[600],
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSkeleton;
