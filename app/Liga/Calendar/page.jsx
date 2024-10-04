"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";

/**
 * LeagueFixtures Component
 * 
 * This component fetches and displays football match fixtures grouped by week.
 * It allows navigation between different weeks using buttons and shows details
 * of matches like teams, stadiums, results, and match date and time.
 */
const LeagueFixtures = () => {
  const [fixturesByWeek, setFixturesByWeek] = useState({}); // Store fixtures grouped by week
  const [currentWeek, setCurrentWeek] = useState(null); // Current visible week

  // Media query for responsive styles
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  /**
   * Fetches all matches from the Supabase database.
   * Matches are fetched and grouped by week.
   * Sets the current week based on the closest upcoming match date.
   */
  const readAllMatches = async () => {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(`
        id,
        match_date,
        match_time,
        week,
        home_goals,
        away_goals,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `)
      .eq("competition_type", "League")
      .eq("season", "2024")
      .order("week", { ascending: true })
      .order("match_date", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error);
    } else {
      // Group matches by week for easier navigation
      const groupedByWeek = matches.reduce((acc, match) => {
        const week = match.week;
        if (!acc[week]) {
          acc[week] = [];
        }
        acc[week].push(match);
        return acc;
      }, {});

      setFixturesByWeek(groupedByWeek);

      // Set the closest week based on the current date
      const closestWeek = findClosestWeek(groupedByWeek);
      setCurrentWeek(closestWeek);
    }
  };

  /**
   * Finds the closest week with a match to today's date.
   * 
   * @param {Object} groupedMatches - Matches grouped by week.
   * @returns {string|null} The closest week's number or null if no matches.
   */
  const findClosestWeek = (groupedMatches) => {
    const today = dayjs();
    let closestWeek = null;
    let minDateDifference = Infinity;

    // Iterate over each week's matches to find the closest match date
    Object.keys(groupedMatches).forEach((week) => {
      groupedMatches[week].forEach((match) => {
        const matchDate = dayjs(match.match_date);
        const diff = Math.abs(matchDate.diff(today, "day")); // Difference in days
        if (diff < minDateDifference) {
          minDateDifference = diff;
          closestWeek = week;
        }
      });
    });
    return closestWeek;
  };

  /**
   * Called when the component is first loaded.
   * Fetches all matches and initializes the view with the closest week.
   */
  useEffect(() => {
    readAllMatches(); // Fetch all matches when the component loads
  }, []);

  /**
   * Handles changing the visible week.
   * 
   * @param {string} week - The week number to switch to.
   */
  const handleWeekChange = (week) => {
    setCurrentWeek(week); // Update the currently visible week
  };

  /**
   * Determines the result of a match based on home and away goals.
   * 
   * @param {number|null} home_goals - Number of home team goals.
   * @param {number|null} away_goals - Number of away team goals.
   * @returns {string} - 'home_win', 'away_win', or 'draw' based on the goals.
   */
  const determineMatchResult = (home_goals, away_goals) => {
    if (home_goals > away_goals) {
      return "home_win";
    } else if (home_goals < away_goals) {
      return "away_win";
    } else {
      return "draw";
    }
  };

  return (
    <div>
      {/* Page Header */}
      <Typography variant="h3" align="center" gutterBottom>
        Jornadas
      </Typography>

      {/* Week Navigation Buttons */}
      <Box mb={4} textAlign="center">
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
          {Object.keys(fixturesByWeek).map((week) => (
            <Button
              key={week}
              variant={currentWeek === week ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleWeekChange(week)}
              style={{
                margin: "5px", // Create a small margin for spacing
                padding: "2px 8px", // Reduce padding to make buttons more compact
                minWidth: "40px", // Make buttons narrower
              }}
            >
              {week}
            </Button>
          ))}
        </Box>
      </Box>

      {currentWeek && fixturesByWeek[currentWeek] && (
        <Box 
          sx={{
            margin: isSmallScreen ? "1rem" : "4rem", // Responsive margin
          }}
        >
          {/* Week Header */}
          <Typography variant="h5" align="center" gutterBottom>
            Jornada {currentWeek}
          </Typography>

          {/* Matches Table */}
          <TableContainer>
            <Table style={{ borderCollapse: "collapse" }}>
              <TableBody>
                {fixturesByWeek[currentWeek].map((match) => {
                  const matchResult = determineMatchResult(
                    match.home_goals,
                    match.away_goals
                  );

                  return (
                    <TableRow key={match.id} style={{ borderBottom: "none" }}>
                      {/* Match Date and Time */}
                      <TableCell style={{ borderBottom: "none" }}>
                        {dayjs(match.match_date).format("DD/MM/YYYY")} 
                        {match.match_time && (
                          <Typography variant="body2">
                            {match.match_time}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Home Team */}
                      <TableCell style={{ borderBottom: "none" }}>
                        <Box display="flex" alignItems="center">
                          <img
                            src={match.home_team.logo_url}
                            alt={match.home_team.short_name}
                            style={{ width: "30px", marginRight: "10px" }}
                          />
                          <span
                            style={{
                              fontWeight:
                                matchResult === "home_win" ? "bold" : "normal",
                              color:
                                matchResult === "home_win" ? "green" : "inherit",
                            }}
                          >
                            {match.home_team.short_name}
                          </span>
                        </Box>
                      </TableCell>

                      {/* VS Text */}
                      <TableCell
                        style={{
                          borderBottom: "none",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        VS
                      </TableCell>

                      {/* Away Team */}
                      <TableCell style={{ borderBottom: "none" }}>
                        <Box display="flex" alignItems="center">
                          <img
                            src={match.away_team.logo_url}
                            alt={match.away_team.short_name}
                            style={{ width: "30px", marginRight: "10px" }}
                          />
                          <span
                            style={{
                              fontWeight:
                                matchResult === "away_win" ? "bold" : "normal",
                              color:
                                matchResult === "away_win" ? "green" : "inherit",
                            }}
                          >
                            {match.away_team.short_name}
                          </span>
                        </Box>
                      </TableCell>

                      {/* Match Result */}
                      <TableCell style={{ borderBottom: "none", fontWeight: "bold" }}>
                        {match.home_goals !== null && match.away_goals !== null ? (
                          <span
                            style={{
                              color:
                                matchResult === "draw"
                                  ? "gray"
                                  : matchResult === "home_win"
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {match.home_goals} - {match.away_goals}
                          </span>
                        ) : (
                          <Typography color="textSecondary">TBD</Typography>
                        )}
                      </TableCell>

                      {/* Stadium Name */}
                      <TableCell style={{ borderBottom: "none" }}>
                        {match.home_team.stadium_name}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
};

export default LeagueFixtures;
