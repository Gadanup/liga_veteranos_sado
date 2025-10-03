"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Grid } from "@mui/material";
import { theme } from "../../../styles/theme.js";

// Components
import GalleryHeader from "../../../components/features/galeria/GalleryHeader";
import SeasonSelector from "../../../components/features/galeria/SeasonSelector";
import TeamCard from "../../../components/features/galeria/TeamCard";
import ImageModal from "../../../components/features/galeria/ImageModal";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";

export default function Equipas() {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  // Fetch available seasons on mount
  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("id, description, is_current")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching seasons:", error);
      } else {
        setSeasons(data);
        // Set current season as default
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

  // Fetch teams when season changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedSeason) return;

      setLoading(true);
      const { data: teamsData, error } = await supabase
        .from("teams")
        .select("id, short_name, logo_url, roster_url, excluded, season")
        .eq("season", selectedSeason)
        .order("short_name", { ascending: true });

      if (error) {
        console.error("Error fetching teams:", error);
      } else {
        setTeams(teamsData.filter((team) => !team.excluded));
      }
      setLoading(false);
    };

    fetchTeams();
  }, [selectedSeason]);

  const handleImageClick = (imageUrl, teamName) => {
    setSelectedImage(imageUrl);
    setSelectedTeamName(teamName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setSelectedTeamName("");
  };

  if (loading && seasons.length === 0) {
    return <LoadingSkeleton message="A carregar equipas..." />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: theme.spacing.lg,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Season Selector */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <GalleryHeader teamsCount={teams.length} />
          <SeasonSelector
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
          />
        </Box>

        {/* Teams Grid */}
        {loading ? (
          <LoadingSkeleton message="A carregar equipas..." />
        ) : teams.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: theme.spacing["2xl"],
              backgroundColor: theme.colors.background.card,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.shadows.lg,
            }}
          >
            <p
              style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
              }}
            >
              Nenhuma equipa encontrada para esta época
            </p>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {teams.map((team, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={team.id}>
                <TeamCard
                  team={team}
                  index={index}
                  onImageClick={handleImageClick}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Image Modal */}
      <ImageModal
        open={modalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImage}
        teamName={selectedTeamName}
      />
    </Box>
  );
}
