import React from "react";
import { Box, Button, IconButton, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * RoundNavigator Component
 * Navigate between Cup rounds (Group A, Group B, Group C, Semi-finals, Final, etc.)
 *
 * @param {Array} rounds - List of available rounds/groups
 * @param {string} currentRound - Currently selected round
 * @param {Function} onRoundChange - Callback when round changes
 * @param {boolean} isGroupStageMode - Whether current season has group stage
 */
const RoundNavigator = ({
  rounds,
  currentRound,
  onRoundChange,
  isGroupStageMode = false,
}) => {
  if (!rounds || rounds.length === 0) {
    return null;
  }

  const currentIndex = rounds.findIndex((r) => r.id === currentRound);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < rounds.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onRoundChange(rounds[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onRoundChange(rounds[currentIndex + 1].id);
    }
  };

  // Get round display name
  const getRoundName = (round) => {
    switch (round.id) {
      case "all":
        return "Todos os Jogos";
      case "groupA":
        return "Grupo A";
      case "groupB":
        return "Grupo B";
      case "groupC":
        return "Grupo C";
      case "finalFour":
        return "Final Four";
      case "knockout":
        return "Eliminatórias";
      default:
        return round.label || round.id;
    }
  };

  // Get chip color based on round type
  const getChipColor = (roundId) => {
    if (roundId.startsWith("group")) {
      return {
        bg: theme.colors.success[50],
        border: theme.colors.success[500],
        text: theme.colors.success[700],
      };
    }
    if (roundId === "finalFour") {
      return {
        bg: theme.colors.accent[50],
        border: theme.colors.accent[500],
        text: theme.colors.accent[700],
      };
    }
    return {
      bg: theme.colors.secondary[50],
      border: theme.colors.secondary[500],
      text: theme.colors.secondary[700],
    };
  };

  const currentRoundData = rounds.find((r) => r.id === currentRound);
  const chipColors = getChipColor(currentRound);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        marginBottom: 3,
        padding: 2,
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.md,
      }}
    >
      {/* Previous Button */}
      <IconButton
        onClick={handlePrevious}
        disabled={!hasPrevious}
        sx={{
          color: theme.colors.primary[600],
          "&:hover": {
            backgroundColor: theme.colors.primary[50],
          },
          "&:disabled": {
            color: theme.colors.text.disabled,
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Current Round Chip */}
      <Chip
        label={getRoundName(currentRoundData)}
        sx={{
          backgroundColor: chipColors.bg,
          color: chipColors.text,
          fontWeight: theme.typography.fontWeight.bold,
          fontSize: { xs: "13px", sm: "14px" },
          border: `2px solid ${chipColors.border}`,
          padding: { xs: "8px 12px", sm: "12px 16px" },
          height: "auto",
          "& .MuiChip-label": {
            padding: 0,
          },
        }}
      />

      {/* Next Button */}
      <IconButton
        onClick={handleNext}
        disabled={!hasNext}
        sx={{
          color: theme.colors.primary[600],
          "&:hover": {
            backgroundColor: theme.colors.primary[50],
          },
          "&:disabled": {
            color: theme.colors.text.disabled,
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* Round Counter */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          color: theme.colors.text.secondary,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          marginLeft: 2,
        }}
      >
        {currentIndex + 1} / {rounds.length}
      </Box>
    </Box>
  );
};

export default RoundNavigator;
