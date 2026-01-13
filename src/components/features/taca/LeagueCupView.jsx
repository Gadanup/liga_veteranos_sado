"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { EmojiEvents, Groups as GroupsIcon, Star } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";
import { supabase } from "../../../lib/supabase";

// Phase 2 Components - Group Stage
import GroupTabs from "../../../components/features/taca/groups/GroupTabs";
import GroupStandingsTable from "../../../components/features/taca/groups/GroupStandingsTable";
import GroupMatchList from "../../../components/features/taca/groups/GroupMatchList";

// Phase 2 Components - Final Four
import FinalFourBracket from "../../../components/features/taca/finalfour/FinalFourBracket";
import FinalFourMobile from "../../../components/features/taca/finalfour/FinalFourMobile";

// Phase 2 Components - Shared
import SeasonSelector from "../../../components/features/taca/shared/SeasonSelector";

/**
 * LeagueCupView Component
 * Phase 4.2: Main view for League Cup format (Groups + Final Four)
 *
 * Features:
 * - Season selector
 * - Two main tabs: "Grupos" and "Fase Final"
 * - Groups tab: Shows group standings and matches
 * - Final Four tab: Shows semifinals and final
 */
const LeagueCupView = ({
  currentSeason: initialSeason,
  hideHeader = false,
}) => {
  const [mainTab, setMainTab] = useState(0); // 0 = Grupos, 1 = Fase Final
  const [selectedGroup, setSelectedGroup] = useState("A"); // A, B, or C
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(
    initialSeason?.id || null
  );
  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [groupStandings, setGroupStandings] = useState({});
  const [groupMatches, setGroupMatches] = useState({});
  const [finalFourMatches, setFinalFourMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch all seasons for season selector
  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select(
          "id, description, start_year, end_year, is_current, cup_group_stage"
        )
        .eq("cup_group_stage", true) // Only show League Cup seasons
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

  // Fetch data when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchLeagueCupData(selectedSeason);
    }
  }, [selectedSeason]);

  const fetchLeagueCupData = async (seasonId) => {
    setLoading(true);

    try {
      // Fetch group standings
      const { data: standings, error: standingsError } = await supabase
        .from("cup_group_standings")
        .select("*")
        .eq("season", seasonId)
        .order("group_name", { ascending: true })
        .order("points", { ascending: false })
        .order("goal_difference", { ascending: false })
        .order("goals_for", { ascending: false });

      if (!standingsError && standings) {
        // Transform standings to match expected format and group by group name
        const transformedStandings = standings.map((team) => ({
          team_id: team.team_id,
          team_name: team.team_name,
          logo_url: team.logo_url,
          group_name: team.group_name,
          matches_played: team.matches_played,
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          goals_for: team.goals_for,
          goals_against: team.goals_against,
          goal_difference: team.goal_difference,
          points: team.points,
        }));

        const grouped = transformedStandings.reduce((acc, team) => {
          const group = team.group_name;
          if (!acc[group]) acc[group] = [];
          acc[group].push(team);
          return acc;
        }, {});

        setGroupStandings(grouped);
      }

      // Fetch group stage matches
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select(
          `
          id, match_date, match_time, week, home_goals, away_goals,
          group_name, round, season,
          home_team:teams!matches_home_team_id_fkey (id, short_name, logo_url, stadium_name),
          away_team:teams!matches_away_team_id_fkey (id, short_name, logo_url)
        `
        )
        .eq("competition_type", "Cup")
        .eq("season", seasonId)
        .not("group_name", "is", null)
        .order("week", { ascending: true })
        .order("match_date", { ascending: true });

      if (!matchesError && matches) {
        // Transform and group matches by group name
        const transformedMatches = matches.map((match) => ({
          match_id: match.id,
          match_date: match.match_date,
          match_time: match.match_time,
          week: match.week,
          home_goals: match.home_goals,
          away_goals: match.away_goals,
          group_name: match.group_name,
          round: match.round,
          season: match.season,
          home_team_logo: match.home_team?.logo_url,
          home_team_name: match.home_team?.short_name,
          away_team_logo: match.away_team?.logo_url,
          away_team_name: match.away_team?.short_name,
          stadium: match.home_team?.stadium_name,
        }));

        const groupedMatches = transformedMatches.reduce((acc, match) => {
          const group = match.group_name;
          if (!acc[group]) acc[group] = [];
          acc[group].push(match);
          return acc;
        }, {});

        setGroupMatches(groupedMatches);
      }

      // Fetch Final Four matches (Semi 1, Semi 2, Final)
      const { data: finalFour, error: finalFourError } = await supabase
        .from("matches")
        .select(
          `
          id, match_date, match_time, home_goals, away_goals,
          round, season,
          home_team:teams!matches_home_team_id_fkey (id, short_name, logo_url, stadium_name),
          away_team:teams!matches_away_team_id_fkey (id, short_name, logo_url)
        `
        )
        .eq("competition_type", "Cup")
        .eq("season", seasonId)
        .in("round", ["Semi 1", "Semi 2", "Semifinal", "Final"])
        .order("match_date", { ascending: true });

      if (!finalFourError && finalFour) {
        setFinalFourMatches(finalFour);
      }
    } catch (err) {
      console.error("Error fetching League Cup data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = (newSeasonId) => {
    setSelectedSeason(newSeasonId);
    const season = seasons.find((s) => s.id === newSeasonId);
    setCurrentSeason(season);
  };

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
  };

  if (loading && !currentSeason) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <EmojiEvents
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "spin 2s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar dados da Taça...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", paddingY: hideHeader ? 0 : 4 }}>
      <Container maxWidth="xl">
        {/* Header with Season Selector */}
        {!hideHeader && (
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
            {/* Title */}
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
                🏆 Taça da Liga
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                Fase de Grupos + Final Four
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
        )}

        {/* Main Tabs: Grupos | Fase Final */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
          <Tabs
            value={mainTab}
            onChange={handleMainTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                minHeight: "64px",
                color: theme.colors.text.secondary,
              },
              "& .Mui-selected": {
                color: theme.colors.primary[600],
              },
              "& .MuiTabs-indicator": {
                backgroundColor: theme.colors.primary[600],
                height: "3px",
              },
            }}
          >
            <Tab
              icon={<GroupsIcon />}
              iconPosition="start"
              label="Grupos"
              sx={{ gap: 1 }}
            />
            <Tab
              icon={<Star />}
              iconPosition="start"
              label="Fase Final"
              sx={{ gap: 1 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box>
          {/* GRUPOS TAB */}
          {mainTab === 0 && (
            <Box>
              {/* Group Tabs (A, B, C) */}
              <GroupTabs
                activeGroup={selectedGroup}
                onGroupChange={setSelectedGroup}
                groups={["A", "B", "C"]}
              />

              {/* Group Standings Table */}
              <Box sx={{ marginBottom: 4, marginTop: 2 }}>
                <GroupStandingsTable
                  standings={groupStandings[selectedGroup] || []}
                  groupName={selectedGroup}
                  isMobile={isMobile}
                  loading={loading}
                />
              </Box>

              {/* Group Match List */}
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: "bold",
                    marginBottom: 2,
                  }}
                >
                  Jogos - Grupo {selectedGroup}
                </Typography>
                <GroupMatchList
                  matches={groupMatches[selectedGroup] || []}
                  groupName={selectedGroup}
                  isMobile={isMobile}
                  loading={loading}
                />
              </Box>
            </Box>
          )}

          {/* FASE FINAL TAB */}
          {mainTab === 1 && (
            <Box>
              {/* Final Four Bracket */}
              {(() => {
                // Transform match data to expected format
                const transformMatch = (match) => {
                  if (!match) return null;
                  return {
                    match_id: match.id,
                    match_date: match.match_date,
                    match_time: match.match_time,
                    home_goals: match.home_goals,
                    away_goals: match.away_goals,
                    round: match.round,
                    home_team_id: match.home_team?.id,
                    home_team_name: match.home_team?.short_name,
                    home_team_logo: match.home_team?.logo_url,
                    away_team_id: match.away_team?.id,
                    away_team_name: match.away_team?.short_name,
                    away_team_logo: match.away_team?.logo_url,
                    stadium: match.home_team?.stadium_name,
                  };
                };

                // Extract individual matches from array
                const semi1Match = finalFourMatches.find(
                  (m) => m.round === "Semi 1"
                );
                const semi2Match = finalFourMatches.find(
                  (m) => m.round === "Semi 2"
                );
                const finalMatchData = finalFourMatches.find(
                  (m) => m.round === "Final"
                );

                // If no Semi 1/Semi 2, try to get Semifinal matches
                const semifinalMatches = finalFourMatches.filter(
                  (m) => m.round === "Semifinal"
                );
                const semi1 = transformMatch(semi1Match || semifinalMatches[0]);
                const semi2 = transformMatch(semi2Match || semifinalMatches[1]);
                const finalMatch = transformMatch(finalMatchData);

                return isMobile ? (
                  <FinalFourMobile
                    semifinal1={semi1}
                    semifinal2={semi2}
                    final={finalMatch}
                    qualifiers={null}
                  />
                ) : (
                  <FinalFourBracket
                    semifinal1={semi1}
                    semifinal2={semi2}
                    final={finalMatch}
                    qualifiers={null}
                  />
                );
              })()}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LeagueCupView;
