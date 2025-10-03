import React from "react";
import { Box, Typography } from "@mui/material";
import { theme } from "../../../../styles/theme.js";

/**
 * Creates a custom team display for the bracket
 *
 * @param {Object} side - Team side data
 * @param {string} matchId - Match ID
 * @param {Object} router - Next.js router
 * @param {boolean} isMobile - Whether viewing on mobile
 * @returns {JSX.Element} - Custom team display component
 */
export const createCustomTeamDisplay = (side, matchId, router, isMobile) => {
  const isWinner = side.winner;
  const hasScore = side.score !== "---" && side.score !== null;

  return (
    <Box
      onClick={() => router.push(`/jogos/${matchId}`)}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: isMobile ? "250px" : "300px",
        cursor: "pointer",
        padding: "10px 14px",
        borderRadius: "10px",
        backgroundColor:
          isWinner && hasScore
            ? theme.colors.accent[500] + "15"
            : "rgba(255, 255, 255, 0.95)",
        border: `2px solid ${
          isWinner && hasScore
            ? theme.colors.accent[500]
            : "rgba(107, 75, 161, 0.2)"
        }`,
        transition: "all 0.3s ease",
        boxShadow:
          isWinner && hasScore
            ? `0 4px 12px ${theme.colors.accent[500]}30`
            : "0 2px 8px rgba(0,0,0,0.1)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderColor: theme.colors.accent[500],
          transform: "translateY(-2px)",
          boxShadow: `0 6px 20px ${theme.colors.accent[500]}40`,
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2} flex={1} minWidth={0}>
        {side.team.logo && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${theme.colors.border.primary}`,
              flexShrink: 0,
            }}
          >
            <img
              src={side.team.logo}
              alt={`${side.team.name} logo`}
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: isWinner && hasScore ? "bold" : "600",
            color:
              isWinner && hasScore
                ? theme.colors.accent[700]
                : theme.colors.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: isMobile ? "13px" : "15px",
          }}
        >
          {side.team.name}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor:
            isWinner && hasScore
              ? theme.colors.accent[500]
              : theme.colors.neutral[200],
          color: isWinner && hasScore ? "white" : theme.colors.text.primary,
          padding: "4px 10px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: isMobile ? "12px" : "14px",
          minWidth: "45px",
          textAlign: "center",
          border:
            isWinner && hasScore
              ? `1px solid ${theme.colors.accent[600]}`
              : `1px solid ${theme.colors.neutral[300]}`,
        }}
      >
        {side.score !== null ? side.score : "---"}
      </Box>
    </Box>
  );
};
