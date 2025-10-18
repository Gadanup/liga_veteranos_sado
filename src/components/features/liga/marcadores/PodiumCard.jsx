import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { SportsSoccer } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * PodiumCard Component
 * Displays top 3 goalscorers in podium style
 *
 * @param {Object} player - Player data
 * @param {number} position - Position (0=1st, 1=2nd, 2=3rd)
 * @param {boolean} isMobile - Whether viewing on mobile
 */
const PodiumCard = ({ player, position, isMobile, onPlayerClick }) => {
  const getPodiumPosition = (position) => {
    if (position === 0)
      return {
        color: theme.colors.accent[500],
        size: isMobile ? 100 : 120,
        label: "1º",
      };
    if (position === 1)
      return { color: "#C0C0C0", size: isMobile ? 100 : 120, label: "2º" };
    if (position === 2)
      return { color: "#CD7F32", size: isMobile ? 100 : 120, label: "3º" };
    return null;
  };

  const podiumInfo = getPodiumPosition(position);

  return (
    <Card
      onClick={() => onPlayerClick(player)}
      sx={{
        background: `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.background.tertiary} 100%)`,
        borderRadius: "20px",
        cursor: "pointer",
        border: `3px solid ${podiumInfo.color}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.1)`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        height: "100%",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 12px 40px rgba(0,0,0,0.15)`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          transition: "all 0.3s ease",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: `linear-gradient(90deg, ${podiumInfo.color}, ${theme.colors.accent[400]})`,
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", padding: isMobile ? 2 : 3 }}>
        {/* Position Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: podiumInfo.color,
            color: "white",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {podiumInfo.label}
        </Box>

        {/* Player Photo */}
        <Avatar
          alt={player.name}
          src={player.photo_url}
          sx={{
            width: podiumInfo.size,
            height: podiumInfo.size,
            margin: `${isMobile ? 20 : 30}px auto 16px auto`,
            border: `4px solid ${podiumInfo.color}`,
            boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
          }}
        />

        {/* Player Name */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: "bold",
            color: theme.colors.text.primary,
            marginBottom: 1,
            lineHeight: 1.2,
          }}
        >
          {player.name}
        </Typography>

        {/* Team Info */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          mb={2}
          sx={{
            background: theme.colors.background.secondary,
            padding: "8px 16px",
            borderRadius: "20px",
            border: `1px solid ${theme.colors.border.primary}`,
          }}
        >
          {player.team_logo_url && (
            <Avatar
              alt={player.team_name}
              src={player.team_logo_url}
              sx={{ width: 24, height: 24 }}
            />
          )}
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              fontWeight: "medium",
            }}
          >
            {player.team_name}
          </Typography>
        </Box>

        {/* Goals */}
        <Box
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            padding: "12px 20px",
            borderRadius: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <SportsSoccer sx={{ fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {player.goals} {player.goals === 1 ? "Golo" : "Golos"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PodiumCard;
