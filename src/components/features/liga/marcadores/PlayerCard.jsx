import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import { SportsSoccer } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * PlayerCard Component
 * Displays player information in list format
 *
 * @param {Object} player - Player data
 * @param {number} index - Index for animation delay
 */
const PlayerCard = ({ player, index, onPlayerClick }) => {
  return (
    <Card
      onClick={() => onPlayerClick(player)}
      sx={{
        background: theme.colors.background.card,
        borderRadius: "16px",
        cursor: "pointer",
        border: `2px solid ${theme.colors.border.purple}`,
        boxShadow: theme.components.card.shadow,
        transition: "all 0.3s ease",
        height: "120px",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.components.card.hoverShadow,
          borderColor: theme.colors.accent[500],
        },
        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
        "@keyframes fadeInUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <CardContent
        sx={{
          padding: "16px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          "&:last-child": { paddingBottom: "16px" },
        }}
      >
        <Box display="flex" alignItems="center" gap={2} width="100%">
          {/* Ranking */}
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: "bold",
              minWidth: "35px",
              fontSize: "18px",
            }}
          >
            {player.originalRank}º
          </Typography>

          {/* Player Photo */}
          <Avatar
            alt={player.name}
            src={player.photo_url}
            sx={{
              width: 50,
              height: 50,
              border: `2px solid ${theme.colors.border.purple}`,
              flexShrink: 0,
            }}
          />

          {/* Player Info */}
          <Box flex={1} minWidth={0}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: theme.colors.text.primary,
                lineHeight: 1.3,
                fontSize: "15px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {player.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              {player.team_logo_url && (
                <Avatar
                  alt={player.team_name}
                  src={player.team_logo_url}
                  sx={{ width: 18, height: 18, flexShrink: 0 }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  fontSize: "13px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {player.team_name}
              </Typography>
            </Box>
          </Box>

          {/* Goals */}
          <Chip
            icon={<SportsSoccer sx={{ fontSize: "16px !important" }} />}
            label={`${player.goals}`}
            sx={{
              backgroundColor: theme.colors.primary[600],
              color: "white",
              fontWeight: "bold",
              fontSize: "13px",
              height: "32px",
              minWidth: "60px",
              flexShrink: 0,
              "& .MuiChip-icon": {
                color: "white",
                fontSize: "16px",
              },
              "& .MuiChip-label": {
                paddingLeft: "6px",
                paddingRight: "8px",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
