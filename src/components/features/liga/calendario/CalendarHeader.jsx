import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { EventAvailable, Add } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * CalendarHeader Component
 * Displays page title, season selector, and create match button
 *
 * @param {Array} seasons - Available seasons
 * @param {number} selectedSeason - Currently selected season
 * @param {Function} onSeasonChange - Callback when season changes
 * @param {boolean} isAdmin - Whether user is admin
 * @param {Function} onCreateMatch - Callback to open create match dialog
 */
const CalendarHeader = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  isAdmin,
  onCreateMatch,
}) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems={isMobile ? "center" : "flex-start"}
      gap={2}
      mb={4}
    >
      {/* Title Section */}
      <Box flex={1} textAlign={isMobile ? "center" : "left"}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={isMobile ? "center" : "flex-start"}
          gap={2}
          mb={1}
        >
          <EventAvailable
            sx={{ fontSize: 32, color: theme.colors.accent[500] }}
          />
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: "bold",
              fontSize: "32px",
            }}
          >
            Calendário
          </Typography>
        </Box>

        {/* Yellow underline */}
        <Box
          sx={{
            width: "60px",
            height: "4px",
            backgroundColor: theme.colors.accent[500],
            margin: isMobile ? "0 auto" : "0",
            borderRadius: "2px",
          }}
        />
      </Box>

      {/* Season Selector */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{
          backgroundColor: theme.colors.background.card,
          padding: "8px 16px",
          borderRadius: "12px",
          boxShadow: theme.components.card.shadow,
          border: `2px solid ${theme.colors.primary[200]}`,
          minWidth: isMobile ? "auto" : "200px",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            fontWeight: "medium",
            color: theme.colors.text.secondary,
            whiteSpace: "nowrap",
          }}
        >
          Época:
        </Typography>
        <select
          value={selectedSeason || ""}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          style={{
            padding: "4px 12px",
            fontSize: "16px",
            fontWeight: "600",
            color: theme.colors.primary[700],
            backgroundColor: "transparent",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            outline: "none",
            fontFamily: "inherit",
          }}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.description}
            </option>
          ))}
        </select>
      </Box>

      {/* Create Match Button (Admin Only) */}
      {isAdmin && (
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            width: isMobile ? "100%" : "auto",
            pt: isMobile ? 0 : 0.5,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateMatch}
            sx={{
              backgroundColor: theme.colors.primary[600],
              "&:hover": {
                backgroundColor: theme.colors.primary[700],
              },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Criar Jogo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CalendarHeader;
