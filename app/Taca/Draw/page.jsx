"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";

/**
 * CupRoundOf16Page Component
 *
 * This component fetches and displays the matches for the Round of 16 in the Cup competition.
 * Matches are displayed inside cards aligned to the left, with home and away teams,
 * match result, match date, time, and stadium. The component also shows team progression
 * by drawing lines between matches.
 */
const Cup = () => {
  const [matches, setMatches] = useState([]);
  const [team13, setTeam13] = useState(null); // State to hold the team with id=13

  /**
   * Fetches matches for the 'Round of 16' of the 'Cup' competition from Supabase.
   * Filters for season 2024 and orders by match ID.
   */
  const fetchMatches = async () => {
    // Fetch normal Round of 16 matches
    const { data: matchesData, error: matchesError } = await supabase
      .from("matches")
      .select(`
        id,
        home_goals,
        away_goals,
        match_date,
        match_time,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `)
      .eq("competition_type", "Cup")
      .eq("season", "2024")
      .eq("round", "16") // Filtering by 'round = 16'
      .order("id", { ascending: true });

    // Fetch the team with id=13 (no opponent)
    const { data: team13Data, error: team13Error } = await supabase
      .from("teams")
      .select("short_name, logo_url, stadium_name")
      .eq("id", 13)
      .single();

    if (matchesError || team13Error) {
      console.error("Error fetching data:", matchesError || team13Error);
    } else {
      setMatches(matchesData); // Set fetched matches
      setTeam13(team13Data); // Set team with id=13
    }
  };

  useEffect(() => {
    fetchMatches(); // Fetch matches and team13 when the component loads
  }, []);

  const getTeamStyles = (homeGoals, awayGoals, team) => {
    if (homeGoals !== null && awayGoals !== null) {
      if (homeGoals > awayGoals && team === "home") {
        return { fontWeight: "bold", color: "green" };
      } else if (awayGoals > homeGoals && team === "away") {
        return { fontWeight: "bold", color: "green" };
      }
    }
    return {};
  };

  /**
   * Determine the winner of the match.
   */
  const getMatchWinner = (match) => {
    if (match.home_goals !== null && match.away_goals !== null) {
      return match.home_goals > match.away_goals
        ? match.home_team
        : match.away_team;
    }
    return null;
  };

  return (
    <Box sx={{ padding: "2rem", position: "relative" }}>
      <Typography variant="h4" gutterBottom align="center">
        Taça
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1rem",
          position: "relative",
        }}
      >
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <Card
              key={match.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "500px", // Adjusted width
                padding: "1rem",
                border: "1px solid #ccc",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
              id={`match-${index}`}
            >
              {/* Left Side: Home Team, Away Team, and Results */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flex: 1.3, // Increased space for team names by 30%
                }}
              >
                {/* Home Team */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // Align logo, name, and result horizontally
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={match.home_team.logo_url}
                      alt={match.home_team.short_name}
                      style={{
                        width: "30px", // Reduced logo size (50%)
                        height: "30px",
                        objectFit: "contain",
                        marginRight: "0.5rem", // Space between logo and name
                      }}
                    />
                    <Typography
                      variant="h6"
                      style={getTeamStyles(
                        match.home_goals,
                        match.away_goals,
                        "home"
                      )}
                    >
                      {match.home_team.short_name}
                    </Typography>
                  </Box>

                  {/* Home Team Result */}
                  {match.home_goals !== null && (
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {match.home_goals}
                    </Typography>
                  )}
                </Box>

                {/* Away Team */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // Align logo, name, and result horizontally
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={match.away_team.logo_url}
                      alt={match.away_team.short_name}
                      style={{
                        width: "30px", // Reduced logo size (50%)
                        height: "30px",
                        objectFit: "contain",
                        marginRight: "0.5rem",
                      }}
                    />
                    <Typography
                      variant="h6"
                      style={getTeamStyles(
                        match.home_goals,
                        match.away_goals,
                        "away"
                      )}
                    >
                      {match.away_team.short_name}
                    </Typography>
                  </Box>

                  {/* Away Team Result */}
                  {match.away_goals !== null && (
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {match.away_goals}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Right Side: Date, Time, and Stadium */}
              <CardContent sx={{ textAlign: "right", flex: 1 }}>
                {/* Only display date/time/stadium if they exist */}
                {match.match_date && (
                  <Typography variant="body2">
                    {dayjs(match.match_date).format("DD/MM/YYYY")}
                  </Typography>
                )}
                {match.match_time && (
                  <Typography variant="body2">
                    {match.match_time || "Time TBD"}
                  </Typography>
                )}
                {match.home_team.stadium_name && (
                  <Typography variant="body2" color="textSecondary">
                    {match.home_team.stadium_name || "Stadium TBD"}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">Loading matches...</Typography>
        )}

        {/* Last Card for Team with id=13 */}
        {team13 && (
          <Card
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "500px", // Adjusted width
              padding: "1rem",
              border: "1px solid #ccc",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9fff9", // Light green background to indicate victory
            }}
          >
            {/* Left Side: Team with id=13 styled as a winner */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // Align logo and name horizontally
              }}
            >
              <img
                src={team13.logo_url}
                alt={team13.short_name}
                style={{
                  width: "30px", // Reduced logo size (50%)
                  height: "30px",
                  objectFit: "contain",
                  marginRight: "0.5rem",
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "green" }}>
                {team13.short_name} 
              </Typography>
            </Box>

            {/* Right Side: Stadium (if available) */}
            <CardContent sx={{ textAlign: "right", flex: 1 }}>
              {team13.stadium_name && (
                <Typography variant="body2" color="textSecondary">
                  {team13.stadium_name || "Stadium TBD"}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Cup;
