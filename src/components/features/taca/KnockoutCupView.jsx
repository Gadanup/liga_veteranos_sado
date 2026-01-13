"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";
import { supabase } from "../../../lib/supabase";
import dayjs from "dayjs";

// Existing knockout components
import CupHeader from "../../../components/features/taca/sorteio/CupHeader";
import CupBracket from "../../../components/features/taca/sorteio/CupBracket";
import CupMobileView from "../../../components/features/taca/sorteio/CupMobileView";
import CupNote from "../../../components/features/taca/sorteio/CupNote";

// Shared components
import SeasonSelector from "../../../components/features/taca/shared/SeasonSelector";

/**
 * KnockoutCupView Component
 * Phase 4.3: Traditional knockout cup view (no group stage)
 *
 * Features:
 * - Season selector
 * - Traditional bracket (Round of 16/8, Quarters, Semis, Final)
 * - Desktop bracket view
 * - Mobile list view
 */
const KnockoutCupView = ({
  currentSeason: initialSeason,
  hideHeader = false,
}) => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(
    initialSeason?.id || null
  );
  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [matches, setMatches] = useState({
    round8: [],
    round4: [],
    round2: [],
    final: [],
  });
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Placeholder rounds
  const placeholderRounds = {
    round8: Array(8).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    round4: Array(4).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    round2: Array(2).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    final: [
      {
        id: "TBD",
        stadium: "TBD",
        sides: [
          { team: { name: "TBD", logo: null }, score: null },
          { team: { name: "TBD", logo: null }, score: null },
        ],
      },
    ],
  };

  // Fetch all seasons for season selector
  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select(
          "id, description, start_year, end_year, is_current, cup_group_stage"
        )
        .eq("cup_group_stage", false) // Only show Knockout Cup seasons
        .order("id", { ascending: false });

      if (!error && data) {
        setSeasons(data);

        // If no season selected, use current or first
        if (!selectedSeason) {
          const current = data.find((s) => s.is_current);
          const seasonToUse = current || data[0];
          if (seasonToUse) {
            setSelectedSeason(seasonToUse.id);
            setCurrentSeason(seasonToUse);
          }
        }
      }
    };

    fetchSeasons();
  }, []);

  // Fetch matches when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchCupMatches(selectedSeason);
    }
  }, [selectedSeason]);

  const fetchMatchesByRound = async (round, seasonId) => {
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        id, home_goals, away_goals, home_penalties, away_penalties,
        match_date, match_time,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "Cup")
      .eq("season", seasonId)
      .eq("round", round)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return data || [];
  };

  const fetchCupMatches = async (seasonId) => {
    setLoading(true);

    try {
      const [round8, round4, round2, final] = await Promise.all([
        fetchMatchesByRound("8", seasonId),
        fetchMatchesByRound("4", seasonId),
        fetchMatchesByRound("2", seasonId),
        fetchMatchesByRound("1", seasonId),
      ]);

      setMatches({
        round8: round8.length ? round8 : placeholderRounds.round8,
        round4: round4.length ? round4 : placeholderRounds.round4,
        round2: round2.length ? round2 : placeholderRounds.round2,
        final: final.length ? final : placeholderRounds.final,
      });
    } catch (error) {
      console.error("Error fetching cup matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMatches = (matches) => {
    return matches.map((match) => ({
      id: match.id,
      date: match.match_date
        ? dayjs(match.match_date).format("DD/MM/YYYY")
        : "TBD",
      time: match.match_time,
      stadium: match.home_team?.stadium_name || "TBD",
      sides: [
        {
          team: {
            name: match.home_team ? match.home_team.short_name : "TBD",
            logo: match.home_team ? match.home_team.logo_url : null,
          },
          score:
            match.home_goals !== null && match.home_goals !== undefined
              ? `${match.home_goals}${match.home_penalties ? ` (${match.home_penalties})` : ""}`
              : "---",
          winner:
            match.home_goals > match.away_goals ||
            (match.home_goals === match.away_goals &&
              match.home_penalties > match.away_penalties),
        },
        {
          team: {
            name: match.away_team ? match.away_team.short_name : "TBD",
            logo: match.away_team ? match.away_team.logo_url : null,
          },
          score:
            match.away_goals !== null && match.away_goals !== undefined
              ? `${match.away_goals}${match.away_penalties ? ` (${match.away_penalties})` : ""}`
              : "---",
          winner:
            match.away_goals > match.home_goals ||
            (match.away_goals === match.home_goals &&
              match.away_penalties > match.home_penalties),
        },
      ],
    }));
  };

  const handleSeasonChange = (newSeasonId) => {
    setSelectedSeason(newSeasonId);
    const season = seasons.find((s) => s.id === newSeasonId);
    setCurrentSeason(season);
  };

  // Prepare bracket data
  const bracketData = {
    round8: formatMatches(matches.round8),
    round4: formatMatches(matches.round4),
    round2: formatMatches(matches.round2),
    final: formatMatches(matches.final),
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
          A carregar eliminatórias da taça...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", paddingY: hideHeader ? 0 : 3 }}>
      <Container maxWidth="xl">
        {/* Header with Season Selector */}
        {!hideHeader && (
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              marginBottom: 3,
              gap: 2,
            }}
          >
            {/* Cup Header (existing) */}
            <Box sx={{ flex: 1 }}>
              <CupHeader />
            </Box>

            {/* Season Selector */}
            {seasons.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: isMobile ? "flex-start" : "flex-end",
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
            )}
          </Box>
        )}

        {/* Bracket Content */}
        {isMobile ? (
          <CupMobileView bracketData={bracketData} />
        ) : (
          <CupBracket bracketData={bracketData} isMobile={isMobile} />
        )}

        {/* Note */}
        <CupNote />
      </Container>
    </Box>
  );
};

export default KnockoutCupView;
