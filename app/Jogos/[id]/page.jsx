"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  Link,
  Avatar,
  CircularProgress,
  Alert,
  useMediaQuery,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Fab,
  Collapse,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import {
  Download,
  SportsSoccer,
  EmojiEvents,
  CalendarToday,
  AccessTime,
  Stadium,
  ArrowBack,
  Shield,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import { theme } from "../../../styles/theme.js";

const MatchPage = () => {
  const [matchDetails, setMatchDetails] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [currentHomePlayers, setCurrentHomePlayers] = useState([]);
  const [currentAwayPlayers, setCurrentAwayPlayers] = useState([]);
  const [matchEvents, setMatchEvents] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;
  const [suspendedPlayerIds, setSuspendedPlayerIds] = useState([]);
  const [homeSquadExpanded, setHomeSquadExpanded] = useState(false);
  const [awaySquadExpanded, setAwaySquadExpanded] = useState(false);
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // Remove individual fetch functions since we're handling everything in useEffect

  useEffect(() => {
    if (id) {
      const loadMatchData = async () => {
        setLoading(true);
        try {
          // Fetch match details first
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
              home_penalties,
              away_penalties,
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
            setError("Erro ao carregar detalhes do jogo");
            return;
          }

          setMatchDetails(matchData);

          // Fetch all related data in parallel
          const [
            playersResult,
            eventsResult,
            suspensionsResult,
            currentPlayersResult,
          ] = await Promise.allSettled([
            // Fetch all players
            supabase
              .from("players")
              .select("id, name, photo_url, joker, team_id, previousClub"),

            // Fetch match events
            supabase
              .from("match_events")
              .select("event_type, player_id")
              .eq("match_id", matchData.id),

            // Fetch suspensions
            supabase.from("suspensions").select("player_id").eq("active", true),

            // Fetch current players
            supabase
              .from("players")
              .select("id, name, photo_url, joker, team_id"),
          ]);

          // Process players data
          if (
            playersResult.status === "fulfilled" &&
            playersResult.value.data
          ) {
            const allPlayers = playersResult.value.data;

            const homePlayersData = allPlayers.filter(
              (player) =>
                player.team_id === matchData.home_team.id ||
                player.previousClub === matchData.home_team.id
            );
            const awayPlayersData = allPlayers.filter(
              (player) =>
                player.team_id === matchData.away_team.id ||
                player.previousClub === matchData.away_team.id
            );

            const homePlayerIds = homePlayersData.map((player) => player.id);
            const filteredAwayPlayers = awayPlayersData.filter(
              (player) => !homePlayerIds.includes(player.id)
            );

            setHomePlayers(homePlayersData);
            setAwayPlayers(filteredAwayPlayers);
          }

          // Process current players
          if (
            currentPlayersResult.status === "fulfilled" &&
            currentPlayersResult.value.data
          ) {
            const allCurrentPlayers = currentPlayersResult.value.data;

            const currentHomePlayers = allCurrentPlayers.filter(
              (player) => player.team_id === matchData.home_team.id
            );
            const currentAwayPlayers = allCurrentPlayers.filter(
              (player) => player.team_id === matchData.away_team.id
            );

            setCurrentHomePlayers(currentHomePlayers);
            setCurrentAwayPlayers(currentAwayPlayers);
          }

          // Process match events
          if (eventsResult.status === "fulfilled" && eventsResult.value.data) {
            const events = eventsResult.value.data;
            setMatchEvents(events);

            // Fetch players data for events if there are any
            if (events.length > 0) {
              const playerIds = events.map((event) => event.player_id);
              const { data: eventPlayersData } = await supabase
                .from("players")
                .select("id, name, team_id, joker, previousClub")
                .in("id", playerIds);

              if (eventPlayersData) {
                setPlayersData(eventPlayersData);
              }
            }
          }

          // Process suspensions
          if (
            suspensionsResult.status === "fulfilled" &&
            suspensionsResult.value.data
          ) {
            setSuspendedPlayerIds(
              suspensionsResult.value.data.map((record) => record.player_id)
            );
          }
        } catch (err) {
          console.error("Error loading match data:", err);
          setError("Erro inesperado ao carregar o jogo");
        } finally {
          setLoading(false);
        }
      };

      loadMatchData();
    }
  }, [id]); // Only depend on id

  const getTeamStyles = (
    homeGoals,
    awayGoals,
    homePenalties,
    awayPenalties,
    competitionType,
    team
  ) => {
    if (homeGoals !== null && awayGoals !== null) {
      if (homeGoals > awayGoals && team === "home") {
        return { fontWeight: "bold", color: theme.colors.accent[500] };
      } else if (awayGoals > homeGoals && team === "away") {
        return { fontWeight: "bold", color: theme.colors.accent[500] };
      } else if (homeGoals === awayGoals && competitionType === "Cup") {
        if (homePenalties > awayPenalties && team === "home") {
          return { fontWeight: "bold", color: theme.colors.accent[500] };
        } else if (awayPenalties > homePenalties && team === "away") {
          return { fontWeight: "bold", color: theme.colors.accent[500] };
        }
      }
    }
    return {};
  };

  const getGoalscorers = (teamId) => {
    const isHomeTeam = teamId === matchDetails.home_team.id;
    const teamPlayers = isHomeTeam ? homePlayers : awayPlayers;

    const goalscorerCounts = matchEvents
      .filter((event) => event.event_type === 1)
      .reduce((acc, event) => {
        const player = teamPlayers.find(
          (p) => p.id === event.player_id || p.previousClub === event.player_id
        );
        if (player) {
          acc[player.name] = (acc[player.name] || 0) + 1;
        }
        return acc;
      }, {});

    const ownGoals = matchEvents
      .filter(
        (event) =>
          event.event_type === 4 &&
          ((isHomeTeam &&
            awayPlayers.some(
              (p) =>
                p.id === event.player_id || p.previousClub === event.player_id
            )) ||
            (!isHomeTeam &&
              homePlayers.some(
                (p) =>
                  p.id === event.player_id || p.previousClub === event.player_id
              )))
      )
      .map(() => "Auto-Golo");

    const allGoals = [
      ...Object.entries(goalscorerCounts).map(
        ([name, count]) => `${name} (${count})`
      ),
      ...ownGoals,
    ];

    return allGoals;
  };

  const getCards = (teamId) => {
    const playerEvents = {};

    matchEvents
      .filter(
        (event) =>
          event.event_type === 2 || // Yellow card
          event.event_type === 3 || // Red card
          event.event_type === 5 // Double yellow
      )
      .forEach((event) => {
        const player = playersData.find((p) => p.id === event.player_id);
        if (!player) return;

        if (player.team_id === teamId) {
          if (!playerEvents[player.id]) {
            playerEvents[player.id] = { cards: [] };
          }
          if (event.event_type === 2) {
            playerEvents[player.id].cards.push("yellow");
          } else if (event.event_type === 3) {
            playerEvents[player.id].cards.push("red");
          } else if (event.event_type === 5) {
            playerEvents[player.id].cards.push("double-yellow");
          }
        }
      });

    Object.values(playerEvents).forEach((entry) => {
      if (entry.cards.includes("double-yellow")) {
        entry.cards = entry.cards.filter((card) => card !== "red");
      }
    });

    const cardEvents = Object.keys(playerEvents).map((playerId) => {
      const player = playersData.find((p) => p.id === parseInt(playerId, 10));
      return {
        name: player?.name || "Unknown",
        cards: playerEvents[playerId].cards,
      };
    });

    return cardEvents.filter((ce) => ce.cards.length > 0);
  };

  const competitionText = matchDetails
    ? matchDetails.competition_type === "League"
      ? `Jornada ${matchDetails.week}`
      : matchDetails.competition_type === "Cup"
        ? `Ronda ${matchDetails.round}`
        : matchDetails.competition_type === "Supercup"
          ? ""
          : ""
    : "";

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

    const img = new Image();
    img.src = "/logo/logo.png";
    doc.addImage(img, "PNG", 10, 10, 20, 20);

    doc.setFontSize(18);
    doc.setTextColor(107, 75, 161);
    doc.text("LIGA DE FUTEBOL VETERANOS DO SADO", 50, 15);
    doc.setFontSize(15);
    doc.text("2024/25", 95, 22);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const matchDateText = matchDetails
      ? dayjs(matchDetails.match_date).format("DD/MM/YYYY")
      : "Date TBD";

    doc.text(`${competitionType}`, 30, 30);
    doc.text(`${matchDateText}`, 95, 30);
    doc.text(`${competitionText}`, 170, 30);

    doc.line(10, 32, 200, 32);

    doc.setFontSize(16);
    doc.text("A", 10, 40);
    doc.text(`${matchDetails.home_team.short_name}`, 30, 40);
    doc.text("VS", 100, 40);
    if (matchDetails.away_team.short_name === "Bairro Santos Nicolau") {
      doc.text(`${matchDetails.away_team.short_name}`, 137, 40);
    } else {
      doc.text(`${matchDetails.away_team.short_name}`, 140, 40);
    }
    doc.text("B", 195, 40);

    doc.line(10, 43, 200, 43);

    doc.setFontSize(11);
    doc.text("Nº", 11, 50);
    doc.text("NOMES DOS ATLETAS", 20, 50);
    doc.text("GOLOS", 67, 50);
    doc.text("DISCIPLINA", 95, 50);
    doc.text("GOLOS", 124, 50);
    doc.text("NOMES DOS ATLETAS", 145, 50);
    doc.text("Nº", 192, 50);

    let rowStartY = 53;
    let rowHeight = 5;

    const sortedHomePlayers = [...currentHomePlayers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedAwayPlayers = [...currentAwayPlayers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const lastPlayerY =
      rowStartY +
      Math.max(sortedHomePlayers.length, sortedAwayPlayers.length) * rowHeight;

    const columnsX = [10, 19, 66, 87, 123, 144, 191, 200];
    columnsX.forEach((x) => {
      doc.line(x, 46, x, lastPlayerY + 2);
    });

    const disciplinaX = 105;
    doc.line(disciplinaX, 51, disciplinaX, lastPlayerY + 2);

    for (let y = 46; y <= lastPlayerY; y += rowHeight) {
      doc.line(10, y, 200, y);
    }

    sortedHomePlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      doc.text(String(player.number || ""), 12, yPos);
      doc.text(playerName, 20, yPos + 2);

      if (suspendedPlayerIds.includes(player.id)) {
        doc.setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("CASTIGADO", 67, yPos + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
      }
    });

    sortedAwayPlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      doc.text(String(player.number || ""), 195, yPos);
      doc.text(playerName, 145, yPos + 2);

      if (suspendedPlayerIds.includes(player.id)) {
        doc.setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("CASTIGADO", 124, yPos + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
      }
    });

    doc.line(10, lastPlayerY + 2, 200, lastPlayerY + 2);

    const yOffset =
      75 +
      Math.max(currentHomePlayers.length, currentAwayPlayers.length) * 4 +
      5;
    doc.line(10, yOffset - 2, 200, yOffset - 2);

    doc.setFontSize(10);
    doc.text("NOMES DOS TREINADORES E DELEGADOS", 10, yOffset + 3);
    doc.setFontSize(8);
    doc.text("TREINADOR -", 12, yOffset + 10);
    doc.text("DELEGADO -", 12, yOffset + 15);
    doc.text("TREINADOR -", 120, yOffset + 10);
    doc.text("DELEGADO -", 120, yOffset + 15);

    doc.line(10, yOffset + 7, 200, yOffset + 7);
    doc.line(10, yOffset + 12, 200, yOffset + 12);
    doc.line(10, yOffset + 17, 200, yOffset + 17);
    doc.line(10, yOffset + 7, 10, yOffset + 17);
    doc.line(118, yOffset + 7, 118, yOffset + 17);
    doc.line(100, yOffset + 7, 100, yOffset + 17);
    doc.line(82, yOffset + 7, 82, yOffset + 17);
    doc.line(200, yOffset + 7, 200, yOffset + 17);

    doc.line(10, yOffset + 20, 200, yOffset + 20);

    doc.rect(10, yOffset + 22, 190, 15);
    doc.text("OBSERVAÇÕES:", 15, yOffset + 27);

    doc.line(10, yOffset + 39, 200, yOffset + 39);

    doc.setFontSize(10);
    doc.text("GOLOS -- Nº DO JOGADOR", 10, yOffset + 44);

    doc.text("A", 10, yOffset + 54);
    for (let i = 0; i < 23; i++) {
      doc.rect(16 + i * 8, yOffset + 49, 8, 8);
    }

    doc.text("B", 10, yOffset + 64);
    for (let i = 0; i < 23; i++) {
      doc.rect(16 + i * 8, yOffset + 59, 8, 8);
    }

    doc.line(10, yOffset + 69, 200, yOffset + 69);

    doc.text(`${matchDetails.home_team.short_name}`, 20, yOffset + 87);
    doc.circle(70, yOffset + 87, 8);
    doc.setFontSize(12);
    doc.text("RESULTADO FINAL", 86, yOffset + 91 - 16);
    doc.setFontSize(10);
    doc.text("VS", 100, yOffset + 87);
    doc.circle(140, yOffset + 86, 8);
    doc.text(`${matchDetails.away_team.short_name}`, 160, yOffset + 87);

    doc.line(10, yOffset + 99, 200, yOffset + 99);

    doc.text("DELEGADO", 10, yOffset + 107);
    doc.line(10, yOffset + 114, 50, yOffset + 114);
    doc.text("ÁRBITRO", 85, yOffset + 107);
    doc.line(85, yOffset + 114, 125, yOffset + 114);
    doc.text("DELEGADO", 160, yOffset + 107);
    doc.line(160, yOffset + 114, 200, yOffset + 114);

    doc.save(
      `fichajogo_${matchDetails.home_team.short_name}_vs_${matchDetails.away_team.short_name}.pdf`
    );
  };

  const CardIcon = ({ cardType }) => {
    const getCardStyle = (type) => {
      switch (type) {
        case "yellow":
          return { backgroundColor: "#ffcd00", border: "1px solid #f59e0b" };
        case "red":
          return { backgroundColor: "#ef4444", border: "1px solid #dc2626" };
        case "double-yellow":
          return {
            background: "linear-gradient(135deg, #ffcd00 50%, #ef4444 50%)",
            border: "1px solid #dc2626",
          };
        default:
          return {};
      }
    };

    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "13px",
          height: "20px",
          borderRadius: "2px",
          verticalAlign: "middle",
          marginRight: "4px",
          ...getCardStyle(cardType),
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={3}
        sx={{ backgroundColor: theme.colors.background.secondary }}
      >
        <SportsSoccer
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "spin 2s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar detalhes do jogo...
        </Typography>
      </Box>
    );
  }

  if (!matchDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
          Carregar dados do Jogo
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header Section */}
        <Card
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            mb: 4,
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: isMobile ? 3 : 4 }}>
            <Box textAlign="center" mb={3}>
              <Chip
                icon={<EmojiEvents />}
                label={
                  matchDetails.competition_type === "League"
                    ? `Jornada ${matchDetails.week}`
                    : matchDetails.competition_type === "Cup"
                      ? `Taça : Ronda ${matchDetails.round}`
                      : matchDetails.competition_type === "Supercup"
                        ? "Supertaça"
                        : ""
                }
                sx={{
                  backgroundColor: theme.colors.accent[500],
                  color: theme.colors.neutral[900],
                  fontWeight: "bold",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              />
            </Box>

            {/* Match Display */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              {/* Home Team */}
              <Grid item xs={12} sm={4} md={3}>
                <Box textAlign="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <img
                      src={matchDetails.home_team.logo_url}
                      alt={matchDetails.home_team.short_name}
                      style={{
                        width: isMobile ? "120px" : "160px",
                        height: isMobile ? "120px" : "160px",
                        objectFit: "contain",
                        marginBottom: "16px",
                      }}
                    />
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        textAlign: "center",
                        ...getTeamStyles(
                          matchDetails.home_goals,
                          matchDetails.away_goals,
                          matchDetails.home_penalties,
                          matchDetails.away_penalties,
                          matchDetails.competition_type,
                          "home"
                        ),
                      }}
                    >
                      {matchDetails.home_team.short_name}
                    </Typography>
                  </Box>
                  <Typography
                    variant={isMobile ? "h4" : "h2"}
                    sx={{
                      fontWeight: "bold",
                      ...getTeamStyles(
                        matchDetails.home_goals,
                        matchDetails.away_goals,
                        matchDetails.home_penalties,
                        matchDetails.away_penalties,
                        matchDetails.competition_type,
                        "home"
                      ),
                    }}
                  >
                    {matchDetails.home_goals !== null
                      ? matchDetails.home_goals
                      : "-"}
                    {matchDetails.competition_type === "Cup" &&
                      matchDetails.home_penalties !== null &&
                      ` (${matchDetails.home_penalties})`}
                  </Typography>
                </Box>
              </Grid>

              {/* Date and Time */}
              <Grid item xs={12} sm={4} md={6}>
                <Box textAlign="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    mb={2}
                  >
                    <CalendarToday sx={{ fontSize: 20 }} />
                    <Typography variant={isMobile ? "h6" : "h5"}>
                      {dayjs(matchDetails.match_date).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <AccessTime sx={{ fontSize: 20 }} />
                    <Typography variant="h6">
                      {matchDetails.match_time}
                    </Typography>
                  </Box>

                  {matchDetails.competition_type === "Cup" &&
                    (matchDetails.home_penalties !== null ||
                      matchDetails.away_penalties !== null) && (
                      <Typography
                        variant={isMobile ? "body2" : "body1"}
                        sx={{
                          fontWeight: "bold",
                          fontStyle: "italic",
                          mt: 1,
                          opacity: 0.9,
                        }}
                      >
                        {isMobile
                          ? "Depois de G.P"
                          : "Depois de Grandes Penalidades"}
                      </Typography>
                    )}
                </Box>
              </Grid>

              {/* Away Team */}
              <Grid item xs={12} sm={4} md={3}>
                <Box textAlign="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <img
                      src={matchDetails.away_team.logo_url}
                      alt={matchDetails.away_team.short_name}
                      style={{
                        width: isMobile ? "120px" : "160px",
                        height: isMobile ? "120px" : "160px",
                        objectFit: "contain",
                        marginBottom: "16px",
                      }}
                    />
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        textAlign: "center",
                        ...getTeamStyles(
                          matchDetails.home_goals,
                          matchDetails.away_goals,
                          matchDetails.home_penalties,
                          matchDetails.away_penalties,
                          matchDetails.competition_type,
                          "away"
                        ),
                      }}
                    >
                      {matchDetails.away_team.short_name}
                    </Typography>
                  </Box>
                  <Typography
                    variant={isMobile ? "h4" : "h2"}
                    sx={{
                      fontWeight: "bold",
                      ...getTeamStyles(
                        matchDetails.home_goals,
                        matchDetails.away_goals,
                        matchDetails.home_penalties,
                        matchDetails.away_penalties,
                        matchDetails.competition_type,
                        "away"
                      ),
                    }}
                  >
                    {matchDetails.away_goals !== null
                      ? matchDetails.away_goals
                      : "-"}
                    {matchDetails.competition_type === "Cup" &&
                      matchDetails.away_penalties !== null &&
                      ` (${matchDetails.away_penalties})`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Stadium Info at bottom of header card */}
            <Box
              textAlign="center"
              mt={3}
              pt={2}
              sx={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Stadium sx={{ color: "white", fontSize: 20 }} />
                <Typography
                  variant="body1"
                  sx={{ color: "white", opacity: 0.9 }}
                >
                  {matchDetails.competition_type === "Supercup"
                    ? "Estádio: Campo António Henrique de Matos"
                    : matchDetails.home_team.stadium_name}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Download Match Sheet - moved below Stadium */}
        <Card sx={{ mb: 4, borderRadius: "16px" }}>
          <CardContent>
            <Box textAlign="center" py={2}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.colors.primary[600],
                  mb: 3,
                  fontWeight: "bold",
                }}
              >
                Ficha de Jogo
              </Typography>

              <Box
                onClick={() => {
                  if (
                    matchDetails &&
                    dayjs().isAfter(
                      dayjs(matchDetails.match_date).add(1, "day")
                    )
                  ) {
                    window.open(matchDetails.match_sheet, "_blank");
                  } else {
                    generatePDF();
                  }
                }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "12px 24px",
                  backgroundColor: theme.colors.primary[600],
                  color: "white",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: theme.transitions.normal,
                  "&:hover": {
                    backgroundColor: theme.colors.primary[700],
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows.lg,
                  },
                }}
              >
                <Download sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {matchDetails &&
                  dayjs().isAfter(dayjs(matchDetails.match_date).add(1, "day"))
                    ? "Ficha de Jogo Completa"
                    : "Ficha de Jogo"}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary, mt: 2 }}
              >
                {matchDetails &&
                dayjs().isAfter(dayjs(matchDetails.match_date).add(1, "day"))
                  ? "Aceda à ficha de jogo oficial preenchida"
                  : "Descarregue a ficha de jogo em formato PDF"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Match Statistics */}
        <Grid container spacing={3} mb={4}>
          {/* Home Team Stats */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", borderRadius: "16px" }}>
              <CardContent>
                <Box textAlign="center" mb={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                    }}
                  >
                    {matchDetails.home_team.short_name}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={isMobile ? 3 : 4}
                >
                  {/* Goals */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <SportsSoccer sx={{ color: theme.colors.sports.goals }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Marcadores
                      </Typography>
                    </Box>
                    {getGoalscorers(matchDetails.home_team.id).length > 0 ? (
                      getGoalscorers(matchDetails.home_team.id).map(
                        (goalscorer, index) => (
                          <Typography
                            key={index}
                            variant="body1"
                            sx={{ mb: 0.5, pl: 4 }}
                          >
                            ⚽ {goalscorer}
                          </Typography>
                        )
                      )
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ pl: 4, color: theme.colors.text.secondary }}
                      >
                        Sem marcadores
                      </Typography>
                    )}
                  </Box>

                  {!isMobile && (
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  )}

                  {/* Cards */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Shield sx={{ color: theme.colors.warning[500] }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Disciplina
                      </Typography>
                    </Box>
                    {getCards(matchDetails.home_team.id).length > 0 ? (
                      getCards(matchDetails.home_team.id).map(
                        (cardEvent, index) => (
                          <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                            sx={{ pl: 4 }}
                          >
                            <Typography variant="body1">
                              {cardEvent.name}
                            </Typography>
                            {cardEvent.cards.map((cardType, cardIndex) => (
                              <CardIcon key={cardIndex} cardType={cardType} />
                            ))}
                          </Box>
                        )
                      )
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ pl: 4, color: theme.colors.text.secondary }}
                      >
                        Sem cartões
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Away Team Stats */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", borderRadius: "16px" }}>
              <CardContent>
                <Box textAlign="center" mb={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                    }}
                  >
                    {matchDetails.away_team.short_name}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={isMobile ? 3 : 4}
                >
                  {/* Goals */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <SportsSoccer sx={{ color: theme.colors.sports.goals }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Marcadores
                      </Typography>
                    </Box>
                    {getGoalscorers(matchDetails.away_team.id).length > 0 ? (
                      getGoalscorers(matchDetails.away_team.id).map(
                        (goalscorer, index) => (
                          <Typography
                            key={index}
                            variant="body1"
                            sx={{ mb: 0.5, pl: 4 }}
                          >
                            ⚽ {goalscorer}
                          </Typography>
                        )
                      )
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ pl: 4, color: theme.colors.text.secondary }}
                      >
                        Sem marcadores
                      </Typography>
                    )}
                  </Box>

                  {!isMobile && (
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  )}

                  {/* Cards */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Shield sx={{ color: theme.colors.warning[500] }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Disciplina
                      </Typography>
                    </Box>
                    {getCards(matchDetails.away_team.id).length > 0 ? (
                      getCards(matchDetails.away_team.id).map(
                        (cardEvent, index) => (
                          <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                            sx={{ pl: 4 }}
                          >
                            <Typography variant="body1">
                              {cardEvent.name}
                            </Typography>
                            {cardEvent.cards.map((cardType, cardIndex) => (
                              <CardIcon key={cardIndex} cardType={cardType} />
                            ))}
                          </Box>
                        )
                      )
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ pl: 4, color: theme.colors.text.secondary }}
                      >
                        Sem cartões
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Team Squads */}
        <Grid container spacing={3}>
          {/* Home Team Squad */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={isMobile ? 0 : 3}
                  onClick={
                    isMobile
                      ? () => setHomeSquadExpanded(!homeSquadExpanded)
                      : undefined
                  }
                  sx={{
                    cursor: isMobile ? "pointer" : "default",
                    "&:hover": isMobile
                      ? {
                          backgroundColor: theme.colors.background.tertiary,
                          borderRadius: "8px",
                        }
                      : {},
                    padding: isMobile ? "8px" : "0",
                    marginX: isMobile ? "-8px" : "0",
                    transition: theme.transitions.normal,
                  }}
                >
                  <Avatar
                    src={matchDetails.home_team.logo_url}
                    alt={matchDetails.home_team.short_name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    Jogadores {matchDetails.home_team.short_name}
                  </Typography>
                  {isMobile && (
                    <IconButton
                      size="small"
                      sx={{ color: theme.colors.primary[600] }}
                    >
                      {homeSquadExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </Box>

                <Collapse
                  in={!isMobile || homeSquadExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container spacing={1}>
                    {currentHomePlayers
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((player) => (
                        <Grid item xs={12} sm={6} key={player.id}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            p={1}
                            sx={{
                              borderRadius: "8px",
                              backgroundColor: suspendedPlayerIds.includes(
                                player.id
                              )
                                ? theme.colors.error[50]
                                : theme.colors.background.tertiary,
                              border: suspendedPlayerIds.includes(player.id)
                                ? `1px solid ${theme.colors.error[300]}`
                                : "1px solid transparent",
                            }}
                          >
                            <Avatar
                              src={player.photo_url}
                              alt={player.name}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box flex={1} minWidth={0}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "medium",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: suspendedPlayerIds.includes(player.id)
                                    ? theme.colors.error[700]
                                    : theme.colors.text.primary,
                                }}
                              >
                                {player.name}
                                {player.joker && " (JK)"}
                              </Typography>
                              {suspendedPlayerIds.includes(player.id) && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.colors.error[600],
                                    fontWeight: "bold",
                                  }}
                                >
                                  Suspenso
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>

          {/* Away Team Squad */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "16px", height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={isMobile ? 2 : 3}
                  onClick={
                    isMobile
                      ? () => setAwaySquadExpanded(!awaySquadExpanded)
                      : undefined
                  }
                  sx={{
                    cursor: isMobile ? "pointer" : "default",
                    "&:hover": isMobile
                      ? {
                          backgroundColor: theme.colors.background.tertiary,
                          borderRadius: "8px",
                        }
                      : {},
                    padding: isMobile ? "8px" : "0",
                    marginX: isMobile ? "-8px" : "0",
                    transition: theme.transitions.normal,
                  }}
                >
                  <Avatar
                    src={matchDetails.away_team.logo_url}
                    alt={matchDetails.away_team.short_name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    Jogadores {matchDetails.away_team.short_name}
                  </Typography>
                  {isMobile && (
                    <IconButton
                      size="small"
                      sx={{ color: theme.colors.primary[600] }}
                    >
                      {awaySquadExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </Box>

                <Collapse
                  in={!isMobile || awaySquadExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container spacing={1}>
                    {currentAwayPlayers
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((player) => (
                        <Grid item xs={12} sm={6} key={player.id}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            p={1}
                            sx={{
                              borderRadius: "8px",
                              backgroundColor: suspendedPlayerIds.includes(
                                player.id
                              )
                                ? theme.colors.error[50]
                                : theme.colors.background.tertiary,
                              border: suspendedPlayerIds.includes(player.id)
                                ? `1px solid ${theme.colors.error[300]}`
                                : "1px solid transparent",
                            }}
                          >
                            <Avatar
                              src={player.photo_url}
                              alt={player.name}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box flex={1} minWidth={0}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "medium",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: suspendedPlayerIds.includes(player.id)
                                    ? theme.colors.error[700]
                                    : theme.colors.text.primary,
                                }}
                              >
                                {player.name}
                                {player.joker && " (JK)"}
                              </Typography>
                              {suspendedPlayerIds.includes(player.id) && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.colors.error[600],
                                    fontWeight: "bold",
                                  }}
                                >
                                  Suspenso
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MatchPage;
