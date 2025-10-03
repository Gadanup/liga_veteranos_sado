import React from "react";
import { Card, CardContent, Box, Typography, Chip } from "@mui/material";
import { EmojiEvents, Info } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * SorteioHeader Component
 * Displays the page title and season information
 */
const SorteioHeader = () => {
  return (
    <Card
      sx={{
        background: theme.colors.themed.purpleGradient,
        color: "white",
        mb: 4,
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Box textAlign="center">
          {/* Title with Icon */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mb={3}
          >
            <EmojiEvents
              sx={{
                fontSize: { xs: 40, md: 50 },
                color: theme.colors.accent[500],
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Sorteio das Competições
            </Typography>
          </Box>

          {/* Season Chip */}
          <Chip
            icon={<Info />}
            label="Liga Veteranos do Sado 2025/2026"
            sx={{
              backgroundColor: theme.colors.accent[500],
              color: theme.colors.neutral[900],
              fontWeight: "bold",
              fontSize: { xs: "14px", md: "16px" },
              py: 2,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SorteioHeader;
