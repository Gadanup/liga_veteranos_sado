"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Box, Typography, Grid, Paper } from "@mui/material";
import dayjs from "dayjs";

// The knockout phase component
const KnockoutPhase = () => {
  const [cupMatches, setCupMatches] = useState({});

  const fetchCupMatches = async () => {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(`
        id,
        match_date,
        home_goals,
        away_goals,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url),
        round
      `)
      .eq("competition_type", "Cup")
      .order("round", { ascending: true })
      .order("match_date", { ascending: true });

    if (error) {
      console.error("Error fetching cup matches:", error);
    } else {
      // Group matches by round
      const groupedMatches = matches.reduce((acc, match) => {
        const round = match.round;
        if (!acc[round]) {
          acc[round] = [];
        }
        acc[round].push(match);
        return acc;
      }, {});
      setCupMatches(groupedMatches);
    }
  };

  useEffect(() => {
    fetchCupMatches(); // Fetch cup matches when the component loads
  }, []);

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
      <Typography variant="h4" align="center" sx={{color:'#6B4BA1'}} gutterBottom>
        Knockout Phase (Cup)
      </Typography>

      {/* Render brackets by rounds */}
      {Object.keys(cupMatches).map((round) => (
        <Box key={round} mb={6}>
          <Typography variant="h5" align="center" gutterBottom>
            {round}
          </Typography>

          <Grid container spacing={4}>
            {cupMatches[round].map((match) => {
              const matchResult = determineMatchResult(
                match.home_goals,
                match.away_goals
              );

              return (
                <Grid item xs={12} sm={6} md={4} key={match.id}>
                  <Paper elevation={3} style={{ padding: "20px" }}>
                    <Typography align="center" gutterBottom>
                      {dayjs(match.match_date).format("DD MMM YYYY")}
                    </Typography>

                    {/* Match layout */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      {/* Home team */}
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight:
                            matchResult === "home_win" ? "bold" : "normal",
                            color: matchResult === "home_win" ? "green" : "inherit",
                          }}
                        >
                          {match.home_team.short_name}
                        </Typography>
                          <img
                            src={match.home_team.logo_url}
                            alt={match.home_team.short_name}
                            style={{ width: "40px", marginLeft: "10px" }}
                          />
                      </Box>

                      {/* Match result */}
                      <Box>
                        {match.home_goals !== null && match.away_goals !== null ? (
                          <Typography
                            variant="body1"
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
                            {match.home_goals} - {match.away_goals}
                          </Typography>
                        ) : (
                          <Typography color="textSecondary">TBD</Typography>
                        )}
                      </Box>

                      {/* Away team */}
                      <Box display="flex" alignItems="center">
                        <img
                          src={match.away_team.logo_url}
                          alt={match.away_team.short_name}
                          style={{ width: "40px", marginRight: "10px" }}
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight:
                              matchResult === "away_win" ? "bold" : "normal",
                            color: matchResult === "away_win" ? "green" : "inherit",
                          }}
                        >
                          {match.away_team.short_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </div>
  );
};

export default KnockoutPhase;
