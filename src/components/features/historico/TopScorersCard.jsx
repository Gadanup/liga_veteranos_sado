import React from "react";
import { Paper, Box, Typography, Avatar, Chip } from "@mui/material";
import { SportsSoccer } from "@mui/icons-material";
import { theme } from "../../../styles/theme";

/**
 * TopScorersCard Component
 * Displays the top 3 scorers of a season
 *
 * @param {Object} stats - Season statistics containing top scorers
 * @param {string} color - Theme color for the card
 */
const TopScorersCard = ({ stats, color }) => {
  // Build scorers array from stats
  const scorers = [
    stats.top_scorer_1 && {
      name: stats.top_scorer_1.name,
      team: stats.top_scorer_1.team,
      goals: stats.top_scorer_1_goals,
    },
    stats.top_scorer_2 && {
      name: stats.top_scorer_2.name,
      team: stats.top_scorer_2.team,
      goals: stats.top_scorer_2_goals,
    },
    stats.top_scorer_3 && {
      name: stats.top_scorer_3.name,
      team: stats.top_scorer_3.team,
      goals: stats.top_scorer_3_goals,
    },
  ].filter(Boolean);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.background.card,
        border: `2px solid ${color}20`,
        transition: theme.transitions.normal,
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${color}30`,
          borderColor: `${color}40`,
        },
      }}
    >
      {/* Card Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          <SportsSoccer sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.colors.text.secondary,
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Melhores Marcadores
        </Typography>
      </Box>

      {/* Scorers List */}
      {scorers.length > 0 ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {scorers.map((scorer, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                p: 2,
                borderRadius: theme.borderRadius.lg,
                backgroundColor:
                  index === 0
                    ? `${color}10`
                    : theme.colors.background.secondary,
                border: index === 0 ? `2px solid ${color}30` : "none",
              }}
            >
              {/* Position Badge */}
              <Chip
                label={`${index + 1}º`}
                size="small"
                sx={{
                  backgroundColor:
                    index === 0 ? color : theme.colors.neutral[400],
                  color: "white",
                  fontWeight: "bold",
                  minWidth: "32px",
                }}
              />

              {/* Team Logo */}
              <Avatar
                src={scorer.team?.logo_url}
                alt={scorer.team?.short_name}
                sx={{ width: 36, height: 36 }}
              />

              {/* Player Info */}
              <Box flex={1}>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: index === 0 ? "bold" : "medium",
                    fontSize: "0.95rem",
                  }}
                >
                  {scorer.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.colors.text.secondary }}
                >
                  {scorer.team?.short_name}
                </Typography>
              </Box>

              {/* Goals Badge */}
              <Chip
                label={`${scorer.goals} golos`}
                size="small"
                sx={{
                  backgroundColor: `${color}15`,
                  color: color,
                  fontWeight: "bold",
                }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.tertiary,
            fontStyle: "italic",
            textAlign: "center",
            py: 2,
          }}
        >
          Sem dados disponíveis
        </Typography>
      )}
    </Paper>
  );
};

export default TopScorersCard;
