import React from "react";
import { Card, CardContent, Box, Typography, Grid, Chip } from "@mui/material";
import { Warning } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * DisciplineCard Component
 * Displays team discipline information in a card
 *
 * @param {Object} team - Team discipline data
 * @param {number} position - Team's position in discipline ranking
 * @param {Function} onClick - Callback when card is clicked
 * @param {boolean} isMobile - Whether viewing on mobile
 */
const DisciplineCard = ({ team, position, onClick, isMobile }) => {
  const isExcluded = team.excluded;
  const averagePoints =
    team.matches_played > 0
      ? (team.calculated_points / team.matches_played).toFixed(2)
      : "0.00";

  const getDisciplineColor = (position) => {
    if (position <= 3) return theme.colors.sports.win;
    if (position <= 6) return theme.colors.sports.draw;
    return theme.colors.sports.loss;
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        background: isExcluded
          ? `linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)`
          : `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.background.tertiary} 100%)`,
        borderRadius: "16px",
        border: `2px solid ${isExcluded ? theme.colors.sports.loss : theme.colors.border.purple}`,
        boxShadow: theme.components.card.shadow,
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.components.card.hoverShadow,
          borderColor: theme.colors.accent[500],
          "&::before": {
            opacity: 1,
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: theme.colors.themed.goldGradient,
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
      }}
    >
      <CardContent sx={{ padding: isMobile ? 2 : 3 }}>
        {/* Position Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            background: getDisciplineColor(position),
            color: "white",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {position}º
        </Box>

        {/* Team Header */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <img
            src={team.teams.logo_url}
            alt={`${team.teams.short_name} logo`}
            style={{
              width: isMobile ? "40px" : "44px",
              height: isMobile ? "40px" : "44px",
              objectFit: "contain",
              borderRadius: "50%",
              border: `2px solid ${theme.colors.border.purple}`,
            }}
          />
          <Box flex={1}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: "bold",
                color: isExcluded
                  ? theme.colors.sports.loss
                  : theme.colors.text.primary,
                fontSize: isMobile ? "16px" : "18px",
                lineHeight: 1.2,
              }}
            >
              {team.teams.short_name}
            </Typography>
            {isExcluded && (
              <Chip
                icon={<Warning />}
                label="Excluída"
                size="small"
                sx={{
                  backgroundColor: theme.colors.sports.loss,
                  color: "white",
                  fontSize: "11px",
                  mt: 0.5,
                  "& .MuiChip-icon": { color: "white", fontSize: "14px" },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={1} mb={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                background: theme.colors.background.secondary,
                padding: "8px 12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.colors.text.secondary }}
              >
                Jogos
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: theme.colors.text.primary }}
              >
                {isExcluded ? "-" : team.matches_played}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                background: theme.colors.background.secondary,
                padding: "8px 12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.colors.text.secondary }}
              >
                Pontos
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: theme.colors.text.primary }}
              >
                {isExcluded ? "-" : team.calculated_points}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Cards Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: "16px",
                height: "22px",
                backgroundColor: "#ffcd00",
                borderRadius: "2px",
                border: "1px solid #000",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {isExcluded ? "-" : team.yellow_cards}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: "16px",
                height: "22px",
                backgroundColor: "#ef4444",
                borderRadius: "2px",
                border: "1px solid #000",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {isExcluded ? "-" : team.red_cards}
            </Typography>
          </Box>

          <Box
            sx={{
              background: theme.colors.primary[600],
              color: "white",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Média: {isExcluded ? "-" : averagePoints}
          </Box>
        </Box>

        {/* Players Status */}
        {(team.suspendedPlayers.length > 0 ||
          team.atRiskPlayers.length > 0) && (
          <Box>
            {team.suspendedPlayers.length > 0 && (
              <Box mb={1}>
                <Typography
                  variant="caption"
                  sx={{ color: theme.colors.sports.loss, fontWeight: "bold" }}
                >
                  Suspensos:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colors.sports.loss }}
                >
                  {team.suspendedPlayers.join(", ")}
                </Typography>
              </Box>
            )}
            {team.atRiskPlayers.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: theme.colors.sports.draw, fontWeight: "bold" }}
                >
                  Em Risco:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colors.sports.draw }}
                >
                  {team.atRiskPlayers.join(", ")}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DisciplineCard;
