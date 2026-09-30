import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { theme } from "../../../styles/theme.js";
import { formatMatchTime } from "../../../utils/matchTime";

/**
 * CalendarTab Component
 * Team's match calendar, one stacked row per match.
 *
 * The two teams sit one above the other with their goals on the right, so the
 * away team is readable at 360px — the old table was 409px wide inside a 291px
 * container and needed horizontal scrolling to see who the opponent was.
 *
 * @param {Object} teamData - Team information
 * @param {Array} teamFixtures - List of matches
 */
const CalendarTab = ({ teamData, teamFixtures }) => {
  const router = useRouter();

  /**
   * Determines the match result from the team's perspective
   * @param {number} home_goals - Home team goals
   * @param {number} away_goals - Away team goals
   * @param {boolean} isHomeTeam - Whether the current team is playing at home
   * @returns {string} - "win", "loss", "draw", or "pending"
   */
  const determineMatchResult = (home_goals, away_goals, isHomeTeam) => {
    if (home_goals === null || away_goals === null) return "pending";

    if (home_goals > away_goals) {
      return isHomeTeam ? "win" : "loss";
    } else if (home_goals < away_goals) {
      return isHomeTeam ? "loss" : "win";
    } else {
      return "draw";
    }
  };

  /**
   * Translates competition type to Portuguese
   */
  const translateCompetitionType = (competitionType) => {
    const translations = {
      Supercup: "Supertaça",
      Cup: "Taça",
      League: "Liga",
    };
    return translations[competitionType] || competitionType;
  };

  /**
   * Renders competition details with proper formatting
   */
  const renderCompetitionDetails = (match) => {
    const competitionType = translateCompetitionType(match.competition_type);

    if (match.competition_type === "Supercup") {
      return competitionType;
    } else if (match.competition_type === "Cup") {
      return `${competitionType} - Ronda ${match.round}`;
    } else if (match.competition_type === "League") {
      return `Jornada ${match.week}`;
    } else {
      return competitionType;
    }
  };

  /**
   * Gets the appropriate color for match result
   */
  const getResultColor = (result) => {
    switch (result) {
      case "win":
        return theme.colors.success[600];
      case "loss":
        return theme.colors.error[600];
      case "draw":
        return theme.colors.warning[600];
      default:
        return theme.colors.text.secondary;
    }
  };

  /**
   * Gets the result badge letter (V/D/E)
   */
  const getResultBadge = (result) => {
    switch (result) {
      case "win":
        return "V"; // Vitória
      case "loss":
        return "D"; // Derrota
      case "draw":
        return "E"; // Empate
      default:
        return "-";
    }
  };

  /** One side of the tie: logo, name, goals. */
  const TeamLine = ({ team, goals, isWinner, isThisTeam }) => (
    <Box display="flex" alignItems="center" gap={1} minWidth={0}>
      <Box
        component="img"
        src={team.logo_url}
        alt=""
        sx={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0 }}
      />
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: isThisTeam
            ? theme.typography.fontWeight.bold
            : theme.typography.fontWeight.medium,
          color: isThisTeam
            ? theme.colors.text.primary
            : theme.colors.text.secondary,
        }}
      >
        {team.short_name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          width: 20,
          textAlign: "right",
          flexShrink: 0,
          fontWeight: isWinner
            ? theme.typography.fontWeight.bold
            : theme.typography.fontWeight.medium,
          color:
            goals === null
              ? theme.colors.text.tertiary
              : theme.colors.text.primary,
        }}
      >
        {goals === null ? "–" : goals}
      </Typography>
    </Box>
  );

  return (
    <Box>
      {teamFixtures.map((match, index) => {
        const isHomeTeam = match.home_team.short_name === teamData.short_name;
        const result = determineMatchResult(
          match.home_goals,
          match.away_goals,
          isHomeTeam
        );
        const played = match.home_goals !== null && match.away_goals !== null;

        return (
          <Box
            key={match.id}
            onClick={() => router.push(`/jogos/${match.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/jogos/${match.id}`);
              }
            }}
            sx={{
              cursor: "pointer",
              px: { xs: 1.5, md: 2 },
              py: 1.5,
              // The result reads as a colour before you read the score.
              borderLeft: `4px solid ${
                played ? getResultColor(result) : theme.colors.border.primary
              }`,
              borderBottom: `1px solid ${theme.colors.border.primary}`,
              backgroundColor:
                index % 2 === 0
                  ? theme.colors.background.card
                  : theme.colors.background.tertiary,
              transition: theme.transitions.normal,
              "@media (hover: hover)": {
                "&:hover": { backgroundColor: theme.colors.primary[50] },
              },
            }}
          >
            {/* Date, time, competition */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mb={1}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.colors.text.secondary }}
              >
                {match.match_date
                  ? dayjs(match.match_date).format("DD/MM/YYYY")
                  : "Data a definir"}
                {match.match_time && ` · ${formatMatchTime(match.match_time)}`}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                <Chip
                  label={renderCompetitionDetails(match)}
                  size="small"
                  sx={{
                    backgroundColor: theme.colors.secondary[100],
                    color: theme.colors.secondary[700],
                    fontSize: "0.7rem",
                    height: 20,
                  }}
                />
                {played && (
                  <Chip
                    label={getResultBadge(result)}
                    size="small"
                    sx={{
                      backgroundColor: getResultColor(result),
                      color: "white",
                      fontWeight: theme.typography.fontWeight.bold,
                      fontSize: "0.7rem",
                      height: 20,
                      width: 24,
                      "& .MuiChip-label": { px: 0 },
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* The two teams, stacked */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <TeamLine
                team={match.home_team}
                goals={match.home_goals}
                isWinner={played && match.home_goals > match.away_goals}
                isThisTeam={isHomeTeam}
              />
              <TeamLine
                team={match.away_team}
                goals={match.away_goals}
                isWinner={played && match.away_goals > match.home_goals}
                isThisTeam={!isHomeTeam}
              />
            </Box>

            {/* Stadium — there is room for it from md up */}
            <Typography
              variant="caption"
              sx={{
                display: { xs: "none", md: "block" },
                mt: 0.5,
                color: theme.colors.text.tertiary,
              }}
            >
              {match.stadium_name || match.home_team.stadium_name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CalendarTab;
