import React from "react";
import { Paper, Box, Typography, Avatar } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { theme } from "../../../styles/theme";

/**
 * StatCard Component
 * Displays a single statistic with team information
 *
 * @param {ReactNode} icon - Icon to display
 * @param {string} title - Title of the statistic
 * @param {Object} team - Team object with short_name and logo_url
 * @param {string} extraInfo - Additional information to display
 * @param {string} color - Theme color for the card
 * @param {Function} onClick - Optional click handler
 */
const StatCard = ({ icon, title, team, extraInfo, color, onClick }) => {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.background.card,
        border: `2px solid ${color}20`,
        transition: theme.transitions.normal,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          transform: onClick ? "translateY(-4px)" : "none",
          boxShadow: `0 8px 24px ${color}30`,
          borderColor: `${color}40`,
        },
      }}
    >
      {/* Card Header */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {icon}
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
          {title}
        </Typography>
      </Box>

      {/* Team Information */}
      {team ? (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={team.logo_url}
            alt={team.short_name}
            sx={{
              width: 56,
              height: 56,
              border: `3px solid ${color}30`,
            }}
          />
          <Box flex={1}>
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: "bold",
                fontSize: "1.1rem",
                mb: 0.5,
              }}
            >
              {team.short_name}
            </Typography>
            {extraInfo && (
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary, fontSize: "0.9rem" }}
              >
                {extraInfo}
              </Typography>
            )}
          </Box>
          {onClick && (
            <Visibility
              sx={{ color: theme.colors.text.tertiary, fontSize: 20 }}
            />
          )}
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
          Não disputado
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;
