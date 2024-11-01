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

  // Function to fetch and sort discipline data
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
    } else {
      // Sort data, moving excluded teams to the end
      const sortedData = data.sort((a, b) => {
        if (a.excluded && !b.excluded) return 1; // Move excluded teams to the end
        if (!a.excluded && b.excluded) return -1; // Keep non-excluded teams first

        // Calculate average points for non-excluded teams for sorting
        const averageA = a.matches_played > 0 ? a.calculated_points / a.matches_played : 0;
        const averageB = b.matches_played > 0 ? b.calculated_points / b.matches_played : 0;
        return averageA - averageB; // Sort by average points (ascending)
      });

      setDisciplineData(sortedData);
    }
  };

  // Function to fetch punishment events for the selected team
  const fetchPunishmentEvents = async (teamId) => {
    const { data, error } = await supabase
      .from("team_punishments")
      .select(`*, punishment_type!punishment_type_id_fkey(points_added)`)
      .eq("team_id", teamId);

    if (error) {
      console.error("Error fetching punishment events:", error);
    } else {
      setPunishmentEvents(data);
    }
  };

  // Function to handle question mark click
  const handleQuestionMarkClick = (teamId) => {
    fetchPunishmentEvents(teamId); // Fetch punishment events for the clicked team
    setCurrentTeamId(teamId); // Set the current team ID
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(165, 132, 224, 0.4)" }}>
              <TableCell sx={{ fontWeight: "bold" }}>POS</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>EQUIPA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">J</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                <span style={{
                  display: "inline-block",
                  width: "13px",
                  height: "20px",
                  backgroundColor: "#ffcd00",
                  borderRadius: "2px",
                  verticalAlign: "middle",
                }}></span>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                <span style={{
                  display: "inline-block",
                  width: "13px",
                  height: "20px",
                  backgroundColor: "red",
                  borderRadius: "2px",
                  verticalAlign: "middle",
                }}></span>
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

              const isExcluded = team.excluded;
              const rowStyle = isExcluded
                ? { backgroundColor: "rgba(255, 0, 0, 0.2)" } // Highlight excluded teams
                : {};

              return (
                <TableRow
                  key={team.team_id}
                  onClick={() => router.push(`/equipas/${team.teams.short_name}`)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(165, 132, 224, 0.2)" },
                    ...rowStyle, // Apply the row style conditionally
                    backgroundColor: index % 2 !== 0 && !isExcluded ? "rgba(165, 132, 224, 0.1)" : "inherit",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={team.teams.logo_url}
                        alt={`${team.teams.short_name} logo`}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "contain",
                          marginRight: "8px",
                        }}
                      />
                      {team.teams.short_name}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{isExcluded ? '-' : team.matches_played}</TableCell>
                  <TableCell align="center">{isExcluded ? '-' : team.yellow_cards}</TableCell>
                  <TableCell align="center">{isExcluded ? '-' : team.red_cards}</TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    {isExcluded ? '-' : (
                      team.other_punishments > 0 ? (
                        <span>
                          {team.other_punishments}{" "}
                          <span
                            role="button"
                            onClick={() => handleQuestionMarkClick(team.team_id)}
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                          >
                            ?
                          </span>
                        </span>
                      ) : (
                        team.other_punishments
                      )
                    )}
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    {isExcluded ? '-' : team.calculated_points}
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    {isExcluded ? '-' : averagePoints}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for punishment events */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Punishment Events for Team ID: {currentTeamId}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Points Added</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {punishmentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.punishment_type.description}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.punishment_type.points_added}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleClose} color="primary" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Discipline;
