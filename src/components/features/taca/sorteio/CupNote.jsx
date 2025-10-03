import React from "react";
import { Box, Typography } from "@mui/material";
import { SportsSoccer } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * CupNote Component
 * Displays informational note about automatic qualification
 */
const CupNote = () => {
  return (
    <Box
      sx={{
        backgroundColor: theme.colors.background.card,
        borderRadius: "12px",
        padding: 2,
        marginTop: 3,
        border: `1px solid ${theme.colors.border.primary}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <SportsSoccer sx={{ color: theme.colors.accent[500] }} />
      <Typography
        variant="body2"
        sx={{
          color: theme.colors.text.secondary,
          fontStyle: "italic",
        }}
      >
        * Bairro Santos Nicolau qualificou-se automaticamente para os Oitavos de
        Final.
      </Typography>
    </Box>
  );
};

export default CupNote;
