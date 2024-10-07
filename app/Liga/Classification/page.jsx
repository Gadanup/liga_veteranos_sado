"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography, Box
} from '@mui/material';

const Classification = () => {
  const [classification, setClassification] = useState([]);

  // Function to fetch and sort classification data
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
      // Sort by points, goal difference, and goals scored
      const sortedData = classificationData.sort((a, b) => {
        const goalDifferenceA = a.goals_for - a.goals_against;
        const goalDifferenceB = b.goals_for - b.goals_against;

        if (a.points !== b.points) {
          return b.points - a.points; // Sort by points (descending)
        } else if (goalDifferenceA !== goalDifferenceB) {
          return goalDifferenceB - goalDifferenceA; // Sort by goal difference (descending)
        } else {
          return b.goals_for - a.goals_for; // Sort by goals scored (descending)
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2" sx={{color:'#6B4BA1'}}>CLASSIFICAÇÃO</Typography>
        <Box>
          {/* <Typography variant="body1" component="label" fontWeight="bold" color="primary" mr={2}>Temporada:</Typography> */}
          <Typography  variant="body1" component="label" fontWeight="bold" sx={{color:'#6B4BA1'}} mr={2}>Temporada:</Typography>
          <Select
            id="season"
            defaultValue="2024"
            sx={{ border: '1px solid', borderRadius: 1, padding: '4px 8px' }}
          >
            <MenuItem value="2024">2024/2025</MenuItem>
          </Select>
        </Box>
      </Box>

      <hr className="h-px border-0 bg-gray-300 my-6" />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(165, 132, 224, 0.4)' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>POS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>EQUIPA</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">J</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">V</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">E</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">D</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">G</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">DG</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">P</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classification.map((team, index) => (
              <TableRow key={team.team_id} sx={{ backgroundColor: index % 2 !== 0 ? 'rgba(165, 132, 224, 0.1)' : 'inherit' }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={team.teams.logo_url}
                      alt={`${team.teams.short_name} logo`}
                      style={{
                        width: "40px",  // Set fixed width to 40px
                        height: "40px", // Set fixed height to 40px
                        objectFit: "contain", // Ensure the image scales correctly
                        marginRight: "8px"  // Add margin between logo and team name
                      }}
                    />
                    {team.teams.short_name}
                  </Box>
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
