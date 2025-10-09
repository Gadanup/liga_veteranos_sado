import React from "react";
import { Card, CardContent, Box, Typography, Grid, Chip } from "@mui/material";
import {
  EmojiEvents,
  CalendarToday,
  AccessTime,
  Stadium,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { theme } from "../../../styles/theme.js";

/**
 * MatchHeader Component
 * Displays match details including teams, score, date, and stadium
 *
 * @param {Object} matchDetails - Match information
 */
const MatchHeader = ({ matchDetails }) => {
  const isMobile = window.innerWidth <= 768;

  const getTeamStyles = (
    homeGoals,
    awayGoals,
    homePenalties,
    awayPenalties,
    competitionType,
    team
  ) => {
    if (homeGoals !== null && awayGoals !== null) {
      if (homeGoals > awayGoals && team === "home") {
        return { fontWeight: "bold", color: theme.colors.accent[500] };
      } else if (awayGoals > homeGoals && team === "away") {
        return { fontWeight: "bold", color: theme.colors.accent[500] };
      } else if (homeGoals === awayGoals && competitionType === "Cup") {
        if (homePenalties > awayPenalties && team === "home") {
          return { fontWeight: "bold", color: theme.colors.accent[500] };
        } else if (awayPenalties > homePenalties && team === "away") {
          return { fontWeight: "bold", color: theme.colors.accent[500] };
        }
      }
    }
    return {};
  };

  return (
    <Card
      sx={{
        background: theme.colors.themed.purpleGradient,
        color: "white",
        mb: 4,
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: isMobile ? 3 : 4 }}>
        {/* Competition Badge */}
        <Box textAlign="center" mb={3}>
          <Chip
            icon={<EmojiEvents />}
            label={
              matchDetails.competition_type === "League"
                ? `Jornada ${matchDetails.week}`
                : matchDetails.competition_type === "Cup"
                  ? `Taça : Ronda ${matchDetails.round}`
                  : "Supertaça"
            }
            sx={{
              backgroundColor: theme.colors.accent[500],
              color: theme.colors.neutral[900],
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
            }}
          />
        </Box>

        {/* Match Display */}
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Home Team */}
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <img
                  src={matchDetails.home_team.logo_url}
                  alt={matchDetails.home_team.short_name}
                  style={{
                    width: isMobile ? "120px" : "160px",
                    height: isMobile ? "120px" : "160px",
                    objectFit: "contain",
                    marginBottom: "16px",
                  }}
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    textAlign: "center",
                    ...getTeamStyles(
                      matchDetails.home_goals,
                      matchDetails.away_goals,
                      matchDetails.home_penalties,
                      matchDetails.away_penalties,
                      matchDetails.competition_type,
                      "home"
                    ),
                  }}
                >
                  {matchDetails.home_team.short_name}
                </Typography>
              </Box>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{
                  fontWeight: "bold",
                  ...getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    matchDetails.home_penalties,
                    matchDetails.away_penalties,
                    matchDetails.competition_type,
                    "home"
                  ),
                }}
              >
                {matchDetails.home_goals !== null
                  ? matchDetails.home_goals
                  : "-"}
                {matchDetails.competition_type === "Cup" &&
                  matchDetails.home_penalties !== null &&
                  ` (${matchDetails.home_penalties})`}
              </Typography>
            </Box>
          </Grid>

          {/* Date and Time */}
          <Grid item xs={12} sm={4} md={6}>
            <Box textAlign="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                mb={2}
              >
                <CalendarToday sx={{ fontSize: 20 }} />
                <Typography variant={isMobile ? "h6" : "h5"}>
                  {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <AccessTime sx={{ fontSize: 20 }} />
                <Typography variant="h6">{matchDetails.match_time}</Typography>
              </Box>

              {matchDetails.competition_type === "Cup" &&
                (matchDetails.home_penalties !== null ||
                  matchDetails.away_penalties !== null) && (
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    sx={{
                      fontWeight: "bold",
                      fontStyle: "italic",
                      mt: 1,
                      opacity: 0.9,
                    }}
                  >
                    {isMobile
                      ? "Depois de G.P"
                      : "Depois de Grandes Penalidades"}
                  </Typography>
                )}
            </Box>
          </Grid>

          {/* Away Team */}
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <img
                  src={matchDetails.away_team.logo_url}
                  alt={matchDetails.away_team.short_name}
                  style={{
                    width: isMobile ? "120px" : "160px",
                    height: isMobile ? "120px" : "160px",
                    objectFit: "contain",
                    marginBottom: "16px",
                  }}
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    textAlign: "center",
                    ...getTeamStyles(
                      matchDetails.home_goals,
                      matchDetails.away_goals,
                      matchDetails.home_penalties,
                      matchDetails.away_penalties,
                      matchDetails.competition_type,
                      "away"
                    ),
                  }}
                >
                  {matchDetails.away_team.short_name}
                </Typography>
              </Box>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{
                  fontWeight: "bold",
                  ...getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    matchDetails.home_penalties,
                    matchDetails.away_penalties,
                    matchDetails.competition_type,
                    "away"
                  ),
                }}
              >
                {matchDetails.away_goals !== null
                  ? matchDetails.away_goals
                  : "-"}
                {matchDetails.competition_type === "Cup" &&
                  matchDetails.away_penalties !== null &&
                  ` (${matchDetails.away_penalties})`}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Stadium Info */}
        <Box
          textAlign="center"
          mt={3}
          pt={2}
          sx={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Stadium sx={{ color: "white", fontSize: 20 }} />
            <Typography variant="body1" sx={{ color: "white", opacity: 0.9 }}>
              {matchDetails.competition_type === "Supercup"
                ? matchDetails.season === 2024
                  ? "Estádio: Campo António Henrique de Matos"
                  : "Estádio: Campo Municipal da Bela Vista"
                : matchDetails.home_team.stadium_name}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchHeader;
