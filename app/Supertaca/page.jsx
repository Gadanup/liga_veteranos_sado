"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Box, Typography, Link } from "@mui/material";
import dayjs from "dayjs";

/**
 * MatchPage Component
 *
 * This component fetches and displays details of a specific football match.
 * It presents information such as team logos, match result, date, time, and stadium.
 */
const Supercup = () => {
  const [matchDetails, setMatchDetails] = useState(null); // Store match details

  /**
   * Fetches match details from the Supabase database.
   * Looks for matches with competition_type 'Supercup' and season '2024'.
   */
  const fetchMatchDetails = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        home_goals,
        away_goals,
        match_date,
        match_time,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `)
      .eq("competition_type", "Supercup")
      .eq("season", "2024")
      .single(); // Fetch only one match

    if (error) {
      console.error("Error fetching match details:", error);
    } else {
      setMatchDetails(data); // Set match details state
    }
  };

  /**
   * Called when the component is first loaded.
   * Fetches match details to display on the page.
   */
  useEffect(() => {
    fetchMatchDetails(); // Fetch match details on load
  }, []);

  // Function to determine the winning team's name and style
  const getTeamStyles = (homeGoals, awayGoals, team) => {
    if (homeGoals !== null && awayGoals !== null) {
      if (homeGoals > awayGoals && team === "home") {
        return { fontWeight: "bold", color: "green" }; // Home team wins
      } else if (awayGoals > homeGoals && team === "away") {
        return { fontWeight: "bold", color: "green" }; // Away team wins
      }
    }
    return {}; // Default style
  };

  return (
    <Box sx={{ padding: "4rem 2rem", textAlign: "center" }}>
      <Typography variant="h4" sx={{color:'#6B4BA1'}} gutterBottom>
        SUPERTAÇA
      </Typography>

      {matchDetails ? (
        <Box sx={{ mt: 5, mb: 5 }}>
          {/* Match Layout */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // Center match details horizontally
              margin: "0 20px", // Adjust margin as needed
            }}
          >
            {/* Home Team Logo and Name */}
            <Box sx={{ textAlign: "center", mr: 4 }}>
              <img
                src={matchDetails.home_team.logo_url}
                alt={matchDetails.home_team.short_name}
                style={{ 
                  width: "225px", 
                  height: "225px", 
                  objectFit: "contain" 
                }} 
              />
              <Typography
                variant="h6"
                style={getTeamStyles(matchDetails.home_goals, matchDetails.away_goals, "home")}
                sx={{ mt: 2 }}
              >
                {matchDetails.home_team.short_name}
              </Typography>
            </Box>

            {/* Match Result */}
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mx: 4 }}>
              {/* Date and Time Display */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" sx={{ marginBottom: "0.5rem" }}>
                  {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="h5">
                  {matchDetails.match_time}
                </Typography>
              </Box>
              {matchDetails.home_goals !== null && matchDetails.away_goals !== null ? (
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography variant="h4" sx={{ margin: "0 1rem" }}>
                    {matchDetails.home_goals}
                  </Typography>
                  <Typography variant="h4">-</Typography>
                  <Typography variant="h4" sx={{ margin: "0 1rem" }}>
                    {matchDetails.away_goals}
                  </Typography>
                </Box>
              ) : null}
            </Box>

            {/* Away Team Logo and Name */}
            <Box sx={{ textAlign: "center", ml: 4 }}>
              <img
                src={matchDetails.away_team.logo_url}
                alt={matchDetails.away_team.short_name}
                style={{ 
                  width: "225px", 
                  height: "225px", 
                  objectFit: "contain" 
                }} 
              />
              <Typography
                variant="h6"
                style={getTeamStyles(matchDetails.home_goals, matchDetails.away_goals, "away")}
                sx={{ mt: 2 }}
              >
                {matchDetails.away_team.short_name}
              </Typography>
            </Box>
          </Box>

          {/* Hardcoded Stadium Name */}
          <Typography variant="h5" sx={{ marginTop: "3rem" }}>
            Estadio:  Campo António Henrique de Matos
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1">Carregar dados da Supertaça...</Typography>
      )}

      {/* Ficha de Jogo Link */}
      <Box sx={{ marginTop: "3rem" }}>
        <Link
          href="/fichajogosupertaca/saograbrielvsindependente.pdf" // Adjust the path to the correct location of your PDF
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
        >
          <Typography variant="h6" sx={{color:'#1976d2'}}>
            Ficha de Jogo
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Supercup;
