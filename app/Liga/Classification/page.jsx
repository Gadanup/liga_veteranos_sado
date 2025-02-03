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
  Select,
  MenuItem,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Classification = () => {
  const [classification, setClassification] = useState([]);
  const router = useRouter(); // Initialize the router
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screens

  // Function to fetch and sort classification data
  const readClassification = async () => {
    const { data: classificationData, error } = await supabase.from(
      "league_standings"
    ).select(`
        team_id, 
        teams!league_standings_team_id_fkey (short_name, logo_url, excluded),
        matches_played,
        wins,
        draws,
        losses,
        goals_for,
        goals_against,
        points
      `);

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      // Sort the classification
      const sortedData = classificationData.sort((a, b) => {
        // Always move excluded teams to the bottom
        if (a.teams.excluded && !b.teams.excluded) return 1;
        if (!a.teams.excluded && b.teams.excluded) return -1;

        // Sorting logic for non-excluded teams
        const goalDifferenceA = a.goals_for - a.goals_against;
        const goalDifferenceB = b.goals_for - b.goals_against;

        if (a.points !== b.points) {
          return b.points - a.points; // Higher points first
        } else if (goalDifferenceA !== goalDifferenceB) {
          return goalDifferenceB - goalDifferenceA; // Higher goal diff first
        } else {
          return b.goals_for - a.goals_for; // Higher goals scored first
        }
      });

      setClassification(sortedData);
    }
  };

 
  useEffect(() => {
    readClassification();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(165, 132, 224, 0.4)" }}>
              <TableCell sx={{ fontWeight: "bold", width: "5%" }}>POS</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>EQUIPA</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">J</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">V</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">E</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">D</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">G</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">DG</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">P</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classification.map((team, index) => (
              <TableRow
                key={team.team_id}
                onClick={() => router.push(`/equipas/${team.teams.short_name}`)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(165, 132, 224, 0.2)" },
                  backgroundColor: team.teams.excluded
                    ? "rgba(255, 0, 0, 0.1)" // Light transparent red
                    : index % 2 !== 0
                    ? "rgba(165, 132, 224, 0.1)"
                    : "inherit",
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={team.teams.logo_url}
                      alt={`${team.teams.short_name} logo`}
                      style={{
                        width: isMobile ? "30px" : "40px",
                        height: isMobile ? "30px" : "40px",
                        objectFit: "contain",
                        marginRight: "8px",
                      }}
                    />
                    <Typography variant={isMobile ? "body2" : "body1"}>
                      {team.teams.short_name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{team.teams.excluded ? "-" : team.matches_played}</TableCell>
                <TableCell align="center">{team.teams.excluded ? "-" : team.wins}</TableCell>
                <TableCell align="center">{team.teams.excluded ? "-" : team.draws}</TableCell>
                <TableCell align="center">{team.teams.excluded ? "-" : team.losses}</TableCell>
                <TableCell align="center">
                  {team.teams.excluded ? "-" : `${team.goals_for}:${team.goals_against}`}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: "bold",
                    color: team.teams.excluded
                      ? "gray"
                      : team.goals_for - team.goals_against > 0
                      ? "green"
                      : team.goals_for - team.goals_against < 0
                      ? "red"
                      : "gray",
                  }}
                >
                  {team.teams.excluded ? "-" : team.goals_for - team.goals_against}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: "bold",
                    color: team.teams.excluded ? "gray" : "primary",
                  }}
                >
                  {team.teams.excluded ? "-" : team.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default Classification;
