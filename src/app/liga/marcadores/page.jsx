"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Typography, Grid, useMediaQuery } from "@mui/material";
import { SportsSoccer, Person, EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

// Components
import GoalscorersHeader from "../../../components/features/liga/marcadores/GoalscorersHeader";
import GoalscorersFilters from "../../../components/features/liga/marcadores/GoalscorersFilters";
import PodiumCard from "../../../components/features/liga/marcadores/PodiumCard";
import PlayerCard from "../../../components/features/liga/marcadores/PlayerCard";
import PlayerDetailsModal from "../../../components/features/liga/marcadores/PlayersDetailsModal";
import { useGoalscorersData } from "../../../hooks/liga/marcadores/useGoalscorersData";

const Goalscorers = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [viewMode, setViewMode] = useState("podium");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { goalscorers, teams, loading } = useGoalscorersData(selectedSeason);

  // Fetch seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("id, description, is_current")
        .order("id", { ascending: false });

      if (!error && data) {
        setSeasons(data);
        const currentSeason = data.find((s) => s.is_current);
        if (currentSeason) {
          setSelectedSeason(currentSeason.id);
        } else if (data.length > 0) {
          setSelectedSeason(data[0].id);
        }
      }
    };
    fetchSeasons();
  }, []);

  // Filter goalscorers
  const filteredGoalscorers = useMemo(() => {
    let filtered = goalscorers;

    if (searchTerm) {
      filtered = filtered.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (teamFilter) {
      filtered = filtered.filter((player) => player.team_name === teamFilter);
    }

    return filtered;
  }, [goalscorers, searchTerm, teamFilter]);

  if (loading && seasons.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
      >
        <SportsSoccer
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "spin 2s linear infinite",
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar marcadores...
        </Typography>
      </Box>
    );
  }

  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);
  const showPodium =
    viewMode === "podium" &&
    filteredGoalscorers.length >= 3 &&
    !searchTerm.trim() &&
    !teamFilter;

  return (
    <Box sx={{ minHeight: "100vh", paddingY: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <GoalscorersHeader
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
          isMobile={isMobile}
        />

        {/* Filters */}
        <GoalscorersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          teamFilter={teamFilter}
          onTeamFilterChange={setTeamFilter}
          teams={teams}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultsCount={filteredGoalscorers.length}
          isMobile={isMobile}
        />

        {/* Content */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="40vh"
            flexDirection="column"
            gap={2}
          >
            <SportsSoccer
              sx={{
                fontSize: 60,
                color: theme.colors.primary[600],
                animation: "spin 2s linear infinite",
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: theme.colors.text.secondary }}
            >
              A carregar marcadores...
            </Typography>
          </Box>
        ) : filteredGoalscorers.length === 0 ? (
          <Box
            textAlign="center"
            py={8}
            sx={{
              backgroundColor: theme.colors.background.card,
              borderRadius: "20px",
            }}
          >
            <Person
              sx={{ fontSize: 80, color: theme.colors.neutral[400], mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{ color: theme.colors.text.secondary }}
            >
              {searchTerm || teamFilter
                ? "Nenhum jogador encontrado"
                : `Ainda não há marcadores para a época ${currentSeasonData?.description}`}
            </Typography>
          </Box>
        ) : showPodium ? (
          <Grid container spacing={3}>
            {filteredGoalscorers.slice(0, 3).map((player, index) => (
              <Grid item xs={12} md={4} key={player.id}>
                <PodiumCard
                  player={player}
                  position={index}
                  isMobile={isMobile}
                  onPlayerClick={setSelectedPlayer}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {filteredGoalscorers.map((player, index) => (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <PlayerCard
                  player={player}
                  index={index}
                  onPlayerClick={setSelectedPlayer}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Player Details Modal */}
        <PlayerDetailsModal
          open={Boolean(selectedPlayer)}
          onClose={() => setSelectedPlayer(null)}
          player={selectedPlayer}
          seasonId={selectedSeason}
        />
      </Container>
    </Box>
  );
};

export default Goalscorers;
