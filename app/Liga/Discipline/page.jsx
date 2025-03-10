"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  Modal,
  Button,
} from "@mui/material";

const Discipline = () => {
  const [disciplineData, setDisciplineData] = useState([]);
  const [punishmentEvents, setPunishmentEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const router = useRouter();

  const currentTeam = disciplineData.find(
    (team) => team.team_id === currentTeamId
  );

  const readDiscipline = async () => {
    const { data, error } = await supabase.from("discipline_standings").select(`
        team_id,
        teams!discipline_standings_team_id_fkey (short_name, logo_url),
        matches_played,
        yellow_cards,
        red_cards,
        calculated_points,
        other_punishments,
        excluded
      `);

    if (error) {
      console.error("Error fetching discipline data:", error);
      return;
    }

    // Fetch active suspensions
    const { data: suspensions, error: suspensionsError } = await supabase
      .from("suspensions")
      .select(
        `
        player_id,
        players (name, team_id),
        active
      `
      )
      .eq("active", true);

    if (suspensionsError) {
      console.error("Error fetching suspended players:", suspensionsError);
      return;
    }

    // Group suspended players by team
    const suspendedPlayersByTeam = suspensions.reduce((acc, suspension) => {
      const teamId = suspension.players?.team_id;
      if (!teamId) return acc;
      if (!acc[teamId]) acc[teamId] = [];
      acc[teamId].push(suspension.players.name);
      return acc;
    }, {});

    // Fetch all players
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select(`id, name, team_id`);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return;
    }

    // Fetch match events (to count yellow cards)
    const { data: matchEvents, error: matchEventsError } = await supabase
      .from("match_events")
      .select(`player_id, event_type`)
      .eq("event_type", 2); // 2 might represent "yellow card"

    if (matchEventsError) {
      console.error("Error fetching match events:", matchEventsError);
      return;
    }

    // Count yellow cards per player
    const yellowCardCounts = matchEvents.reduce((acc, event) => {
      if (!acc[event.player_id]) acc[event.player_id] = 0;
      acc[event.player_id] += 1;
      return acc;
    }, {});

    // Identify players who are "at risk" (one card away from suspension)
    const playersAtRisk = players.reduce((acc, player) => {
      const cards = yellowCardCounts[player.id] || 0;
      // Example rule: if (cards + 1) % 3 === 0
      if ((cards + 1) % 3 === 0) {
        const teamId = player.team_id;
        if (!acc[teamId]) acc[teamId] = [];
        acc[teamId].push(player.name);
      }
      return acc;
    }, {});

    // Sort discipline data
    const sortedData = data
      .sort((a, b) => {
        // excluded teams to the bottom
        if (a.excluded && !b.excluded) return 1;
        if (!a.excluded && b.excluded) return -1;

        const avgA = a.matches_played
          ? a.calculated_points / a.matches_played
          : 0;
        const avgB = b.matches_played
          ? b.calculated_points / b.matches_played
          : 0;
        return avgA - avgB;
      })
      .map((team) => ({
        ...team,
        suspendedPlayers: suspendedPlayersByTeam[team.team_id] || [],
        atRiskPlayers: playersAtRisk[team.team_id] || [],
      }));

    setDisciplineData(sortedData);
  };

  const fetchPunishmentEvents = async (teamId) => {
    // This is the critical part: ensure the .select(...) relationship paths
    // match your foreign key columns exactly. The snippet below shows
    // each relevant relationship. Adjust columns as needed.
    const { data, error } = await supabase
      .from("team_punishments")
      .select(
        `
        team_punishment_id,
        event_date,
        description,
        quantity,
        team_id,
        match_id,
        punishment_type_id,
        season,
        player_id,

        team:teams (
          id,
          short_name,
          logo_url
        ),

        punishment_type:punishment_types (
          punishment_type_id,
          description
        ),

        match:matches (
          id,
          home_team_id,
          away_team_id
        ),

        season_table:seasons (
          id
        ),

        player:players (
          id,
          name
        )
      `
      )
      .eq("team_id", teamId);

    if (error) {
      console.error("Error fetching punishment events:", error);
      setPunishmentEvents([]);
    } else {
      setPunishmentEvents(data ?? []);
    }
  };

  // Open modal for the clicked team
  const handleRowClick = async (teamId) => {
    setCurrentTeamId(teamId);
    await fetchPunishmentEvents(teamId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPunishmentEvents([]); // clear or keep
  };

  useEffect(() => {
    readDiscipline();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2" sx={{ color: "#6B4BA1" }}>
          DISCIPLINA
        </Typography>
        <Box>
          <Typography
            variant="body1"
            component="label"
            fontWeight="bold"
            sx={{ color: "#6B4BA1" }}
            mr={2}
          >
            Temporada:
          </Typography>
          <Select
            id="season"
            defaultValue="2024"
            sx={{ border: "1px solid", borderRadius: 1, padding: "4px 8px" }}
          >
            <MenuItem value="2024">2024/2025</MenuItem>
          </Select>
        </Box>
      </Box>

      <hr className="h-px border-0 bg-gray-300 my-6" />

      {/* Main Discipline Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(165, 132, 224, 0.4)" }}>
              <TableCell sx={{ fontWeight: "bold" }}>POS</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>EQUIPA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Em Risco</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "red" }}>
                Suspensos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                J
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
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
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
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
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Outros Castigos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Pontos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Média
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplineData.map((team, index) => {
              const isExcluded = team.excluded;
              const averagePoints =
                team.matches_played > 0
                  ? (team.calculated_points / team.matches_played).toFixed(2)
                  : 0;

              return (
                <TableRow
                  key={team.team_id}
                  onClick={() => handleRowClick(team.team_id)}
                  sx={{
                    backgroundColor: isExcluded ? "#ffe6e6" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <img
                        src={team.teams.logo_url}
                        alt={team.teams.short_name}
                        style={{ width: 30, height: 30, marginRight: 8 }}
                      />
                      {team.teams.short_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "goldenrod", fontWeight: "bold" }}>
                      {team.atRiskPlayers.join(", ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {team.suspendedPlayers.join(", ")}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {isExcluded ? "-" : team.matches_played}
                  </TableCell>
                  <TableCell align="center">
                    {isExcluded ? "-" : team.yellow_cards}
                  </TableCell>
                  <TableCell align="center">
                    {isExcluded ? "-" : team.red_cards}
                  </TableCell>
                  <TableCell align="center">
                    {isExcluded ? "-" : team.other_punishments}
                  </TableCell>
                  <TableCell align="center">
                    {isExcluded ? "-" : team.calculated_points}
                  </TableCell>
                  <TableCell align="center">
                    {isExcluded ? "-" : averagePoints}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup (Modal) showing punishment events */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderRadius: 2,
            maxWidth: 900,
            margin: "auto",
            mt: "10%",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Castigos para a equipa{" "}
            {currentTeam?.teams.short_name || currentTeamId}
          </Typography>

          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  {/* "Data" column */}
                  <TableCell
                    sx={{
                      width: "10%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Data
                  </TableCell>

                  {/* "Tipo de Castigo" column */}
                  <TableCell
                    sx={{
                      width: "15%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tipo de Castigo
                  </TableCell>

                  {/* "Descrição" column (allow wrapping if you want) */}
                  <TableCell
                    sx={{
                      width: "40%",
                    }}
                  >
                    Descrição
                  </TableCell>

                  {/* "Jogador" column */}
                  <TableCell
                    sx={{
                      width: "15%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Jogador
                  </TableCell>

                  {/* "ID do Jogo" column */}
                  <TableCell
                    sx={{
                      width: "10%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ID do Jogo
                  </TableCell>

                  {/* "Quantidade" column */}
                  <TableCell
                    sx={{
                      width: "5%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Quantidade
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {punishmentEvents.map((event) => (
                  <TableRow key={event.team_punishment_id}>
                    <TableCell>
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {event.punishment_type?.description || "-"}
                    </TableCell>
                    <TableCell>{event.description || "-"}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {event.player?.name || "-"}
                    </TableCell>
                    <TableCell>{event.match_id || "-"}</TableCell>
                    <TableCell>{event.quantity ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
            Fechar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Discipline;
