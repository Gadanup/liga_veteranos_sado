import React from "react";
import { Box, Typography, Chip, Card, CardContent } from "@mui/material";
import { CalendarToday, LocationOn, AccessTime } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { theme } from "../../../../styles/theme";

/**
 * GroupMatchList Component
 * Displays list of matches for a specific group
 * Updated to match CupMatchCard design pattern
 *
 * @param {Array} matches - Array of match objects
 * @param {string} groupName - Name of the group
 * @param {boolean} isMobile - Whether the view is mobile
 */
const GroupMatchList = ({ matches, groupName, isMobile }) => {
  const router = useRouter();

  // Determine match result
  const determineMatchResult = (home_goals, away_goals) => {
    if (home_goals === null || away_goals === null) return null;
    if (home_goals > away_goals) return "home_win";
    if (home_goals < away_goals) return "away_win";
    return "draw";
  };

  // Get result styles
  const getResultStyles = (result, team) => {
    if (!result)
      return { color: theme.colors.text.secondary, fontWeight: "normal" };

    const isWinner =
      (result === "home_win" && team === "home") ||
      (result === "away_win" && team === "away");

    if (result === "draw") {
      return {
        color: theme.colors.sports.draw,
        fontWeight: "bold",
      };
    }

    return {
      color: isWinner ? theme.colors.sports.win : theme.colors.sports.loss,
      fontWeight: isWinner ? "bold" : "normal",
    };
  };

  const handleMatchClick = (matchId) => {
    router.push(`/jogos/${matchId}`);
  };

  // No matches state
  if (!matches || matches.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: theme.colors.background.card,
          borderRadius: "16px",
          boxShadow: theme.shadows.md,
          padding: 4,
          textAlign: "center",
          marginTop: 3,
        }}
      >
        <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
          Nenhum jogo agendado para o Grupo {groupName}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(350px, 1fr))",
          gap: theme.spacing.lg,
        }}
      >
        {matches.map((match) => {
          const result = determineMatchResult(
            match.home_goals,
            match.away_goals
          );
          const isPlayed = result !== null;

          return (
            <Card
              key={match.match_id}
              onClick={() => handleMatchClick(match.match_id)}
              sx={{
                cursor: "pointer",
                backgroundColor: theme.colors.background.card,
                borderRadius: "16px",
                border: `2px solid transparent`,
                boxShadow: theme.components.card.shadow,
                height: "100%",
                minHeight: "200px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.components.card.hoverShadow,
                  border: `2px solid ${theme.colors.accent[500]}`,
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
              <CardContent
                sx={{
                  padding: "20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Status Chip + Group Badge */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Chip
                    label={isPlayed ? "Finalizado" : "Agendado"}
                    size="small"
                    sx={{
                      backgroundColor: isPlayed
                        ? `${theme.colors.success[500]}15`
                        : `${theme.colors.secondary[500]}15`,
                      color: isPlayed
                        ? theme.colors.success[500]
                        : theme.colors.secondary[500],
                      fontWeight: theme.typography.fontWeight.semibold,
                      fontSize: theme.typography.fontSize.xs,
                    }}
                  />
                  {/* Group Badge */}
                  <Box
                    sx={{
                      backgroundColor: theme.colors.primary[100],
                      color: theme.colors.primary[700],
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Grupo {groupName}
                  </Box>
                </Box>

                {/* Date & Time */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  justifyContent="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarToday
                      sx={{
                        fontSize: 14,
                        color: theme.colors.primary[600],
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontWeight: "500",
                      }}
                    >
                      {dayjs(match.match_date).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>
                  {match.match_time && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTime
                        sx={{
                          fontSize: 14,
                          color: theme.colors.primary[600],
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.text.secondary,
                          fontWeight: "500",
                        }}
                      >
                        {match.match_time.slice(0, 5)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Teams Display */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  {/* Home Team */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    flex={1}
                    gap={1}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.colors.background.secondary,
                        border: `2px solid ${theme.colors.border.primary}`,
                      }}
                    >
                      {match.home_team_logo && (
                        <img
                          src={match.home_team_logo}
                          alt={match.home_team_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        ...getResultStyles(result, "home"),
                        fontSize: "13px",
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {match.home_team_name}
                    </Typography>
                  </Box>

                  {/* Score/VS */}
                  <Box
                    sx={{
                      backgroundColor: isPlayed
                        ? theme.colors.primary[600]
                        : theme.colors.neutral[400],
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      minWidth: "60px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: 1,
                    }}
                  >
                    {isPlayed
                      ? `${match.home_goals} - ${match.away_goals}`
                      : "VS"}
                  </Box>

                  {/* Away Team */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    flex={1}
                    gap={1}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.colors.background.secondary,
                        border: `2px solid ${theme.colors.border.primary}`,
                      }}
                    >
                      {match.away_team_logo && (
                        <img
                          src={match.away_team_logo}
                          alt={match.away_team_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        ...getResultStyles(result, "away"),
                        fontSize: "13px",
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {match.away_team_name}
                    </Typography>
                  </Box>
                </Box>

                {/* Stadium Info */}
                {match.stadium && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    sx={{
                      backgroundColor: theme.colors.background.secondary,
                      padding: "8px 12px",
                      borderRadius: "12px",
                    }}
                  >
                    <LocationOn
                      sx={{ fontSize: 14, color: theme.colors.primary[600] }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {match.stadium}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default GroupMatchList;
