"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Box, Typography, Avatar, CircularProgress, Divider } from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'; // Import a soccer icon for the title

const Goalscorers = () => {
  const [goalscorers, setGoalscorers] = useState([]); // Store goalscorers data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchGoalscorers(); // Fetch goalscorers when the component loads
  }, []);

  // Fetch goalscorers based on competition type and season
  const fetchGoalscorers = async () => {
    setLoading(true);

    // Fetch matches for League competition and season 2024
    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("id")
      .eq("competition_type", "League") // Filter for League competition
      .eq("season", "2024"); // Filter for season 2024

    if (matchesError) {
      console.error("Error fetching matches:", matchesError);
      setLoading(false);
      return;
    }

    // Fetch match events (goals)
    const matchIds = matches.map((match) => match.id);
    const { data: matchEvents, error: eventsError } = await supabase
      .from("match_events")
      .select("player_id")
      .in("match_id", matchIds) // Use the match IDs fetched
      .eq("event_type", 1);

    if (eventsError) {
      console.error("Error fetching match events:", eventsError);
      setLoading(false);
      return;
    }

    // Count goals for each player
    const goalsCount = matchEvents.reduce((acc, event) => {
      acc[event.player_id] = (acc[event.player_id] || 0) + 1;
      return acc;
    }, {});

    // Fetch player details along with team_id
    const playerIds = Object.keys(goalsCount);
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name, photo_url, team_id") // Fetch team_id as well
      .in("id", playerIds);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      setLoading(false);
      return;
    }

    // Fetch team details using the team_id from the players
    const teamIds = players.map((player) => player.team_id);
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id, short_name, logo_url")
      .in("id", teamIds);

    if (teamsError) {
      console.error("Error fetching teams:", teamsError);
      setLoading(false);
      return;
    }

    // Combine goals count, player details, and team details
    const goalscorersData = players.map((player) => {
      const team = teams.find((team) => team.id === player.team_id);
      return {
        ...player,
        goals: goalsCount[player.id] || 0,
        team_name: team ? team.short_name : "Unknown Team",
        team_logo_url: team ? team.logo_url : null,
      };
    });

    // Sort by goals in descending order
    const sortedGoalscorers = goalscorersData.sort((a, b) => b.goals - a.goals);

    setGoalscorers(sortedGoalscorers);
    setLoading(false);
  };

  // Group players by their goal count
  const groupByGoals = (players) => {
    const grouped = players.reduce((acc, player) => {
      acc[player.goals] = acc[player.goals] || [];
      acc[player.goals].push(player);
      return acc;
    }, {});
    
    // Sort the group keys (number of goals) in descending order
    return Object.keys(grouped).sort((a, b) => b - a).map((goals) => ({
      goals: Number(goals),
      players: grouped[goals],
    }));
  };

  return (
    <Box sx={{ padding: "1.5rem 1rem", textAlign: "center" }}>
      {/* Page Title with Golden Boot Icon */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "3rem", // Reduced space between title and players
          letterSpacing: "0.1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#d4af37",
        }}
      >
        <SportsSoccerIcon
          sx={{ marginRight: "0.5rem", fontSize: "2rem", color: "#d4af37" }}
        />
        Melhores Marcadores
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Highlight Top 3 Goalscorers */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center", mb: 6 }}>
            {/* First Goalscorer */}
            {goalscorers[0] && (
              <Box sx={{ textAlign: "center", maxWidth: "250px", position: "relative" }}>
                <Avatar
                  alt={goalscorers[0].name}
                  src={goalscorers[0].photo_url}
                  sx={{
                    width: 140,
                    height: 140,
                    margin: "0 auto",
                    border: "4px solid #ffd700",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 500, marginTop: 2 }}>{goalscorers[0].name}</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 1 }}>
                  {goalscorers[0].team_logo_url && (
                    <Avatar
                      alt={goalscorers[0].team_name}
                      src={goalscorers[0].team_logo_url}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    {goalscorers[0].team_name}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: "0.5rem", color: "#000" }}>
                  {goalscorers[0].goals} {goalscorers[0].goals === 1 ? "Golo" : "Golos"}
                </Typography>
              </Box>
            )}

            {/* Second Goalscorer */}
            {goalscorers[1] && (
              <Box sx={{ textAlign: "center", maxWidth: "210px", position: "relative" }}>
                <Avatar
                  alt={goalscorers[1].name}
                  src={goalscorers[1].photo_url}
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    border: "4px solid #c0c0c0",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 500, marginTop: 2 }}>{goalscorers[1].name}</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 1 }}>
                  {goalscorers[1].team_logo_url && (
                    <Avatar
                      alt={goalscorers[1].team_name}
                      src={goalscorers[1].team_logo_url}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    {goalscorers[1].team_name}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: "0.5rem", color: "#000" }}>
                  {goalscorers[1].goals} {goalscorers[1].goals === 1 ? "Golo" : "Golos"}
                </Typography>
              </Box>
            )}

            {/* Third Goalscorer */}
            {goalscorers[2] && (
              <Box sx={{ textAlign: "center", maxWidth: "190px", position: "relative" }}>
                <Avatar
                  alt={goalscorers[2].name}
                  src={goalscorers[2].photo_url}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    border: "4px solid #cd7f32",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 500, marginTop: 2 }}>{goalscorers[2].name}</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 1 }}>
                  {goalscorers[2].team_logo_url && (
                    <Avatar
                      alt={goalscorers[2].team_name}
                      src={goalscorers[2].team_logo_url}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    {goalscorers[2].team_name}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: "0.5rem", color: "#000" }}>
                  {goalscorers[2].goals} {goalscorers[2].goals === 1 ? "Golo" : "Golos"}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ marginBottom: "2rem" }} />

          {/* Group remaining goalscorers by goal count */}
          <Box sx={{ marginTop: "2rem" }}>
            {groupByGoals(goalscorers.slice(3)).map((group) => (
              <Box key={group.goals} sx={{ marginBottom: "2rem" }}>
                <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                  {group.goals} {group.goals === 1 ? "Golo" : "Golos"}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
                  {group.players.map((scorer) => (
                    <Box
                      key={scorer.id}
                      sx={{
                        textAlign: "center",
                        maxWidth: "140px",
                        marginBottom: "1rem",
                      }}
                    >
                      <Avatar
                        alt={scorer.name}
                        src={scorer.photo_url}
                        sx={{
                          width: 80,
                          height: 80,
                          margin: "0 auto",
                          border: "3px solid #e0e0e0",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 500, marginTop: "0.5rem" }}>
                        {scorer.name}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 0.5 }}>
                        {scorer.team_logo_url && (
                          <Avatar
                            alt={scorer.team_name}
                            src={scorer.team_logo_url}
                            sx={{ width: 20, height: 20 }}
                          />
                        )}
                        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                          {scorer.team_name}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Goalscorers;
