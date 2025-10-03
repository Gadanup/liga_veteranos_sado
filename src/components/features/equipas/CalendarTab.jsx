import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { theme } from "../../../styles/theme.js";

/**
 * CalendarTab Component
 * Displays team's match calendar with results
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

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            {teamFixtures.map((match, index) => {
              const isHomeTeam =
                match.home_team.short_name === teamData.short_name;
              const result = determineMatchResult(
                match.home_goals,
                match.away_goals,
                isHomeTeam
              );

              return (
                <TableRow
                  onClick={() => router.push(`/jogos/${match.id}`)}
                  key={match.id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      index % 2 === 0
                        ? theme.colors.background.card
                        : theme.colors.background.tertiary,
                    "&:hover": {
                      backgroundColor: theme.colors.primary[50],
                    },
                    transition: theme.transitions.normal,
                  }}
                >
                  {/* Date & Time Column */}
                  <TableCell sx={{ py: 2 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        {match.match_date
                          ? dayjs(match.match_date).format("DD/MM/YYYY")
                          : "Data a definir"}
                      </Typography>
                      {match.match_time && (
                        <Typography
                          variant="caption"
                          sx={{ color: theme.colors.text.secondary }}
                        >
                          {match.match_time}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Home Team Column */}
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={1}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            isHomeTeam && result === "win"
                              ? theme.typography.fontWeight.bold
                              : theme.typography.fontWeight.medium,
                        }}
                      >
                        {match.home_team.short_name}
                      </Typography>
                      <img
                        src={match.home_team.logo_url}
                        alt={match.home_team.short_name}
                        style={{
                          width: "24px",
                          height: "24px",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* Score Column */}
                  <TableCell sx={{ py: 2, textAlign: "center" }}>
                    {match.home_goals !== null && match.away_goals !== null ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        justifyContent="center"
                      >
                        <Chip
                          label={getResultBadge(result)}
                          size="small"
                          sx={{
                            backgroundColor: getResultColor(result),
                            color: "white",
                            fontWeight: theme.typography.fontWeight.bold,
                            minWidth: "24px",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: theme.typography.fontWeight.bold,
                          }}
                        >
                          {match.home_goals} - {match.away_goals}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: theme.typography.fontWeight.bold,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        VS
                      </Typography>
                    )}
                  </TableCell>

                  {/* Away Team Column */}
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src={match.away_team.logo_url}
                        alt={match.away_team.short_name}
                        style={{
                          width: "24px",
                          height: "24px",
                          objectFit: "contain",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight:
                            !isHomeTeam && result === "win"
                              ? theme.typography.fontWeight.bold
                              : theme.typography.fontWeight.medium,
                        }}
                      >
                        {match.away_team.short_name}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Stadium Column (hidden on mobile) */}
                  <TableCell
                    sx={{
                      py: 2,
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.text.secondary }}
                    >
                      {match.home_team.stadium_name}
                    </Typography>
                  </TableCell>

                  {/* Competition Column (hidden on mobile) */}
                  <TableCell
                    sx={{
                      py: 2,
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    <Chip
                      label={renderCompetitionDetails(match)}
                      size="small"
                      sx={{
                        backgroundColor: theme.colors.secondary[100],
                        color: theme.colors.secondary[700],
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CalendarTab;
