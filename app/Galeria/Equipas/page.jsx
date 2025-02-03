"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  Avatar,
  Box,
} from "@mui/material";

export default function Equipas() {
  const [teams, setTeams] = useState([]);

  // Function to fetch teams from the Supabase "teams" table
  const fetchTeams = async () => {
    const { data: teamsData, error } = await supabase
      .from("teams")
      .select("id, short_name, logo_url, roster_url, excluded") 
      .order("short_name", { ascending: true });

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      setTeams(teamsData.filter((team) => !team.excluded));
    }
  };

  // Use effect to fetch teams data on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#6B4BA1" }}
        gutterBottom
      >
        EQUIPAS
      </Typography>
      <Grid container spacing={4}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// TeamCard Component to display each team's logo, name, and roster image
function TeamCard({ team }) {
  return (
    <Card sx={{ maxWidth: 345, margin: "auto", boxShadow: 3 }}>
      <CardContent
        sx={{ paddingBottom: 1, backgroundColor: "rgba(165, 132, 224, 0.4)" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={team.logo_url}
            alt={`${team.short_name} logo`}
            className="w-10 h-10 inline-block mr-2"
          />
          <Typography variant="h6" component="div">
            <strong>{team.short_name}</strong>
          </Typography>
        </Box>
      </CardContent>
      <CardMedia
        component="img"
        height="200"
        image={team.roster_url}
        alt={`${team.short_name} roster`}
        sx={{ objectFit: "cover" }}
      />
    </Card>
  );
}
