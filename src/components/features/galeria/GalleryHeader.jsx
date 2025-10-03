import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Groups, EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

/**
 * GalleryHeader Component
 * Displays the page title and teams count
 *
 * @param {number} teamsCount - Total number of teams
 */
const GalleryHeader = ({ teamsCount }) => {
  return (
    <Box
      sx={{
        textAlign: { xs: "center", md: "left" },
        flex: 1,
      }}
    >
      {/* Title with Icon */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "center", md: "flex-start" }}
        gap={2}
        mb={2}
      >
        <Groups
          sx={{
            fontSize: { xs: 40, md: 50 },
            color: theme.colors.primary[600],
          }}
        />
        <Typography
          sx={{
            fontSize: theme.typography.fontSize["3xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary[600],
            margin: 0,
            fontFamily: theme.typography.fontFamily.primary,
          }}
        >
          Equipas
        </Typography>
      </Box>

      {/* Teams Count Chip */}
      <Chip
        icon={<EmojiEvents />}
        label={`${teamsCount} Equipas Participantes`}
        sx={{
          backgroundColor: theme.colors.accent[500],
          color: theme.colors.neutral[900],
          fontWeight: "bold",
          fontSize: { xs: "14px", md: "16px" },
          py: 2,
        }}
      />
    </Box>
  );
};

export default GalleryHeader;
