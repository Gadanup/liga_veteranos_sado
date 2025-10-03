import React from "react";
import { Box, Typography } from "@mui/material";
import { SportsSoccer } from "@mui/icons-material";
import { theme } from "../../styles/theme.js";

/**
 * EmptyState Component
 * Displays when no content is available
 *
 * @param {string} message - Message to display
 */
const EmptyState = ({ message = "Nenhum conteúdo disponível" }) => {
  return (
    <Box
      textAlign="center"
      py={8}
      sx={{
        backgroundColor: theme.colors.background.card,
        borderRadius: "16px",
        boxShadow: theme.components.card.shadow,
      }}
    >
      <SportsSoccer
        sx={{ fontSize: 80, color: theme.colors.neutral[300], mb: 2 }}
      />
      <Typography
        variant="h5"
        sx={{
          color: theme.colors.text.secondary,
          fontWeight: "medium",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
