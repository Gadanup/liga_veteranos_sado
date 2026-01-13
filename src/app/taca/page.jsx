"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Box, Container, Typography } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { theme } from "../../styles/theme.js";

// Import view components
import LeagueCupView from "../../components/features/taca/LeagueCupView";
import KnockoutCupView from "../../components/features/taca/KnockoutCupView";
import SeasonSelector from "../../components/features/taca/shared/SeasonSelector";
import { useMediaQuery } from "@mui/material";

/**
 * Main Cup Page Component
 * Phase 4 - UPDATED: Season selector at main page level
 *
 * Features:
 * - Season selector at top (shows ALL seasons)
 * - Automatically switches between LeagueCupView and KnockoutCupView
 * - Based on selected season's cup_group_stage value
 */
const CupPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch all seasons on mount
  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch ALL seasons (matching calendario page query)
        const { data: seasonsData, error: seasonsError } = await supabase
          .from("seasons")
          .select("id, description, is_current, cup_group_stage")
          .order("id", { ascending: false });

        if (seasonsError) {
          console.error("Supabase error:", seasonsError);
          throw seasonsError;
        }

        if (!seasonsData || seasonsData.length === 0) {
          throw new Error("No seasons found");
        }

        setSeasons(seasonsData);

        // Set initial season (current or first)
        const current = seasonsData.find((s) => s.is_current);
        const initialSeason = current || seasonsData[0];

        if (initialSeason) {
          setSelectedSeason(initialSeason.id);
          setCurrentSeason(initialSeason);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
        setError("Erro ao carregar épocas");
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  // Update current season when selection changes
  const handleSeasonChange = (newSeasonId) => {
    const season = seasons.find((s) => s.id === newSeasonId);
    if (season) {
      setSelectedSeason(newSeasonId);
      setCurrentSeason(season);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
        sx={{ backgroundColor: theme.colors.background.secondary }}
      >
        <EmojiEvents
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
              "40%": { transform: "translateY(-10px)" },
              "60%": { transform: "translateY(-5px)" },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar Taça...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error || !currentSeason) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
      >
        <EmojiEvents sx={{ fontSize: 60, color: theme.colors.neutral[400] }} />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          {error || "Nenhuma época encontrada"}
        </Typography>
      </Box>
    );
  }

  // Determine which view to show based on selected season's cup_group_stage
  const isLeagueCupMode = currentSeason.cup_group_stage === true;

  return (
    <Box sx={{ minHeight: "100vh", paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* Main Header with Season Selector */}
        <Box
          sx={{
            marginBottom: theme.spacing.xl,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            gap: theme.spacing.lg,
          }}
        >
          {/* Title Section */}
          <Box sx={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: isMobile
                  ? theme.typography.fontSize["2xl"]
                  : theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.primary[600],
                margin: 0,
                marginBottom: theme.spacing.sm,
                fontFamily: theme.typography.fontFamily.primary,
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              🏆 Taça {currentSeason?.cup_group_stage ? "da Liga" : ""}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {isLeagueCupMode
                ? "Fase de Grupos + Final Four"
                : "Eliminatórias"}
            </Typography>
          </Box>

          {/* Season Selector */}
          <Box
            sx={{
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-end",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <SeasonSelector
              seasons={seasons}
              selectedSeason={selectedSeason}
              onSeasonChange={handleSeasonChange}
              showLabel={true}
            />
          </Box>
        </Box>

        {/* Conditional View Rendering */}
        {isLeagueCupMode ? (
          <LeagueCupView currentSeason={currentSeason} hideHeader={true} />
        ) : (
          <KnockoutCupView currentSeason={currentSeason} hideHeader={true} />
        )}
      </Container>
    </Box>
  );
};

export default CupPage;
