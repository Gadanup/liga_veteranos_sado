"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Typography, Grid, useMediaQuery } from "@mui/material";
import { Shield } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

// Components
import DisciplineHeader from "../../../components/features/liga/disciplina/DisciplineHeader";
import DisciplineCard from "../../../components/features/liga/disciplina/DisciplineCard";
import EnhancedDisciplineModal from "../../../components/features/liga/disciplina/EnhancedDisciplineModal";
import { useDisciplineData } from "../../../hooks/liga/disciplina/useDisciplineData";

const Discipline = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [punishmentEvents, setPunishmentEvents] = useState([]);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { disciplineData, loading } = useDisciplineData(selectedSeason);

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

  const fetchPunishmentEvents = async (teamId) => {
    const { data, error } = await supabase
      .from("team_punishments")
      .select(
        `
        team_punishment_id, event_date, description, quantity, team_id,
        match_id, punishment_type_id, season, player_id,
        team:teams (id, short_name, logo_url),
        punishment_type:punishment_types (punishment_type_id, description, points_added),
        match:matches (id, home_team_id, away_team_id),
        season_table:seasons (id),
        player:players (id, name)
      `
      )
      .eq("team_id", teamId)
      .eq("season", selectedSeason)
      .order("event_date", { ascending: false });

    if (!error) {
      setPunishmentEvents(data ?? []);
    }
  };

  const handleRowClick = async (teamId) => {
    setCurrentTeamId(teamId);
    await fetchPunishmentEvents(teamId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPunishmentEvents([]);
  };

  const handleDataUpdate = async () => {
    // Refetch discipline data after changes
    await fetchPunishmentEvents(currentTeamId);
    // This will trigger a re-render of the discipline data
    window.location.reload(); // Simple solution, or you can implement a more elegant refresh
  };

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
        <Shield
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.5 },
              "100%": { opacity: 1 },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar dados disciplinares...
        </Typography>
      </Box>
    );
  }

  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);
  const currentTeam = disciplineData.find(
    (team) => team.team_id === currentTeamId
  );

  return (
    <Box sx={{ minHeight: "100vh", paddingY: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <DisciplineHeader
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={setSelectedSeason}
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
            <Shield
              sx={{
                fontSize: 60,
                color: theme.colors.primary[600],
                animation: "pulse 2s infinite",
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: theme.colors.text.secondary }}
            >
              A carregar dados disciplinares...
            </Typography>
          </Box>
        ) : disciplineData.length === 0 ? (
          <Box
            textAlign="center"
            py={8}
            sx={{
              backgroundColor: theme.colors.background.card,
              borderRadius: "20px",
            }}
          >
            <Shield
              sx={{ fontSize: 80, color: theme.colors.neutral[400], mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{ color: theme.colors.text.secondary }}
            >
              Ainda não há dados disciplinares para a época{" "}
              {currentSeasonData?.description}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {disciplineData.map((team, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={team.team_id}
                sx={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <DisciplineCard
                  team={team}
                  position={index + 1}
                  onClick={() => handleRowClick(team.team_id)}
                  isMobile={isMobile}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Enhanced Discipline Modal */}
      <EnhancedDisciplineModal
        open={open}
        onClose={handleClose}
        currentTeam={currentTeam}
        punishmentEvents={punishmentEvents}
        isMobile={isMobile}
        selectedSeason={selectedSeason}
        onDataUpdate={handleDataUpdate}
      />
    </Box>
  );
};

export default Discipline;
