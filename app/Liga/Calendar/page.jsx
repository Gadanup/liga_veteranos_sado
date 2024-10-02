"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Card, CardContent, Button } from "@mui/material";
import dayjs from "dayjs";

const LeagueFixtures = () => {
  const [fixturesByWeek, setFixturesByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);

  const readAllMatches = async () => {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(`
        id,
        match_date,
        venue,
        round,
        week,
        home_goals,
        away_goals,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url), 
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `)
      .order("week", { ascending: true })
      .order("match_date", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error);
    } else {
      // Group matches by week
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

  const findClosestWeek = (groupedMatches) => {
    const today = dayjs();
    let closestWeek = null;
    let minDateDifference = Infinity;

    // Find the week with the match closest to today's date
    Object.keys(groupedMatches).forEach(week => {
      groupedMatches[week].forEach(match => {
        const matchDate = dayjs(match.match_date);
        const diff = Math.abs(matchDate.diff(today, 'day')); // Difference in days
        if (diff < minDateDifference) {
          minDateDifference = diff;
          closestWeek = week;
        }
      });
    });
    return closestWeek;
  };

  useEffect(() => {
    readAllMatches(); // Fetch all matches when the component loads
  }, []);

  const handleWeekChange = (week) => {
    setCurrentWeek(week); // Update the currently visible week
  };

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
    <div className="max-w-6xl">
      <Typography variant="h4" align="center" gutterBottom>
        Match Fixtures
      </Typography>

      {/* Week Navigation Buttons */}
      <Box mb={4} textAlign="center">
        {Object.keys(fixturesByWeek).map((week) => (
          <Button
            key={week}
            variant={currentWeek === week ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleWeekChange(week)}
            style={{ margin: "0 5px" }}
          >
            Week {week}
          </Button>
        ))}
      </Box>

      {currentWeek && fixturesByWeek[currentWeek] && (
        <Box>
          <Card elevation={3} style={{ marginBottom: '20px' }}>
            <CardContent>
              {/* Week Header */}
              <Typography variant="h5" gutterBottom>
                Fixtures for Week {currentWeek}
              </Typography>

              {/* Matches Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Match Date</TableCell>
                      <TableCell>Home Team</TableCell>
                      <TableCell>Away Team</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Round</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fixturesByWeek[currentWeek].map((match) => {
                      const matchResult = determineMatchResult(match.home_goals, match.away_goals);

                      return (
                        <TableRow key={match.id}>
                          <TableCell>{dayjs(match.match_date).format('DD MMM YYYY')}</TableCell>
                          <TableCell>
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
                          <TableCell>
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
                          <TableCell>{match.venue}</TableCell>
                          <TableCell>{match.round}</TableCell>
                          <TableCell>
                            {match.home_goals !== null && match.away_goals !== null ? (
                              <Typography
                                style={{
                                  fontWeight: "bold",
                                  color:
                                    matchResult === "draw"
                                      ? "gray"
                                      : matchResult === "home_win"
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {match.home_goals} - {match.away_goals}{" "}
                                {matchResult === "draw" ? "(Draw)" : ""}
                              </Typography>
                            ) : (
                              <Typography color="textSecondary">TBD</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default LeagueFixtures;
