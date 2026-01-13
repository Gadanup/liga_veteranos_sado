import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../../styles/theme";

/**
 * GroupStandingsTable Component
 * Displays the standings table for a specific group
 *
 * @param {Array} standings - Array of team standings for the group
 * @param {string} groupName - Name of the group (A, B, C, etc.)
 * @param {boolean} isMobile - Whether the view is mobile
 */
const GroupStandingsTable = ({ standings, groupName, isMobile }) => {
  const isVerySmallMobile = useMediaQuery("(max-width: 375px)");

  // Determine qualification status
  const getQualificationStyle = (position) => {
    if (position === 1) {
      // 1st place - automatically qualifies
      return {
        borderLeft: `4px solid ${theme.colors.success[500]}`,
        backgroundColor: `${theme.colors.success[50]}`,
      };
    }
    if (position === 2) {
      // 2nd place - might qualify (best 2nd)
      return {
        borderLeft: `4px solid ${theme.colors.warning[500]}`,
        backgroundColor: `${theme.colors.warning[50]}`,
      };
    }
    return {
      borderLeft: `4px solid transparent`,
    };
  };

  // No data state
  if (!standings || standings.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: theme.colors.background.card,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.md,
          padding: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
          Sem jogos disputados no Grupo {groupName}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.lg,
        overflow: "hidden",
      }}
    >
      {/* Table Header */}
      <Box
        sx={{
          background: theme.colors.themed.purpleGradient,
          color: theme.colors.text.inverse,
          padding: isMobile
            ? `${theme.spacing.sm} ${theme.spacing.xs}`
            : theme.spacing.md,
          display: "grid",
          gridTemplateColumns: isMobile
            ? isVerySmallMobile
              ? "30px 1fr 30px 30px 30px 35px"
              : "35px 1fr 35px 35px 35px 40px"
            : "50px 1fr 60px 60px 60px 60px 80px 80px 100px",
          gap: isMobile ? "4px" : theme.spacing.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          fontSize: isMobile
            ? isVerySmallMobile
              ? "10px"
              : "11px"
            : theme.typography.fontSize.sm,
          alignItems: "center",
          minHeight: isMobile ? "40px" : "50px",
        }}
      >
        <div style={{ textAlign: "center" }}>POS</div>
        <div style={{ paddingLeft: isMobile ? "4px" : "8px" }}>EQUIPA</div>
        <div style={{ textAlign: "center" }}>J</div>
        <div style={{ textAlign: "center" }}>V</div>
        <div style={{ textAlign: "center" }}>E</div>
        {!isMobile && <div style={{ textAlign: "center" }}>D</div>}
        {!isMobile && <div style={{ textAlign: "center" }}>GOLOS</div>}
        {!isMobile && <div style={{ textAlign: "center" }}>DG</div>}
        <div style={{ textAlign: "center" }}>{isMobile ? "P" : "PTS"}</div>
      </Box>

      {/* Table Body */}
      <Box>
        {standings.map((team, index) => {
          const position = index + 1;
          const qualStyle = getQualificationStyle(position);
          const isEvenRow = index % 2 === 0;

          return (
            <Box
              key={team.team_id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? isVerySmallMobile
                    ? "30px 1fr 30px 30px 30px 35px"
                    : "35px 1fr 35px 35px 35px 40px"
                  : "50px 1fr 60px 60px 60px 60px 80px 80px 100px",
                gap: isMobile ? "4px" : theme.spacing.sm,
                padding: isMobile
                  ? `${theme.spacing.sm} ${theme.spacing.xs}`
                  : `${theme.spacing.md} ${theme.spacing.md}`,
                alignItems: "center",
                backgroundColor: isEvenRow
                  ? theme.colors.background.secondary
                  : theme.colors.background.card,
                ...qualStyle,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.colors.background.cardHover,
                  transform: "translateX(4px)",
                },
                fontSize: isMobile
                  ? isVerySmallMobile
                    ? "11px"
                    : "12px"
                  : theme.typography.fontSize.sm,
                minHeight: isMobile ? "45px" : "60px",
              }}
            >
              {/* Position */}
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: theme.typography.fontWeight.bold,
                  color:
                    position === 1
                      ? theme.colors.success[600]
                      : position === 2
                        ? theme.colors.warning[600]
                        : theme.colors.text.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {position}
                {position === 1 && !isMobile && (
                  <EmojiEvents
                    sx={{
                      fontSize: 16,
                      ml: 0.5,
                      color: theme.colors.accent[500],
                    }}
                  />
                )}
              </Box>

              {/* Team Name with Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "6px" : theme.spacing.sm,
                  paddingLeft: isMobile ? "4px" : "8px",
                  overflow: "hidden",
                }}
              >
                {team.logo_url && (
                  <img
                    src={team.logo_url}
                    alt={team.team_name}
                    style={{
                      width: isMobile ? "20px" : "28px",
                      height: isMobile ? "20px" : "28px",
                      objectFit: "contain",
                      flexShrink: 0,
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: isMobile
                      ? isVerySmallMobile
                        ? "11px"
                        : "12px"
                      : "14px",
                  }}
                >
                  {team.team_name}
                </Typography>
              </Box>

              {/* Matches Played */}
              <Box sx={{ textAlign: "center", fontWeight: 500 }}>
                {team.matches_played}
              </Box>

              {/* Wins */}
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: 600,
                  color: theme.colors.success[600],
                }}
              >
                {team.wins}
              </Box>

              {/* Draws */}
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  color: theme.colors.warning[600],
                }}
              >
                {team.draws}
              </Box>

              {/* Losses (Desktop only) */}
              {!isMobile && (
                <Box
                  sx={{
                    textAlign: "center",
                    fontWeight: 500,
                    color: theme.colors.error[600],
                  }}
                >
                  {team.losses}
                </Box>
              )}

              {/* Goals (Desktop only) */}
              {!isMobile && (
                <Box
                  sx={{
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {team.goals_for}:{team.goals_against}
                </Box>
              )}

              {/* Goal Difference (Desktop only) */}
              {!isMobile && (
                <Box
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    color:
                      team.goal_difference > 0
                        ? theme.colors.success[600]
                        : team.goal_difference < 0
                          ? theme.colors.error[600]
                          : theme.colors.text.secondary,
                  }}
                >
                  {team.goal_difference > 0 ? "+" : ""}
                  {team.goal_difference}
                </Box>
              )}

              {/* Points */}
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: theme.typography.fontWeight.bold,
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary[600],
                }}
              >
                {team.points}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.colors.border.primary}`,
          padding: isMobile ? theme.spacing.sm : theme.spacing.md,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? theme.spacing.xs : theme.spacing.lg,
          fontSize: isMobile ? "10px" : theme.typography.fontSize.xs,
          color: theme.colors.text.secondary,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: theme.colors.success[500],
              borderRadius: "2px",
            }}
          />
          <Typography variant="caption">Apurado (1º lugar)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: theme.colors.warning[500],
              borderRadius: "2px",
            }}
          />
          <Typography variant="caption">
            Possível apuramento (melhor 2º)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupStandingsTable;
