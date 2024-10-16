"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import { Box, Typography, Link, Avatar, CircularProgress, Alert } from "@mui/material";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
// import 'jspdf-autotable';

/**
 * MatchPage Component
 *
 * This component fetches and displays details of a specific football match,
 * including team logos, match result, date, time, stadium, and players.
 */
const MatchPage = () => {
  const [matchDetails, setMatchDetails] = useState(null); // Store match details
  const [homePlayers, setHomePlayers] = useState([]); // Home team players
  const [awayPlayers, setAwayPlayers] = useState([]); // Away team players
  const [matchEvents, setMatchEvents] = useState([]); // Store match events
  const [playersData, setPlayersData] = useState([]); // Store players data for goalscorers
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const params = useParams();
  const { id } = params; // retrieve the id from the route params

  /**
   * Fetches match details and players from the Supabase database.
   * Looks for matches with competition_type 'League' and the specified match id.
   */
  const fetchMatchDetails = async () => {
    const { data: matchData, error } = await supabase
      .from("matches")
      .select(
        `
        id,
        competition_type,
        week,
        round,
        home_goals,
        away_goals,
        match_date,
        match_time,
        home_team:teams!matches_home_team_id_fkey (id, short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (id, short_name, logo_url)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching match details:", error);
    } else {
      setMatchDetails(matchData); // Set match details state
      fetchPlayers(matchData.home_team.id, matchData.away_team.id); // Fetch players based on team IDs
      fetchMatchEvents(matchData.id); // Fetch match events based on match ID
    }
  };

  /**
   * Fetches players for both the home and away teams from the players table.
   * Uses team_id to get the correct players for each team.
   */
  const fetchPlayers = async (homeTeamId, awayTeamId) => {
    const { data: homePlayersData, error: homeError } = await supabase
      .from("players")
      .select("name, photo_url, id") // Include id for filtering
      .eq("team_id", homeTeamId);

    const { data: awayPlayersData, error: awayError } = await supabase
      .from("players")
      .select("name, photo_url, id") // Include id for filtering
      .eq("team_id", awayTeamId);

    if (homeError || awayError) {
      console.error("Error fetching players:", homeError || awayError);
    } else {
      setHomePlayers(homePlayersData); // Set home players state
      setAwayPlayers(awayPlayersData); // Set away players state
    }
  };

  /**
   * Fetches match events from the match_events table based on match ID.
   */
  const fetchMatchEvents = async (matchId) => {
    const { data: eventsData, error } = await supabase
      .from("match_events")
      .select("event_type, player_id")
      .eq("match_id", matchId);

    if (error) {
      console.error("Error fetching match events:", error);
    } else {
      setMatchEvents(eventsData); // Set match events state
      fetchPlayersData(eventsData); // Fetch players' names based on player IDs from match events
    }
  };

  /**
   * Fetches player details for goalscorers from the players table.
   */
  const fetchPlayersData = async (events) => {
    const playerIds = events.map((event) => event.player_id);

    const { data: playersData, error } = await supabase
      .from("players")
      .select("id, name")
      .in("id", playerIds);

    if (error) {
      console.error("Error fetching player details:", error);
    } else {
      setPlayersData(playersData); // Set players data for goalscorers
    }
  };

  useEffect(() => {
    if (id) fetchMatchDetails(); // Fetch match details once id is available
  }, [id]);

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

  // Function to get goalscorers for each team
  const getGoalscorers = (teamId) => {
    const playerIds =
      teamId === matchDetails.home_team.id
        ? homePlayers.map((player) => player.id)
        : awayPlayers.map((player) => player.id);

    const goalscorerCounts = matchEvents
      .filter(
        (event) =>
          event.event_type === "GOAL" && playerIds.includes(event.player_id)
      )
      .reduce((acc, event) => {
        const player = playersData.find((p) => p.id === event.player_id);
        if (player) {
          acc[player.name] = (acc[player.name] || 0) + 1; // Count goals per player
        }
        return acc;
      }, {});

    return Object.entries(goalscorerCounts).map(
      ([name, count]) => `${name} (${count})`
    );
  };


  const generatePDF = async () => {
    const doc = new jsPDF();

    // Set document title and competition info
    doc.setFontSize(18);
    doc.text("LIGA DE FUTEBOL", 20, 20);
    doc.setFontSize(14);
    doc.text("VETERANOS DO SADO", 20, 30);
    doc.setFontSize(10);
    doc.text("2024/25", 20, 40);
    doc.text("Super Taça", 20, 45);
    doc.text(dayjs().format("DD-MM-YYYY"), 20, 50); // Use current date in format DD-MM-YYYY

    // Team Names
    doc.setFontSize(16);
    doc.text("A", 20, 65);
    doc.text(`${matchDetails.home_team.short_name}`, 20, 70); // Home team name
    doc.text("Vs", 100, 70);
    doc.text(`${matchDetails.away_team.short_name}`, 160, 70); // Away team name
    doc.text("B", 160, 65);

    // Player Table Headers
    doc.setFontSize(12);
    doc.text("Nº", 20, 90);
    doc.text("NOMES DOS ATLETAS", 30, 90);
    doc.text("GOLS", 120, 90);
    doc.text("DISCIPLINA", 140, 90);
    doc.text("GOLS", 160, 90);
    doc.text("NOMES DOS ATLETAS", 170, 90);
    doc.text("Nº", 210, 90);

    // Add Home Team Players
    homePlayers.forEach((player, index) => {
        doc.text(`${index + 1}`, 20, 100 + index * 10);
        doc.text(player.name, 30, 100 + index * 10);
        // Add Gols and Disciplina placeholders if necessary
    });

    // Add Away Team Players
    awayPlayers.forEach((player, index) => {
        doc.text(`${index + 1}`, 170, 100 + index * 10);
        doc.text(player.name, 180, 100 + index * 10);
        // Add Gols placeholders if necessary
    });

    // Additional Sections for Coaches and Observations
    doc.text("NOMES DOS TREINADORES E DELEGADOS", 20, 100 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("TREINADOR -", 20, 120 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("DELEGADO -", 20, 130 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("DELEGADO -", 20, 140 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    
    doc.text("OBSERVAÇÕES:", 20, 150 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    
    // Goals Section
    doc.text("GOLS -- Nº DO JOGADOR", 20, 170 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("A", 20, 180 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("B", 120, 180 + (homePlayers.length + awayPlayers.length) * 10 + 10);

    // Result Section
    doc.text(`${matchDetails.home_team.short_name}`, 20, 200 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("RESULTADO FINAL", 100, 200 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text(`${matchDetails.away_team.short_name}`, 200, 200 + (homePlayers.length + awayPlayers.length) * 10 + 10);

    doc.text("DELEGADO", 20, 220 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("ARBITRO", 100, 220 + (homePlayers.length + awayPlayers.length) * 10 + 10);
    doc.text("DELEGADO", 200, 220 + (homePlayers.length + awayPlayers.length) * 10 + 10);

    // Save the PDF
    doc.save(`fichajogo${matchDetails.home_team.short_name}${matchDetails.away_team.short_name}.pdf`);
};



  return (
    <Box sx={{ padding: "4rem 2rem", textAlign: "center" }}>
      {matchDetails ? (
        <>
          {/* Add the LIGA Typography here */}
          <Typography variant="h4" sx={{ color: "#6B4BA1" }} gutterBottom>
            {matchDetails.competition_type === "League"
              ? `Jornada ${matchDetails.week}`
              : matchDetails.competition_type === "Cup"
                ? `Taça : Ronda ${matchDetails.round}`
                : matchDetails.competition_type === "Supercup"
                  ? "Supertaça"
                  : ""}
          </Typography>

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
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  style={getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    "home"
                  )}
                  sx={{ mt: 2 }}
                >
                  {matchDetails.home_team.short_name}
                </Typography>
                <Typography
                  variant="h2"
                  style={getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    "home"
                  )}
                  sx={{ mt: 1 }}
                >
                  {matchDetails.home_goals !== null
                    ? matchDetails.home_goals
                    : "-"}
                </Typography>
              </Box>

              {/* Date and Time Display */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mx: 4,
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: "0.5rem" }}>
                  {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="h5">{matchDetails.match_time}</Typography>
              </Box>

              {/* Away Team Logo, Name and Score */}
              <Box sx={{ textAlign: "center", ml: 4 }}>
                <img
                  src={matchDetails.away_team.logo_url}
                  alt={matchDetails.away_team.short_name}
                  style={{
                    width: "225px",
                    height: "225px",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  style={getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    "away"
                  )}
                  sx={{ mt: 2 }}
                >
                  {matchDetails.away_team.short_name}
                </Typography>
                <Typography
                  variant="h2"
                  style={getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    "away"
                  )}
                  sx={{ mt: 1 }}
                >
                  {matchDetails.away_goals !== null
                    ? matchDetails.away_goals
                    : "-"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "top",
              }}
            >
              {/* Display Goalscorers for Home Team */}
              <Box sx={{ textAlign: "center", mr: 5 }}>
                <Typography variant="h6">
                  Marcadores {matchDetails.home_team.short_name}:
                </Typography>
                {getGoalscorers(matchDetails.home_team.id).length > 0 ? (
                  getGoalscorers(matchDetails.home_team.id).map(
                    (goalscorer, index) => (
                      <Typography key={index} variant="body1">
                        {goalscorer}
                      </Typography>
                    )
                  )
                ) : (
                  <Typography variant="body2">Sem marcadores</Typography>
                )}
              </Box>

              {/* Vertical Line Divider */}
              <Box
                sx={{
                  width: "2px",
                  backgroundColor: "gray",
                  height: "auto",
                  mx: 2,
                }}
              />

              {/* Display Goalscorers for Away Team */}
              <Box sx={{ textAlign: "center", ml: 5 }}>
                <Typography variant="h6">
                  Marcadores {matchDetails.away_team.short_name}:
                </Typography>
                {getGoalscorers(matchDetails.away_team.id).length > 0 ? (
                  getGoalscorers(matchDetails.away_team.id).map(
                    (goalscorer, index) => (
                      <Typography key={index} variant="body1">
                        {goalscorer}
                      </Typography>
                    )
                  )
                ) : (
                  <Typography variant="body2">Sem marcadores</Typography>
                )}
              </Box>
            </Box>

            {/* Stadium Name */}
            <Typography variant="h5" sx={{ marginTop: "3rem" }}>
              {matchDetails.competition_type === "Supercup"
                ? "Estádio: Campo António Henrique de Matos"
                : matchDetails.home_team.stadium_name}
            </Typography>

            {/* Ficha de Jogo Link */}
            <Box sx={{ marginTop: "3rem" }}>
              <Link
                // href={
                //   matchDetails.competition_type === "Supercup"
                //     ? "/fichajogosupertaca/saograbrielvsindependente.pdf"
                //     : "#"
                // }
                // target="_blank"
                onClick={generatePDF}
                rel="noopener noreferrer"
                underline="none"
              >

                <DownloadIcon sx={{ marginRight: 1 }} />{" "}
                {/* Icon with right margin */}
                <Typography variant="h6" sx={{ color: "#1976d2" }}>
                  Ficha de Jogo
                </Typography>
              </Link>
            </Box>

            {/* Players List for both teams */}
            <Box
              sx={{
                mt: 5,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              {/* Home Team Players (left side) */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  pr: 5,
                }}
              >
                {" "}
                {/* Add padding to the right for the gap */}
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Jogadores {matchDetails.home_team.short_name}:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        lg: "1fr 1fr 1fr",
                      }, // Responsive grid
                      gap: 1,
                    }}
                  >
                    {homePlayers.map((player) => (
                      <Box
                        key={player.name}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          margin: "5px 0",
                          width: "100%",
                        }}
                      >
                        <Avatar
                          alt={player.name}
                          src={player.photo_url}
                          sx={{ width: 50, height: 50, marginRight: 1 }} // Avatar size
                        />
                        <Typography variant="body1">{player.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Vertical Line Divider */}
              <Box
                sx={{
                  width: "2px",
                  backgroundColor: "gray",
                  height: "auto",
                  mx: 2,
                }}
              />

              {/* Away Team Players (right side) */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  pl: 5,
                }}
              >
                {" "}
                {/* Add padding to the left for the gap */}
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Jogadores {matchDetails.away_team.short_name}:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        lg: "1fr 1fr 1fr",
                      }, // Responsive grid
                      gap: 1,
                    }}
                  >
                    {awayPlayers.map((player) => (
                      <Box
                        key={player.name}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          margin: "5px 0",
                          width: "100%",
                        }}
                      >
                        <Avatar
                          alt={player.name}
                          src={player.photo_url}
                          sx={{ width: 50, height: 50, marginRight: 1 }} // Avatar size
                        />
                        <Typography variant="body1">{player.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Typography variant="body1">Carregar dados do Jogo</Typography>
      )}
    </Box>
  );
};

export default MatchPage;
