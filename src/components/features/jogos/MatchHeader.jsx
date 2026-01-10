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
 * Mobile layout: Teams left/right, scores next to logos, date/time centered below
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
      } else if (
        homeGoals === awayGoals &&
        (competitionType === "Cup" || competitionType === "Supercup")
      ) {
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
      <CardContent sx={{ p: isMobile ? 2 : 4 }}>
        {/* Competition Badge */}
        <Box textAlign="center" mb={isMobile ? 2 : 3}>
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

        {/* Mobile Compact Layout */}
        {isMobile ? (
          <Box>
            {/* Teams and Scores Row */}
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
              >
                <img
                  src={matchDetails.home_team.logo_url}
                  alt={matchDetails.home_team.short_name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    marginBottom: "8px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "12px",
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

              {/* Home Score */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  px: 1,
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
              </Typography>

              {/* VS with Penalties */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                px={1}
              >
                {(matchDetails.competition_type === "Cup" ||
                  matchDetails.competition_type === "Supercup") &&
                matchDetails.home_penalties !== null ? (
                  <>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "10px", opacity: 0.8 }}
                    >
                      ({matchDetails.home_penalties})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "12px" }}
                    >
                      VS
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "10px", opacity: 0.8 }}
                    >
                      ({matchDetails.away_penalties})
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", fontSize: "12px" }}
                  >
                    VS
                  </Typography>
                )}
              </Box>

              {/* Away Score */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  px: 1,
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
              </Typography>

              {/* Away Team */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                flex={1}
              >
                <img
                  src={matchDetails.away_team.logo_url}
                  alt={matchDetails.away_team.short_name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    marginBottom: "8px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "12px",
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
            </Box>

            {/* Date and Time Centered */}
            <Box textAlign="center" mt={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <CalendarToday sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: "14px" }}>
                  {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
                </Typography>
                <AccessTime sx={{ fontSize: 16, ml: 1 }} />
                <Typography variant="body2" sx={{ fontSize: "14px" }}>
                  {matchDetails.match_time}
                </Typography>
              </Box>

              {(matchDetails.competition_type === "Cup" ||
                matchDetails.competition_type === "Supercup") &&
                (matchDetails.home_penalties !== null ||
                  matchDetails.away_penalties !== null) && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      fontStyle: "italic",
                      mt: 0.5,
                      opacity: 0.9,
                      fontSize: "11px",
                      display: "block",
                    }}
                  >
                    Depois de G.P
                  </Typography>
                )}
            </Box>

            {/* Stadium Info */}
            <Box
              textAlign="center"
              mt={2}
              pt={2}
              sx={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Stadium sx={{ fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.9, fontSize: "11px" }}
                >
                  {matchDetails.competition_type === "Supercup"
                    ? matchDetails.season === 2024
                      ? "Campo António Henrique de Matos"
                      : "Campo Municipal da Bela Vista"
                    : matchDetails.home_team.stadium_name}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            {/* Home Team */}
            <Grid item xs={12} sm={4} md={3}>
              <Box textAlign="center">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <img
                    src={matchDetails.home_team.logo_url}
                    alt={matchDetails.home_team.short_name}
                    style={{
                      width: "160px",
                      height: "160px",
                      objectFit: "contain",
                      marginBottom: "16px",
                    }}
                  />
                  <Typography
                    variant="h5"
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
                  variant="h2"
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
                  {(matchDetails.competition_type === "Cup" ||
                    matchDetails.competition_type === "Supercup") &&
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
                  <Typography variant="h5">
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
                  <Typography variant="h6">
                    {matchDetails.match_time}
                  </Typography>
                </Box>

                {(matchDetails.competition_type === "Cup" ||
                  matchDetails.competition_type === "Supercup") &&
                  (matchDetails.home_penalties !== null ||
                    matchDetails.away_penalties !== null) && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        mt: 1,
                        opacity: 0.9,
                      }}
                    >
                      Depois de Grandes Penalidades
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
                      width: "160px",
                      height: "160px",
                      objectFit: "contain",
                      marginBottom: "16px",
                    }}
                  />
                  <Typography
                    variant="h5"
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
                  variant="h2"
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
                  {(matchDetails.competition_type === "Cup" ||
                    matchDetails.competition_type === "Supercup") &&
                    matchDetails.away_penalties !== null &&
                    ` (${matchDetails.away_penalties})`}
                </Typography>
              </Box>
            </Grid>

            {/* Stadium Info */}
            <Grid item xs={12}>
              <Box
                textAlign="center"
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
                  <Typography
                    variant="body1"
                    sx={{ color: "white", opacity: 0.9 }}
                  >
                    {matchDetails.competition_type === "Supercup"
                      ? matchDetails.season === 2024
                        ? "Estádio: Campo António Henrique de Matos"
                        : "Estádio: Campo Municipal da Bela Vista"
                      : matchDetails.home_team.stadium_name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchHeader;
