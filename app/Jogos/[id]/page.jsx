"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  Link,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
      .select("name, photo_url, id, joker") // Include id for filtering
      .eq("team_id", homeTeamId);

    const { data: awayPlayersData, error: awayError } = await supabase
      .from("players")
      .select("name, photo_url, id, joker") // Include id for filtering
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
      .select("id, name, joker")
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
          event.event_type === 1 && playerIds.includes(event.player_id)
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

  // Check if matchDetails is available before setting competitionText
  const competitionText = matchDetails
    ? matchDetails.competition_type === "League"
      ? `Jornada ${matchDetails.week}`
      : matchDetails.competition_type === "Cup"
        ? `Ronda ${matchDetails.round}`
        : matchDetails.competition_type === "Supercup"
          ? ""
          : ""
    : "";

  // Check if matchDetails is available before setting competitionText
  const competitionType = matchDetails
    ? matchDetails.competition_type === "League"
      ? `Campeonato`
      : matchDetails.competition_type === "Cup"
        ? `Taça`
        : matchDetails.competition_type === "Supercup"
          ? "Supertaça"
          : ""
    : "";

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add league logo
    const img = new Image();
    img.src = "/logo/logo.png";
    doc.addImage(img, "PNG", 10, 10, 20, 20); // Adjusted size for better layout

    // Set document title and competition info
    doc.setFontSize(18);
    doc.setTextColor(107, 75, 161); // Set color to #6B4BA1
    doc.text("LIGA DE FUTEBOL VETERANOS DO SADO", 50, 20);
    // Reset text color to black for other sections if needed
    doc.setFontSize(15);
    doc.text("2024/25", 95, 27);
    doc.setTextColor(0, 0, 0); // Black color for other text
    doc.setFontSize(10);
    // Check matchDetails before accessing match_date
    const matchDateText = matchDetails
      ? dayjs(matchDetails.match_date).format("DD/MM/YYYY")
      : "Date TBD";

    doc.text(`${competitionType}`, 30, 35);
    doc.text(`${matchDateText}`, 95, 35);
    doc.text(`${competitionText}`, 170, 35);

    // Divider line below title section
    doc.line(10, 40, 200, 40);

    // Team Names with "A" and "B" labels and "VS" in the middle
    doc.setFontSize(16);
    doc.text("A", 10, 50);
    doc.text(`${matchDetails.home_team.short_name}`, 30, 50);
    doc.text("VS", 100, 50);
    if (matchDetails.away_team.short_name === "Bairro Santos Nicolau") {
      doc.text(`${matchDetails.away_team.short_name}`, 137, 50);
    } else {
      doc.text(`${matchDetails.away_team.short_name}`, 140, 50);
    }
    doc.text("B", 195, 50); // Shifted "B" further to the right

    // Divider line below team names section
    doc.line(10, 55, 200, 55);

    // Player Table Headers
    doc.setFontSize(8); // Reduced font size for compact table
    doc.text("Nº", 12, 61);
    doc.text("NOMES DOS ATLETAS", 19, 61);
    doc.text("GOLOS", 64, 61);
    doc.text("DISCIPLINA", 98, 61);
    doc.text("GOLOS", 125, 61);
    doc.text("NOMES DOS ATLETAS", 150, 61);
    doc.text("Nº", 195, 61); // Closer to the right side for better alignment

    // Define initial y-coordinate for player rows
    let rowStartY = 65;
    let rowHeight = 4;

    // Order home and away players alphabetically
    const sortedHomePlayers = [...homePlayers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedAwayPlayers = [...awayPlayers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Calculate the y-coordinate for the end of the table based on the number of players
    const lastPlayerY =
      rowStartY +
      Math.max(sortedHomePlayers.length, sortedAwayPlayers.length) * rowHeight;

    // Draw vertical lines for each column
    const columnsX = [10, 17, 62, 87, 123, 148, 193, 200]; // X-coordinates for the column lines
    columnsX.forEach((x) => {
      doc.line(x, 58, x, lastPlayerY); // Vertical lines from headers to the last row
    });

    // Draw the vertical line to divide the "DISCIPLINA" column into two sections
    const disciplinaX = 105; // X-coordinate for "DISCIPLINA" header
    doc.line(disciplinaX, 62, disciplinaX, lastPlayerY); // Vertical line below the header

    // Draw horizontal lines for each row (including headers)
    for (let y = 58; y <= lastPlayerY; y += rowHeight) {
      doc.line(10, y, 200, y); // Horizontal line spanning across all columns
    }

    // Draw player data within the grid
    sortedHomePlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      // Add (JK) if the player is a joker
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      doc.text(String(player.number || ""), 20, yPos); // Player number
      doc.text(playerName, 19, yPos); // Player name
    });

    sortedAwayPlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      // Add (JK) if the player is a joker
      const playerName = player.joker ? player.name + " (JK)" : player.name;
      doc.text(String(player.number || ""), 195, yPos); // Player number (right side)
      doc.text(playerName, 150, yPos); // Player name (right side)
    });

    // Final horizontal line at the bottom of the table
    doc.line(10, lastPlayerY, 200, lastPlayerY); // Bottom border of the table

    // Divider line below player table section
    const yOffset =
      65 + Math.max(homePlayers.length, awayPlayers.length) * 4 + 5;
    doc.line(10, yOffset - 2, 200, yOffset - 2);

    // Coaches and Delegates Section
    doc.setFontSize(10);
    doc.text("NOMES DOS TREINADORES E DELEGADOS", 10, yOffset + 3);
    doc.setFontSize(8);
    doc.line(10, 55, 200, 55);
    doc.text("TREINADOR -", 12, yOffset + 10);
    doc.text("DELEGADO -", 12, yOffset + 15);
    doc.text("TREINADOR -", 120, yOffset + 10); // Right side for Team B
    doc.text("DELEGADO -", 120, yOffset + 15); // Right side for Team B

    doc.line(10, yOffset + 7, 200, yOffset + 7);
    doc.line(10, yOffset + 12, 200, yOffset + 12);
    doc.line(10, yOffset + 17, 200, yOffset + 17);
    doc.line(10, yOffset + 7, 10, yOffset + 17);
    doc.line(118, yOffset + 7, 118, yOffset + 17);
    doc.line(100, yOffset + 7, 100, yOffset + 17);
    doc.line(82, yOffset + 7, 82, yOffset + 17);
    doc.line(200, yOffset + 7, 200, yOffset + 17);

    // Divider line below coaches and delegates section
    doc.line(10, yOffset + 20, 200, yOffset + 20);

    // Observations Section
    doc.rect(20, yOffset + 25, 170, 15);
    doc.text("OBSERVAÇÕES:", 25, yOffset + 30);

    // Divider line below observations section
    doc.line(10, yOffset + 45, 200, yOffset + 45);

    // Goals Section as a two-row table with smaller boxes
    doc.setFontSize(10);
    doc.text("GOLOS -- Nº DO JOGADOR", 10, yOffset + 50);

    // Row for Team A
    doc.text("A", 20, yOffset + 60);
    for (let i = 0; i < 20; i++) {
      doc.rect(30 + i * 8, yOffset + 55, 8, 8); // Smaller boxes (8x8)
    }

    // Row for Team B
    doc.text("B", 20, yOffset + 70);
    for (let i = 0; i < 20; i++) {
      doc.rect(30 + i * 8, yOffset + 65, 8, 8); // Smaller boxes (8x8)
    }

    // Divider line below goals section
    doc.line(10, yOffset + 80, 200, yOffset + 80);

    // Final Result Section
    doc.text(`${matchDetails.home_team.short_name}`, 20, yOffset + 98);
    doc.circle(70, yOffset + 97, 8); // Increased radius for home team goals (was 5)
    doc.setFontSize(12);
    doc.text("RESULTADO FINAL", 86, yOffset + 91 - 5); // Added above VS
    doc.setFontSize(10);
    doc.text("VS", 100, yOffset + 98);
    doc.circle(140, yOffset + 97, 8); // Increased radius for away team goals (was 5)
    doc.text(`${matchDetails.away_team.short_name}`, 160, yOffset + 98);

    // Divider line below final result section
    doc.line(10, yOffset + 110, 200, yOffset + 110);

    // Signature Section
    doc.text("DELEGADO", 20, yOffset + 117);
    doc.line(20, yOffset + 125, 60, yOffset + 125); // Line for delegate signature
    doc.text("ÁRBITRO", 90, yOffset + 117);
    doc.line(90, yOffset + 125, 130, yOffset + 125); // Line for referee signature
    doc.text("DELEGADO", 160, yOffset + 117);
    doc.line(160, yOffset + 125, 200, yOffset + 125); // Line for delegate signature

    // Save the PDF
    doc.save(
      `fichajogo_${matchDetails.home_team.short_name}_vs_${matchDetails.away_team.short_name}.pdf`
    );
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

            <div>
              {/* Hidden div to render PDF template */}
              {/* <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                }}
              >
                <PDFTemplate />
              </div> */}
              {/* Ficha de Jogo Link */}
              <Box sx={{ marginTop: "3rem", cursor: "pointer" }}>
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
            </div>

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
