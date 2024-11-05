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

  // Function to fetch and sort discipline data, including suspended players and players at risk
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

    // Fetch suspended players along with their team_id
    const { data: suspensions, error: suspensionsError } = await supabase
      .from("suspensions")
      .select(`
        player_id,
        players (name, team_id),
        active
      `)
      .eq("active", true); // Only get active suspensions

    if (suspensionsError) {
      console.error("Error fetching suspended players:", suspensionsError);
      return;
    }

    // Map suspended players by team_id for easy lookup
    const suspendedPlayersByTeam = suspensions.reduce((acc, suspension) => {
      const teamId = suspension.players.team_id; // Get team_id from the player's data
      if (!teamId) return acc; // Skip if no team_id is found
      if (!acc[teamId]) acc[teamId] = [];
      acc[teamId].push(suspension.players.name);
      return acc;
    }, {});

    // Fetch players' yellow card counts for risk assessment
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select(`
        id,
        name,
        team_id
      `);

    if (playersError) {
      console.error("Error fetching players' data:", playersError);
      return;
    }

    // Fetch match events to calculate yellow cards
    const { data: matchEvents, error: matchEventsError } = await supabase
      .from("match_events")
      .select(`
        player_id,
        event_type
      `)
      .eq("event_type", 2); // Only get yellow card events

    if (matchEventsError) {
      console.error("Error fetching match events:", matchEventsError);
      return;
    }

    // Calculate yellow card occurrences per player
    const yellowCardCounts = matchEvents.reduce((acc, event) => {
      if (!acc[event.player_id]) acc[event.player_id] = 0;
      acc[event.player_id] += 1;
      return acc;
    }, {});

    // Determine players at risk of suspension (e.g., 2, 5, 8, 11 yellow cards)
    const playersAtRisk = players.reduce((acc, player) => {
      const cards = yellowCardCounts[player.id] || 0;
      if ((cards + 1) % 3 === 0) { // Players at risk based on new criteria
        const teamId = player.team_id;
        if (!acc[teamId]) acc[teamId] = [];
        acc[teamId].push(player.name);
      }
      return acc;
    }, {});

    // Sort data, moving excluded teams to the end and appending suspended players and at-risk players
    const sortedData = data.sort((a, b) => {
      if (a.excluded && !b.excluded) return 1;
      if (!a.excluded && b.excluded) return -1;

      const averageA = a.matches_played > 0 ? a.calculated_points / a.matches_played : 0;
      const averageB = b.matches_played > 0 ? b.calculated_points / b.matches_played : 0;
      return averageA - averageB;
    }).map((team) => ({
      ...team,
      suspendedPlayers: suspendedPlayersByTeam[team.team_id] || [],
      atRiskPlayers: playersAtRisk[team.team_id] || [], // Adding at-risk players
    }));

    setDisciplineData(sortedData);
  };

  // Function to fetch punishment events for the selected team
  const fetchPunishmentEvents = async (teamId) => {
    const { data, error } = await supabase
      .from("team_punishments")
      .select(`
        id,
        team_id,
        date,
        punishment_type_id,
        punishment_type:punishment_types (points_added, description),
        match_id,
        match:matches (
          id,
          home_team_id,
          away_team_id,
          home_team:teams!matches.home_team_id_fkey (short_name, logo_url), 
          away_team:teams!matches.away_team_id_fkey (short_name, logo_url)  
        ),
        team:teams (short_name, logo_url)  
      `)
      .eq("team_id", teamId);
  
    if (error) {
      console.error("Error fetching punishment events:", error);
    } else {
      setPunishmentEvents(data);
    }
  };

  // Open punishment event modal
  const handleQuestionMarkClick = (event, teamId) => {
    event.stopPropagation();
    fetchPunishmentEvents(teamId);
    setCurrentTeamId(teamId);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    readDiscipline();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2" sx={{ color: "#6B4BA1" }}>
          DISCIPLINA
        </Typography>
        <Box>
          <Typography variant="body1" component="label" fontWeight="bold" sx={{ color: "#6B4BA1" }} mr={2}>
            Temporada:
          </Typography>
          <Select id="season" defaultValue="2024" sx={{ border: "1px solid", borderRadius: 1, padding: "4px 8px" }}>
            <MenuItem value="2024">2024/2025</MenuItem>
          </Select>
        </Box>
      </Box>

      <hr className="h-px border-0 bg-gray-300 my-6" />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(165, 132, 224, 0.4)" }}>
              <TableCell sx={{ fontWeight: "bold" }}>POS</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>EQUIPA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Em Risco</TableCell> {/* At Risk Players Column */}
              <TableCell sx={{ fontWeight: "bold", color: "red" }}>Suspensos</TableCell> {/* Suspended Players Column */}
              <TableCell sx={{ fontWeight: "bold" }} align="center">J</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                <span style={{ display: "inline-block", width: "13px", height: "20px", backgroundColor: "#ffcd00", borderRadius: "2px", verticalAlign: "middle" }}></span>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                <span style={{ display: "inline-block", width: "13px", height: "20px", backgroundColor: "red", borderRadius: "2px", verticalAlign: "middle" }}></span>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Outros Castigos</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Pontos</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Media</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplineData.map((team, index) => {
              const averagePoints = team.matches_played > 0
                ? (team.calculated_points / team.matches_played).toFixed(2)
                : 0;

              return (
                <TableRow key={team.team_id} onClick={(event) => handleQuestionMarkClick(event, team.team_id)}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <img src={team.teams.logo_url} alt={team.teams.short_name} style={{ width: 30, height: 30, marginRight: 8 }} />
                      {team.teams.short_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: "goldenrod", fontWeight: "bold" }}>{team.atRiskPlayers.join(", ")}</span>
                  </TableCell> {/* At Risk Players */}
                  <TableCell>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {team.suspendedPlayers.join(", ")}
                    </span>
                  </TableCell> {/* Suspended Players */}
                  <TableCell align="center">{team.matches_played}</TableCell>
                  <TableCell align="center">{team.yellow_cards}</TableCell>
                  <TableCell align="center">{team.red_cards}</TableCell>
                  <TableCell align="center">{team.other_punishments}</TableCell>
                  <TableCell align="center">{team.calculated_points}</TableCell>
                  <TableCell align="center">{averagePoints}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for punishment events */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, maxWidth: 600, margin: "auto", mt: "10%" }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Punishment Events</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Match</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {punishmentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.punishment_type.description}</TableCell>
                    <TableCell>{event.match.home_team.short_name} vs {event.match.away_team.short_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Discipline;
