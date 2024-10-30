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
} from "@mui/material";

const Discipline = () => {
  const [disciplineData, setDisciplineData] = useState([]);
  const router = useRouter();

  // Function to fetch and sort discipline data
  const readDiscipline = async () => {
    const { data, error } = await supabase.from("discipline_standings").select(`
      team_id,
      teams!discipline_standings_team_id_fkey (short_name, logo_url),
      matches_played,
      yellow_cards,
      red_cards,
      points
    `);

    if (error) {
      console.error("Error fetching discipline data:", error);
    } else {
      // Sort by points and then yellow cards (ascending order for fewer cards)
      const sortedData = data.sort((a, b) => {
        if (a.points !== b.points) {
          return b.points - a.points; // Sort by points (descending)
        } else if (a.yellow_cards !== b.yellow_cards) {
          return b.yellow_cards - a.yellow_cards; // Sort by yellow cards (ascending)
        } else {
          return b.red_cards - a.red_cards; // Sort by red cards (ascending)
        }
      });

      setDisciplineData(sortedData);
    }
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
                P
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplineData.map((team, index) => (
              <TableRow
                key={team.team_id}
                onClick={() => router.push(`/equipas/${team.teams.short_name}`)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(165, 132, 224, 0.2)" },
                  backgroundColor:
                    index % 2 !== 0 ? "rgba(165, 132, 224, 0.1)" : "inherit",
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
                <TableCell align="center">{team.matches_played}</TableCell>
                <TableCell align="center">{team.yellow_cards}</TableCell>
                <TableCell align="center">{team.red_cards}</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {team.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Discipline;
