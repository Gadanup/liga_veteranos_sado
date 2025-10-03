import React from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * WeekNavigator Component
 * Navigation for switching between match weeks
 *
 * @param {Array} weekList - List of available weeks
 * @param {string} currentWeek - Currently selected week
 * @param {Function} onWeekChange - Callback when week changes
 */
const WeekNavigator = ({ weekList, currentWeek, onWeekChange }) => {
  const isMobile = window.innerWidth <= 768;

  const currentWeekIndex = weekList.indexOf(currentWeek);
  const previousWeek = weekList[currentWeekIndex - 1] || null;
  const nextWeek = weekList[currentWeekIndex + 1] || null;

  if (isMobile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        sx={{
          backgroundColor: theme.colors.background.card,
          padding: "16px",
          borderRadius: "12px",
          boxShadow: theme.components.card.shadow,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => previousWeek && onWeekChange(previousWeek)}
            disabled={!previousWeek}
            sx={{
              backgroundColor: previousWeek
                ? theme.colors.primary[600]
                : theme.colors.neutral[200],
              color: previousWeek ? "white" : theme.colors.neutral[600],
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: previousWeek
                  ? theme.colors.primary[700]
                  : theme.colors.neutral[200],
              },
              "&:disabled": {
                backgroundColor: theme.colors.neutral[200],
                color: theme.colors.neutral[600],
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Box
            sx={{
              backgroundColor: theme.colors.primary[600],
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Jornada {currentWeek}
          </Box>

          <IconButton
            onClick={() => nextWeek && onWeekChange(nextWeek)}
            disabled={!nextWeek}
            sx={{
              backgroundColor: nextWeek
                ? theme.colors.primary[600]
                : theme.colors.neutral[200],
              color: nextWeek ? "white" : theme.colors.neutral[600],
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: nextWeek
                  ? theme.colors.primary[700]
                  : theme.colors.neutral[200],
              },
              "&:disabled": {
                backgroundColor: theme.colors.neutral[200],
                color: theme.colors.neutral[600],
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    );
  }

  // Desktop Navigation
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={4}
      sx={{
        backgroundColor: theme.colors.background.card,
        padding: "16px",
        borderRadius: "12px",
        boxShadow: theme.components.card.shadow,
      }}
    >
      <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
        {weekList.map((week) => (
          <Box
            key={week}
            onClick={() => onWeekChange(week)}
            sx={{
              backgroundColor:
                currentWeek === week
                  ? theme.colors.primary[600]
                  : theme.colors.background.card,
              color: currentWeek === week ? "white" : theme.colors.primary[600],
              border: `2px solid ${theme.colors.primary[600]}`,
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              minWidth: "50px",
              textAlign: "center",
              "&:hover": {
                backgroundColor:
                  currentWeek === week
                    ? theme.colors.primary[600]
                    : theme.colors.background.secondary,
              },
            }}
          >
            {week}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WeekNavigator;
