"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Box, Typography, Link, Avatar } from "@mui/material";
import dayjs from "dayjs";
import DownloadIcon from '@mui/icons-material/Download';

/**
 * MatchPage Component
 *
 * This component fetches and displays details of a specific football match,
 * including team logos, match result, date, time, stadium, and players.
 */
const Supercup = () => {
  const [matchDetails, setMatchDetails] = useState(null); // Store match details
  const [homePlayers, setHomePlayers] = useState([]); // Home team players
  const [awayPlayers, setAwayPlayers] = useState([]); // Away team players

  /**
   * Fetches match details and players from the Supabase database.
   * Looks for matches with competition_type 'Supercup' and season '2024'.
   */
  const fetchMatchDetails = async () => {
    const { data: matchData, error } = await supabase
      .from("matches")
      .select(`
        id,
        home_goals,
        away_goals,
        match_date,
        match_time,
        home_team:teams!matches_home_team_id_fkey (id, short_name, logo_url),
        away_team:teams!matches_away_team_id_fkey (id, short_name, logo_url)
      `)
      .eq("competition_type", "Supercup")
      .eq("season", "2024")
      .single(); // Fetch only one match

    if (error) {
      console.error("Error fetching match details:", error);
    } else {
      setMatchDetails(matchData); // Set match details state
      fetchPlayers(matchData.home_team.id, matchData.away_team.id); // Fetch players based on team IDs
    }
  };

  /**
   * Fetches players for both the home and away teams from the players table.
   * Uses team_id to get the correct players for each team.
   */
  const fetchPlayers = async (homeTeamId, awayTeamId) => {
    const { data: homePlayersData, error: homeError } = await supabase
      .from("players")
      .select("name, photo_url")
      .eq("team_id", homeTeamId);

    const { data: awayPlayersData, error: awayError } = await supabase
      .from("players")
      .select("name, photo_url")
      .eq("team_id", awayTeamId);

    if (homeError || awayError) {
      console.error("Error fetching players:", homeError || awayError);
    } else {
      setHomePlayers(homePlayersData); // Set home players state
      setAwayPlayers(awayPlayersData); // Set away players state
    }
  };

  useEffect(() => {
    fetchMatchDetails(); // Fetch match details on load
  }, []);

  // Function to determine the winning team's name and score style
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
      <Typography variant="h4" sx={{ color: '#6B4BA1' }} gutterBottom>
        SUPERTAÇA
      </Typography>

      {matchDetails ? (
        <Box sx={{ mt: 5, mb: 5 }}>
          {/* Match Layout */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 20px",
            }}
          >
            {/* Home Team Logo, Name and Score */}
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
              <Typography
                variant="h2"
                style={getTeamStyles(matchDetails.home_goals, matchDetails.away_goals, "home")}
                sx={{ mt: 1 }}
              >
                {matchDetails.home_goals !== null ? matchDetails.home_goals : "-"}
              </Typography>
            </Box>

            {/* Date and Time Display */}
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mx: 4 }}>
              <Typography variant="h5" sx={{ marginBottom: "0.5rem" }}>
                {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="h5">
                {matchDetails.match_time}
              </Typography>
            </Box>

            {/* Away Team Logo, Name and Score */}
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
              <Typography
                variant="h2"
                style={getTeamStyles(matchDetails.home_goals, matchDetails.away_goals, "away")}
                sx={{ mt: 1 }}
              >
                {matchDetails.away_goals !== null ? matchDetails.away_goals : "-"}
              </Typography>
            </Box>
          </Box>

          {/* Hardcoded Stadium Name */}
          <Typography variant="h5" sx={{ marginTop: "3rem" }}>
            Estadio:  Campo António Henrique de Matos
          </Typography>

          {/* Ficha de Jogo Link */}
          <Box sx={{ marginTop: "3rem" }}>
            <Link
              href="/fichajogosupertaca/saograbrielvsindependente.pdf" // Adjust the path to the correct location of your PDF
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <DownloadIcon sx={{ marginRight: 1 }} /> {/* Icon with right margin */}
              <Typography variant="h6" sx={{ color: '#1976d2' }}>
                Ficha de Jogo
              </Typography>
            </Link>
          </Box>

          {/* Players List for both teams */}
          <Box sx={{ mt: 5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {/* Home Team Players (left side) */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', pr: 5 }}> {/* Add padding to the right for the gap */}
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Jogadores {matchDetails.home_team.short_name}:
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, // Responsive grid
                    gap: 1
                  }}
                >
                  {homePlayers.map((player) => (
                    <Box
                      key={player.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '5px 0',
                        width: '100%'
                      }}
                    >
                      <Avatar
                        alt={player.name}
                        src={player.photo_url}
                        sx={{ width: 50, height: 50, marginRight: 1 }} // Avatar size
                      />
                      <Typography variant="body1">
                        {player.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Vertical Line Divider */}
            <Box sx={{ width: '2px', backgroundColor: 'gray', height: 'auto', mx: 2 }} />

            {/* Away Team Players (right side) */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', pl: 5 }}> {/* Add padding to the left for the gap */}
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Jogadores {matchDetails.away_team.short_name}:
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, // Responsive grid
                    gap: 1
                  }}
                >
                  {awayPlayers.map((player) => (
                    <Box
                      key={player.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '5px 0',
                        width: '100%'
                      }}
                    >
                      <Avatar
                        alt={player.name}
                        src={player.photo_url}
                        sx={{ width: 50, height: 50, marginRight: 1 }} // Avatar size
                      />
                      <Typography variant="body1">
                        {player.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

        </Box>
      ) : (
        <Typography variant="body1">Carregar dados da Supertaça...</Typography>
      )}
    </Box>
  );
};

export default Supercup;
