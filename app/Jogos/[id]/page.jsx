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
  useMediaQuery,
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
  const [suspendedPlayerIds, setSuspendedPlayerIds] = useState([]); // State to hold suspended player IDs
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  /**
   * Fetches suspended players from the Supabase database.
   * Looks for players with active = 'true'.
   */
  const fetchSuspendedPlayers = async () => {
    const { data: suspendedPlayers, error } = await supabase
      .from("suspensions")
      .select("player_id")
      .eq("active", true); // Only get players with active suspensions

    if (error) {
      console.error("Error fetching suspended players:", error);
    } else {
      setSuspendedPlayerIds(suspendedPlayers.map((record) => record.player_id)); // Store player IDs in state
    }
  };

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
        match_sheet,
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
    if (id) {
      fetchMatchDetails(); // Fetch match details once id is available
      fetchSuspendedPlayers(); // Fetch suspended players
    }
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

  // Function to get goalscorers for each team, including own goals
  const getGoalscorers = (teamId) => {
    const isHomeTeam = teamId === matchDetails.home_team.id;
    const playerIds = isHomeTeam
      ? homePlayers.map((player) => player.id)
      : awayPlayers.map((player) => player.id);

    // Regular goals (event_type === 1)
    const goalscorerCounts = matchEvents
      .filter(
        (event) => event.event_type === 1 && playerIds.includes(event.player_id)
      )
      .reduce((acc, event) => {
        const player = playersData.find((p) => p.id === event.player_id);
        if (player) {
          acc[player.name] = (acc[player.name] || 0) + 1; // Count goals per player
        }
        return acc;
      }, {});

    // Own goals (event_type === 4)
    const ownGoals = matchEvents
      .filter(
        (event) =>
          event.event_type === 4 && // Own goal event
          ((isHomeTeam &&
            awayPlayers.map((p) => p.id).includes(event.player_id)) ||
            (!isHomeTeam &&
              homePlayers.map((p) => p.id).includes(event.player_id)))
      )
      .map((event) => {
        // const player = playersData.find((p) => p.id === event.player_id);
        return "Auto-Golo";
      })
      .filter((goal) => goal !== null); // Filter out nulls

    // Combine regular goals and own goals
    const allGoals = [
      ...Object.entries(goalscorerCounts).map(
        ([name, count]) => `${name} (${count})`
      ),
      ...ownGoals, // Include own goals
    ];

    return allGoals;
  };

  // Function to get yellow and red cards for each team
  const getCards = (teamId) => {
    const playerIds =
      teamId === matchDetails.home_team.id
        ? homePlayers.map((player) => player.id)
        : awayPlayers.map((player) => player.id);

    // Track each player's events to avoid duplicate entries for red and double yellow cards
    const playerEvents = {};

    matchEvents
      .filter(
        (event) =>
          (event.event_type === 2 ||
            event.event_type === 3 ||
            event.event_type === 5) &&
          playerIds.includes(event.player_id)
      )
      .forEach((event) => {
        const playerId = event.player_id;

        // Check if this player has already been processed
        if (!playerEvents[playerId]) {
          playerEvents[playerId] = {
            yellow: false,
            red: false,
            doubleYellow: false,
          };
        }

        // Mark event types for the player
        if (event.event_type === 2) {
          playerEvents[playerId].yellow = true;
        } else if (event.event_type === 3) {
          playerEvents[playerId].red = true;
        } else if (event.event_type === 5) {
          playerEvents[playerId].doubleYellow = true;
        }
      });

    // Generate the card events list based on prioritized conditions
    const cardEvents = Object.keys(playerEvents)
      .map((playerId) => {
        const player = playersData.find((p) => p.id === parseInt(playerId));
        if (player) {
          const { yellow, red, doubleYellow } = playerEvents[playerId];
          return {
            name: player.name,
            cardType: doubleYellow
              ? "double-yellow"
              : red
                ? "red"
                : yellow
                  ? "yellow"
                  : null,
          };
        }
        return null;
      })
      .filter((event) => event && event.cardType);

    return cardEvents;
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
    doc.text("LIGA DE FUTEBOL VETERANOS DO SADO", 50, 15);
    // Reset text color to black for other sections if needed
    doc.setFontSize(15);
    doc.text("2024/25", 95, 22);
    doc.setTextColor(0, 0, 0); // Black color for other text
    doc.setFontSize(10);
    // Check matchDetails before accessing match_date
    const matchDateText = matchDetails
      ? dayjs(matchDetails.match_date).format("DD/MM/YYYY")
      : "Date TBD";

    doc.text(`${competitionType}`, 30, 30);
    doc.text(`${matchDateText}`, 95, 30);
    doc.text(`${competitionText}`, 170, 30);

    // Divider line below title section
    doc.line(10, 32, 200, 32);

    // Team Names with "A" and "B" labels and "VS" in the middle
    doc.setFontSize(16);
    doc.text("A", 10, 40);
    doc.text(`${matchDetails.home_team.short_name}`, 30, 40);
    doc.text("VS", 100, 40);
    if (matchDetails.away_team.short_name === "Bairro Santos Nicolau") {
      doc.text(`${matchDetails.away_team.short_name}`, 137, 40);
    } else {
      doc.text(`${matchDetails.away_team.short_name}`, 140, 40);
    }
    doc.text("B", 195, 40); // Shifted "B" further to the right

    // Divider line below team names section
    doc.line(10, 43, 200, 43);

    // Player Table Headers
    doc.setFontSize(11); // Reduced font size for compact table
    doc.text("Nº", 11, 50);
    doc.text("NOMES DOS ATLETAS", 20, 50);
    doc.text("GOLOS", 67, 50);
    doc.text("DISCIPLINA", 95, 50);
    doc.text("GOLOS", 124, 50);
    doc.text("NOMES DOS ATLETAS", 145, 50);
    doc.text("Nº", 192, 50); // Closer to the right side for better alignment

    // Define initial y-coordinate for player rows
    let rowStartY = 53;
    let rowHeight = 5;

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
    const columnsX = [10, 19, 66, 87, 123, 144, 191, 200]; // X-coordinates for the column lines
    columnsX.forEach((x) => {
      doc.line(x, 46, x, lastPlayerY + 2); // Vertical lines from headers to the last row
    });

    // Draw the vertical line to divide the "DISCIPLINA" column into two sections
    const disciplinaX = 105; // X-coordinate for "DISCIPLINA" header
    doc.line(disciplinaX, 51, disciplinaX, lastPlayerY + 2); // Vertical line below the header

    // Draw horizontal lines for each row (including headers)
    for (let y = 46; y <= lastPlayerY; y += rowHeight) {
      doc.line(10, y, 200, y); // Horizontal line spanning across all columns
    }

    // Draw player data within the grid
    sortedHomePlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      // Player number
      doc.text(String(player.number || ""), 12, yPos);

      // Player name
      doc.text(playerName, 20, yPos + 2);

      // Golos column - Add "Castigado" in bold and red if the player is suspended
      if (suspendedPlayerIds.includes(player.id)) {
        doc.setFontSize(9);
        doc.setTextColor(255, 0, 0); // Set color to red
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.text("CASTIGADO", 67, yPos + 2);
        doc.setFont("helvetica", "normal"); // Reset font to normal
        doc.setTextColor(0, 0, 0); // Reset color to black
        doc.setFontSize(11); // Reset font size for player table
      }
    });
    doc.setFontSize(11); // Reset font size for player table

    sortedAwayPlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      // Player number on the right side
      doc.text(String(player.number || ""), 195, yPos);

      // Player name on the right side
      doc.text(playerName, 145, yPos + 2);

      // Golos column for away team - Add "Castigado" in bold and red if the player is suspended
      if (suspendedPlayerIds.includes(player.id)) {
        doc.setFontSize(9);
        doc.setTextColor(255, 0, 0); // Set color to red
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.text("CASTIGADO", 124, yPos + 2);
        doc.setFont("helvetica", "normal"); // Reset font to normal
        doc.setTextColor(0, 0, 0); // Reset color to black
        doc.setFontSize(11); // Reset font size for player table
      }
    });
    doc.setFontSize(11); // Reset font size for player table

    // Final horizontal line at the bottom of the table
    doc.line(10, lastPlayerY + 2, 200, lastPlayerY + 2); // Bottom border of the table

    // Divider line below player table section
    const yOffset =
      75 + Math.max(homePlayers.length, awayPlayers.length) * 4 + 5;
    doc.line(10, yOffset - 2, 200, yOffset - 2);

    // Coaches and Delegates Section
    doc.setFontSize(10);
    doc.text("NOMES DOS TREINADORES E DELEGADOS", 10, yOffset + 3);
    doc.setFontSize(8);
    // doc.line(10, 55, 200, 55);
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
    doc.rect(10, yOffset + 22, 190, 15);
    doc.text("OBSERVAÇÕES:", 15, yOffset + 27);

    // Divider line below observations section
    doc.line(10, yOffset + 39, 200, yOffset + 39);

    // Goals Section as a two-row table with smaller boxes
    doc.setFontSize(10);
    doc.text("GOLOS -- Nº DO JOGADOR", 10, yOffset + 44);

    // Row for Team A
    doc.text("A", 10, yOffset + 54);
    for (let i = 0; i < 23; i++) {
      doc.rect(16 + i * 8, yOffset + 49, 8, 8); // Smaller boxes (8x8)
    }

    // Row for Team B
    doc.text("B", 10, yOffset + 64);
    for (let i = 0; i < 23; i++) {
      doc.rect(16 + i * 8, yOffset + 59, 8, 8); // Smaller boxes (8x8)
    }

    // Divider line below goals section
    doc.line(10, yOffset + 69, 200, yOffset + 69);

    // Final Result Section
    doc.text(`${matchDetails.home_team.short_name}`, 20, yOffset + 87);
    doc.circle(70, yOffset + 87, 8); // Increased radius for home team goals (was 5)
    doc.setFontSize(12);
    doc.text("RESULTADO FINAL", 86, yOffset + 91 - 16); // Added above VS
    doc.setFontSize(10);
    doc.text("VS", 100, yOffset + 87);
    doc.circle(140, yOffset + 86, 8); // Increased radius for away team goals (was 5)
    doc.text(`${matchDetails.away_team.short_name}`, 160, yOffset + 87);

    // Divider line below final result section
    doc.line(10, yOffset + 99, 200, yOffset + 99);

    // Signature Section
    doc.text("DELEGADO", 10, yOffset + 107);
    doc.line(10, yOffset + 114, 50, yOffset + 114); // Line for delegate signature
    doc.text("ÁRBITRO", 85, yOffset + 107);
    doc.line(85, yOffset + 114, 125, yOffset + 114); // Line for referee signature
    doc.text("DELEGADO", 160, yOffset + 107);
    doc.line(160, yOffset + 114, 200, yOffset + 114); // Line for delegate signature

    // Save the PDF
    doc.save(
      `fichajogo_${matchDetails.home_team.short_name}_vs_${matchDetails.away_team.short_name}.pdf`
    );
  };

  return (
    <Box
      sx={{
        padding: isSmallScreen ? "2rem 1rem" : "4rem 2rem",
        textAlign: "center",
      }}
    >
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

          <Box
            sx={{
              mt: isSmallScreen ? 1 : 5,
              mb: isSmallScreen ? 1 : 5,
            }}
          >
            {/* Match Layout */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 20px",
              }}
            >
              {/* Home Team Logo, Name, and Score */}
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
                  variant={isSmallScreen ? "h6" : "h4"}
                  style={getTeamStyles(
                    matchDetails.home_goals,
                    matchDetails.away_goals,
                    "home"
                  )}
                  sx={{ mt: 2, width: "auto" }}
                >
                  {matchDetails.home_team.short_name}
                </Typography>
                <Typography
                  variant={isSmallScreen ? "h4" : "h2"}
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
                  mx: isSmallScreen ? 0 : 4,
                }}
              >
                <Typography
                  variant={isSmallScreen ? "h6" : "h5"}
                  sx={{
                    marginBottom: "0.5rem",
                    fontSize: isSmallScreen ? "1rem" : "1.5rem",
                  }}
                >
                  {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: isSmallScreen ? "1rem" : "1.5rem" }}
                >
                  {matchDetails.match_time}
                </Typography>
              </Box>

              {/* Away Team Logo, Name, and Score */}
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
                  variant={isSmallScreen ? "h6" : "h4"}
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
                  variant={isSmallScreen ? "h4" : "h2"}
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

            {isSmallScreen ? (
              // Code for small screens
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "row", // Column for small screens
                  justifyContent: isSmallScreen ? "space-between" : "center", // Adjust for spacing
                }}
              >
                {/* Home Team: Goals and Discipline */}
                <Box
                  sx={{
                    textAlign: "center",
                    mr: isSmallScreen ? 0 : 5,
                    mb: isSmallScreen ? 3 : 0,
                  }}
                >
                  <Typography variant="h6">Golos</Typography>
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

                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Disciplina
                  </Typography>
                  {getCards(matchDetails.home_team.id).length > 0 ? (
                    getCards(matchDetails.home_team.id).map(
                      (cardEvent, index) => (
                        <Typography key={index} variant="body1">
                          {cardEvent.name}{" "}
                          {cardEvent.cardType === "yellow" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "#ffcd00",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : cardEvent.cardType === "red" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "red",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : (
                            // Double yellow (expulsion) display
                            <>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  backgroundColor: "#ffcd00",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                  marginRight: "2px",
                                }}
                              ></span>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  background:
                                    "linear-gradient(to bottom right, #ffcd00 50%, red 50%)",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                }}
                              ></span>
                            </>
                          )}
                        </Typography>
                      )
                    )
                  ) : (
                    <Typography variant="body2">Sem cartões</Typography>
                  )}
                </Box>

                {/* Vertical Line Divider */}
                {!isSmallScreen && (
                  <Box
                    sx={{
                      width: "2px",
                      backgroundColor: "gray",
                      height: "auto",
                      mx: isSmallScreen ? 2 : 4,
                    }}
                  />
                )}

                {/* Away Team: Discipline and Goals */}
                <Box
                  sx={{
                    textAlign: "center",
                    ml: isSmallScreen ? 0 : 5,
                    mb: isSmallScreen ? 3 : 0,
                  }}
                >
                  <Typography variant="h6">Golos</Typography>
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

                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Disciplina
                  </Typography>
                  {getCards(matchDetails.away_team.id).length > 0 ? (
                    getCards(matchDetails.away_team.id).map(
                      (cardEvent, index) => (
                        <Typography key={index} variant="body1">
                          {cardEvent.name}{" "}
                          {cardEvent.cardType === "yellow" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "#ffcd00",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : cardEvent.cardType === "red" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "red",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : (
                            // Double yellow (expulsion) display
                            <>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  backgroundColor: "#ffcd00",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                  marginRight: "2px",
                                }}
                              ></span>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  background:
                                    "linear-gradient(to bottom right, #ffcd00 50%, red 50%)",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                }}
                              ></span>
                            </>
                          )}
                        </Typography>
                      )
                    )
                  ) : (
                    <Typography variant="body2">Sem cartões</Typography>
                  )}
                </Box>
              </Box>
            ) : (
              // Code for larger screens
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
                  <Typography variant="h6">Golos</Typography>
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
                <Box sx={{ textAlign: "center", mr: 5 }}>
                  <Typography variant="h6">Disciplina</Typography>
                  {getCards(matchDetails.home_team.id).length > 0 ? (
                    getCards(matchDetails.home_team.id).map(
                      (cardEvent, index) => (
                        <Typography key={index} variant="body1">
                          {cardEvent.name}{" "}
                          {cardEvent.cardType === "yellow" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "#ffcd00",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : cardEvent.cardType === "red" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "red",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : (
                            // Double yellow (expulsion) display
                            <>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  backgroundColor: "#ffcd00",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                  marginRight: "2px",
                                }}
                              ></span>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  background:
                                    "linear-gradient(to bottom right, #ffcd00 50%, red 50%)",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                }}
                              ></span>
                            </>
                          )}
                        </Typography>
                      )
                    )
                  ) : (
                    <Typography variant="body2">Sem cartões</Typography>
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

                {/* Display Yellow/Red Cards for Away Team */}
                <Box sx={{ textAlign: "center", ml: 5 }}>
                  <Typography variant="h6">Disciplina</Typography>
                  {getCards(matchDetails.away_team.id).length > 0 ? (
                    getCards(matchDetails.away_team.id).map(
                      (cardEvent, index) => (
                        <Typography key={index} variant="body1">
                          {cardEvent.name}{" "}
                          {cardEvent.cardType === "yellow" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "#ffcd00",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : cardEvent.cardType === "red" ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "13px",
                                height: "20px",
                                backgroundColor: "red",
                                borderRadius: "2px",
                                verticalAlign: "middle",
                              }}
                            ></span>
                          ) : (
                            // Double yellow (expulsion) display
                            <>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  backgroundColor: "#ffcd00",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                  marginRight: "2px",
                                }}
                              ></span>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "13px",
                                  height: "20px",
                                  background:
                                    "linear-gradient(to bottom right, #ffcd00 50%, red 50%)",
                                  borderRadius: "2px",
                                  verticalAlign: "middle",
                                }}
                              ></span>
                            </>
                          )}
                        </Typography>
                      )
                    )
                  ) : (
                    <Typography variant="body2">Sem cartões</Typography>
                  )}
                </Box>

                {/* Display Goalscorers for Away Team */}
                <Box sx={{ textAlign: "center", ml: 5 }}>
                  <Typography variant="h6">Golos</Typography>
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
            )}
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
              {matchDetails &&
              dayjs().isAfter(dayjs(matchDetails.match_date).add(1, "day")) ? (
                <Link
                  href={matchDetails.match_sheet} // Use match_sheet if the match_date has passed
                  target="_blank" // Open the link in a new window
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <DownloadIcon sx={{ marginRight: 1, color: "#6B4BA1" }} />{" "}
                  {/* Icon with right margin */}
                  <Typography variant="h6" sx={{ color: "#6B4BA1" }}>
                    Ficha de Jogo Completa
                  </Typography>
                </Link>
              ) : (
                <Link
                  onClick={generatePDF} // Generate PDF if the match_date has not passed
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <DownloadIcon sx={{ marginRight: 1, color: "#6B4BA1" }} />{" "}
                  {/* Icon with right margin */}
                  <Typography variant="h6" sx={{ color: "#6B4BA1" }}>
                    Ficha de Jogo
                  </Typography>
                </Link>
              )}
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
                  {homePlayers
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name in ascending order
                    .map((player) => (
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
                mx: isSmallScreen ? 1 : 2,
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
                  {awayPlayers
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name in ascending order
                    .map((player) => (
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
        </>
      ) : (
        <Typography variant="body1">Carregar dados do Jogo</Typography>
      )}
    </Box>
  );
};

export default MatchPage;
