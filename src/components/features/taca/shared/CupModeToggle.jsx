import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { theme } from "../../../../styles/theme";

/**
 * CupModeToggle Component
 * Internal component that detects cup_group_stage from season data
 * and renders the appropriate component tree
 *
 * This component determines whether to show:
 * - League Cup view (with group stage) if cup_group_stage = true
 * - Knockout Cup view (traditional) if cup_group_stage = false
 *
 * @param {Object} currentSeason - Current season object with cup_group_stage property
 * @param {ReactNode} leagueCupComponent - Component to render for league cup mode
 * @param {ReactNode} knockoutCupComponent - Component to render for knockout mode
 * @param {boolean} loading - Whether data is loading
 */
const CupModeToggle = ({
  currentSeason,
  leagueCupComponent,
  knockoutCupComponent,
  loading = false,
}) => {
  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <CircularProgress
          size={48}
          sx={{
            color: theme.colors.primary[600],
          }}
        />
        <Typography
          variant="body1"
          sx={{
            color: theme.colors.text.secondary,
          }}
        >
          A carregar dados da Taça...
        </Typography>
      </Box>
    );
  }

  // No season data
  if (!currentSeason) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          padding: 4,
          backgroundColor: theme.colors.background.card,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.md,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            marginBottom: 1,
            fontWeight: theme.typography.fontWeight.bold,
          }}
        >
          Época não encontrada
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            textAlign: "center",
          }}
        >
          Não foi possível determinar a época atual. Por favor, tente novamente.
        </Typography>
      </Box>
    );
  }

  // Determine which mode to render based on cup_group_stage
  const isLeagueCupMode = currentSeason.cup_group_stage === true;

  // Render appropriate component
  if (isLeagueCupMode) {
    return (
      <Box>
        {/* League Cup Mode: Group Stage + Final Four */}
        {leagueCupComponent}
      </Box>
    );
  } else {
    return (
      <Box>
        {/* Knockout Cup Mode: Traditional bracket */}
        {knockoutCupComponent}
      </Box>
    );
  }
};

export default CupModeToggle;
