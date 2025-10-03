import React from "react";
import { Box, Typography } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * CupHeader Component
 * Displays the cup page title
 */
const CupHeader = () => {
  return (
    <Box textAlign="center" mb={4}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
        mb={2}
      >
        <EmojiEvents sx={{ fontSize: 32, color: theme.colors.accent[500] }} />
        <Typography
          variant="h4"
          sx={{
            color: theme.colors.primary[600],
            fontWeight: "bold",
            fontSize: { xs: "28px", sm: "32px" },
          }}
        >
          Taça
        </Typography>
      </Box>

      {/* Yellow underline */}
      <Box
        sx={{
          width: "60px",
          height: "4px",
          backgroundColor: theme.colors.accent[500],
          margin: "0 auto 20px auto",
          borderRadius: "2px",
        }}
      />
    </Box>
  );
};

export default CupHeader;
