"use client"
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography, Box
} from '@mui/material';

const Classification = () => {
  const [classification, setClassification] = useState([]);

  const readClassification = async () => {
    const { data: classificationData, error } = await supabase
      .from("league_standings")
      .select(`
        team_id, 
        teams!league_standings_team_id_fkey (short_name, logo_url),
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
      setClassification(classificationData);
    }
  };

  useEffect(() => {
    readClassification();
  }, []);

  return (
    <Box className="max-w-6xl" sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2" color="primary">Classificação</Typography>
        <Box>
          <Typography variant="body1" component="label" fontWeight="bold" color="primary" mr={2}>Temporada:</Typography>
          <Select
            id="season"
            defaultValue="2023/2024"
            sx={{ border: '1px solid', borderRadius: 1, padding: '4px 8px' }}
          >
            <MenuItem value="2023/2024">2023/2024</MenuItem>
            <MenuItem value="2022/2023">2022/2023</MenuItem>
          </Select>
        </Box>
      </Box>

      <hr className="h-px border-0 bg-gray-300 my-6" />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>POS</TableCell>
              <TableCell>EQUIPA</TableCell>
              <TableCell align="center">J</TableCell>
              <TableCell align="center">V</TableCell>
              <TableCell align="center">E</TableCell>
              <TableCell align="center">D</TableCell>
              <TableCell align="center">G</TableCell>
              <TableCell align="center">DG</TableCell>
              <TableCell align="center">P</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classification.map((team, index) => (
              <TableRow key={team.team_id} className={index % 2 === 0 ? "even:bg-gray-200" : ""}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img src={team.teams.logo_url} alt={`${team.teams.short_name} logo`} className="w-10 h-10 inline-block mr-2" />
                  {team.teams.short_name}
                </TableCell>
                <TableCell align="center">{team.matches_played}</TableCell>
                <TableCell align="center">{team.wins}</TableCell>
                <TableCell align="center">{team.draws}</TableCell>
                <TableCell align="center">{team.losses}</TableCell>
                <TableCell align="center">{team.goals_for}:{team.goals_against}</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: team.goals_for - team.goals_against > 0 ? 'green' : team.goals_for - team.goals_against < 0 ? 'red' : 'gray' }}>
                  {team.goals_for - team.goals_against}
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold', color: 'primary' }}>
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

export default Classification;
