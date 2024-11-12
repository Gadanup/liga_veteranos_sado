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
import { useRouter } from "next/navigation";

const LeagueFixtures = () => {
  const [fixturesByWeek, setFixturesByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const readAllMatches = async () => {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        id,
        match_date,
        match_time,
        week,
        home_goals,
        away_goals,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "League")
      .eq("season", "2024")
      .order("week", { ascending: true })
      .order("match_date", { ascending: true });

    if (!error) {
      const groupedByWeek = matches.reduce((acc, match) => {
        const week = match.week;
        if (!acc[week]) acc[week] = [];
        acc[week].push(match);
        return acc;
      }, {});

      setFixturesByWeek(groupedByWeek);
      setCurrentWeek(findClosestWeek(groupedByWeek));
    }
  };

  const findClosestWeek = (groupedMatches) => {
    const today = dayjs();
    let closestWeek = null;
    let minDateDifference = Infinity;

    Object.keys(groupedMatches).forEach((week) => {
      groupedMatches[week].forEach((match) => {
        const matchDate = dayjs(match.match_date);
        const diff = Math.abs(matchDate.diff(today, "day"));
        if (diff < minDateDifference) {
          minDateDifference = diff;
          closestWeek = week;
        }
      });
    });
    return closestWeek;
  };

  useEffect(() => {
    readAllMatches();
  }, []);

  const handleWeekChange = (week) => setCurrentWeek(week);

  const determineMatchResult = (home_goals, away_goals) => {
    if (home_goals > away_goals) return "home_win";
    if (home_goals < away_goals) return "away_win";
    return "draw";
  };

  // Calculate previous and next week
  const weekList = Object.keys(fixturesByWeek);
  const currentWeekIndex = weekList.indexOf(currentWeek);
  const previousWeek = weekList[currentWeekIndex - 1] || null;
  const nextWeek = weekList[currentWeekIndex + 1] || null;

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#6B4BA1" }}
        gutterBottom
      >
        JORNADAS
      </Typography>

      <Box mb={4} textAlign="center">
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
          {isSmallScreen ? (
            <>
              {/* "Back" button for the previous week */}
              <Button
                variant="outlined"
                disabled={!previousWeek}
                onClick={() => handleWeekChange(previousWeek)}
                style={{
                  margin: "5px",
                  padding: "2px 8px",
                  minWidth: "40px",
                }}
              >
                Back
              </Button>

              {/* Display only the current week */}
              {currentWeek && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    margin: "5px",
                    padding: "2px 8px",
                    minWidth: "40px",
                  }}
                >
                  {currentWeek}
                </Button>
              )}

              {/* "Next" button for the following week */}
              <Button
                variant="outlined"
                disabled={!nextWeek}
                onClick={() => handleWeekChange(nextWeek)}
                style={{
                  margin: "5px",
                  padding: "2px 8px",
                  minWidth: "40px",
                }}
              >
                Next
              </Button>
            </>
          ) : (
            // Display full list of weeks for larger screens
            weekList.map((week) => (
              <Button
                key={week}
                variant={currentWeek === week ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleWeekChange(week)}
                style={{
                  margin: "5px",
                  padding: "2px 8px",
                  minWidth: "40px",
                }}
              >
                {week}
              </Button>
            ))
          )}
        </Box>
      </Box>

      {currentWeek && fixturesByWeek[currentWeek] && (
        <Box sx={{ margin: isSmallScreen ? "1rem" : "4rem" }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: "#6B4BA1" }}
            gutterBottom
          >
            Jornada {currentWeek}
          </Typography>

          <TableContainer>
            <Table style={{ borderCollapse: "collapse" }}>
              <TableBody>
                {fixturesByWeek[currentWeek].map((match, index) => {
                  const matchResult = determineMatchResult(
                    match.home_goals,
                    match.away_goals
                  );

                  return (
                    <React.Fragment key={match.id}>
                      <TableRow
                        onClick={() => router.push(`/Jogos/${match.id}`)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            index % 2 !== 0
                              ? "rgba(165, 132, 224, 0.1)"
                              : "inherit",
                          "&:hover": {
                            backgroundColor: "rgba(165, 132, 224, 0.2)",
                          },
                        }}
                      >
                        {/* Match Date and Time - Only show on larger screens */}
                        {!isSmallScreen && (
                          <TableCell sx={{ borderBottom: "none" }}>
                            {match.match_date
                              ? dayjs(match.match_date).format("DD/MM/YYYY")
                              : "Data a definir"}
                            {match.match_time && (
                              <Typography variant="body2">
                                {match.match_time}
                              </Typography>
                            )}
                          </TableCell>
                        )}
                        <TableCell sx={{ borderBottom: "none" }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                          >
                            <span
                              style={{
                                fontWeight:
                                  matchResult === "home_win"
                                    ? "bold"
                                    : "normal",
                                color:
                                  matchResult === "home_win"
                                    ? "green"
                                    : "inherit",
                              }}
                            >
                              {match.home_team.short_name}
                            </span>
                            <img
                              src={match.home_team.logo_url}
                              alt={match.home_team.short_name}
                              style={{ width: "30px", marginLeft: "5px" }}
                            />
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            borderBottom: "none",
                            width: { xs: "70px", sm: "90px", md: "110px" },
                            minWidth: "60px",
                          }}
                        >
                          {match.home_goals !== null &&
                          match.away_goals !== null ? (
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
                            "VS"
                          )}
                        </TableCell>

                        <TableCell sx={{ borderBottom: "none" }}>
                          <Box display="flex" alignItems="center">
                            <img
                              src={match.away_team.logo_url}
                              alt={match.away_team.short_name}
                              style={{ width: "30px", marginRight: "5px" }}
                            />
                            <span
                              style={{
                                fontWeight:
                                  matchResult === "away_win"
                                    ? "bold"
                                    : "normal",
                                color:
                                  matchResult === "away_win"
                                    ? "green"
                                    : "inherit",
                              }}
                            >
                              {match.away_team.short_name}
                            </span>
                          </Box>
                        </TableCell>
                        {/* Stadium Name - Only show on larger screens */}
                        {!isSmallScreen && (
                          <TableCell sx={{ borderBottom: "none" }}>
                            {match.home_team.stadium_name}
                          </TableCell>
                        )}
                      </TableRow>

                      {/* Mobile-only row for date, time, and stadium information */}
                      {isSmallScreen && (
                        <TableRow
                          sx={{
                            cursor: "pointer",
                            backgroundColor:
                              index % 2 !== 0
                                ? "rgba(165, 132, 224, 0.1)"
                                : "inherit",
                            "&:hover": {
                              backgroundColor: "rgba(165, 132, 224, 0.2)",
                            },
                          }}
                        >
                          <TableCell
                            colSpan={4}
                            sx={{
                              textAlign: "center",
                              paddingTop: "0px",
                              paddingBottom: "8px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "12px", // Adjust font size to make it smaller
                                color: "textSecondary",
                                lineHeight: 1.2,
                              }}
                            >
                              {match.match_date
                                ? dayjs(match.match_date).format("DD/MM/YY")
                                : "Data a definir"}{" "}
                              , {match.match_time || "Hora a definir"} -{" "}
                              {match.home_team.stadium_name}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
