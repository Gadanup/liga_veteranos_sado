"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsAdmin } from "../../../hooks/admin/useIsAdmin";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Typography, Grid } from "@mui/material";
import { theme } from "../../../styles/theme.js";
import dayjs from "dayjs";

// Components
import CupCalendarHeader from "../../../components/features/taca/calendario/CupCalendarHeader";
import CupMatchCard from "../../../components/features/taca/calendario/CupMatchCard";
import WeekNavigator from "../../../components/features/liga/calendario/WeekNavigator";
import CreateCupMatchDialog from "../../../components/features/taca/calendario/CreateCupMatchDialog";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import EmptyState from "../../../components/shared/EmptyState";

const CupCalendarContent = () => {
  const [fixturesByWeek, setFixturesByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createMatchDialogOpen, setCreateMatchDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin } = useIsAdmin(false);

  // Fetch seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("id, description, is_current, cup_group_stage")
        .order("id", { ascending: false });

      if (!error && data) {
        setSeasons(data);
        const current = data.find((s) => s.is_current);
        if (current) {
          setSelectedSeason(current.id);
          setCurrentSeason(current);
        } else if (data.length > 0) {
          setSelectedSeason(data[0].id);
          setCurrentSeason(data[0]);
        }
      }
    };
    fetchSeasons();
  }, []);

  // Fetch matches
  const fetchCupMatches = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);
    const { data: cupMatches, error } = await supabase
      .from("matches")
      .select(
        `
        id, match_date, match_time, week, home_goals, away_goals,
        home_team_id, away_team_id, competition_type, round, season, group_name,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "Cup")
      .eq("season", seasonId)
      .order("week", { ascending: true })
      .order("match_date", { ascending: true })
      .order("match_time", { ascending: true });

    if (!error && cupMatches) {
      // Group by week/round
      // For group stage matches: use week number (Jornada 1, 2, 3...)
      // For knockout matches: use round name (Semifinal, Final)
      const groupedByWeek = cupMatches.reduce((acc, match) => {
        let weekKey;

        if (match.group_name && match.week) {
          // Group stage match - use "Jornada X"
          weekKey = `Jornada ${match.week}`;
        } else if (match.round) {
          // Knockout match - use round name
          weekKey = match.round;
        } else {
          // Fallback
          weekKey = "Outros";
        }

        if (!acc[weekKey]) acc[weekKey] = [];
        acc[weekKey].push(match);
        return acc;
      }, {});

      setFixturesByWeek(groupedByWeek);

      // Check if there's a week in the URL
      const urlWeek = searchParams.get("week");
      const urlSeason = searchParams.get("season");

      if (urlWeek && urlSeason === String(seasonId) && groupedByWeek[urlWeek]) {
        setCurrentWeek(urlWeek);
      } else {
        // Find closest week/round
        const closestWeek = findClosestWeek(groupedByWeek, cupMatches);
        setCurrentWeek(closestWeek);
        if (closestWeek) {
          updateURL(closestWeek, seasonId);
        }
      }
    }
    setLoading(false);
  };

  const findClosestWeek = (groupedMatches, allMatches) => {
    const today = dayjs();
    let closestWeek = null;
    let minDateDifference = Infinity;

    Object.keys(groupedMatches).forEach((week) => {
      groupedMatches[week].forEach((match) => {
        const matchDate = dayjs(match.match_date);
        const diff = Math.abs(matchDate.diff(today, "day"));
        if (diff < minDateDifference) {
          minDateDifference = diff;
          closestWeek = week;
        }
      });
    });

    return closestWeek || Object.keys(groupedMatches)[0];
  };

  const updateURL = (week, season) => {
    const params = new URLSearchParams();
    if (week) params.set("week", week);
    if (season) params.set("season", season);
    router.push(`/taca/calendario?${params.toString()}`, { scroll: false });
  };

  const handleWeekChange = (newWeek) => {
    setCurrentWeek(newWeek);
    updateURL(newWeek, selectedSeason);
  };

  const handleSeasonChange = (newSeason) => {
    const season = seasons.find((s) => s.id === newSeason);
    setSelectedSeason(newSeason);
    setCurrentSeason(season);
  };

  useEffect(() => {
    if (selectedSeason) {
      fetchCupMatches(selectedSeason);
    }
  }, [selectedSeason]);

  if (loading && seasons.length === 0) {
    return <LoadingSkeleton message="A carregar jogos da Taça..." />;
  }

  const weekList = Object.keys(fixturesByWeek);
  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);
  const isGroupStageMode = currentSeasonData?.cup_group_stage === true;

  return (
    <Box sx={{ minHeight: "100vh", paddingY: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <CupCalendarHeader
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
          isAdmin={isAdmin}
          onCreateMatch={() => setCreateMatchDialogOpen(true)}
          isGroupStageMode={isGroupStageMode}
          activeFilter={currentWeek}
        />

        {/* Week/Round Navigator */}
        {weekList.length > 0 && (
          <WeekNavigator
            weekList={weekList}
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
          />
        )}

        {/* Current Week/Round Title */}
        {currentWeek && (
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: "bold",
              fontSize: "48px",
              marginBottom: 4,
              opacity: 0.3,
            }}
          >
            {currentWeek}
          </Typography>
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingSkeleton message="A carregar jogos da Taça..." />
        ) : weekList.length === 0 ? (
          <EmptyState
            message={`Ainda não há jogos da Taça para a época ${currentSeasonData?.description}`}
          />
        ) : (
          <>
            {/* Matches Grid */}
            {currentWeek && fixturesByWeek[currentWeek] && (
              <Grid container spacing={3}>
                {fixturesByWeek[currentWeek].map((match, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={match.id}
                    sx={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      "@keyframes fadeInUp": {
                        "0%": { opacity: 0, transform: "translateY(20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <CupMatchCard
                      match={match}
                      isAdmin={isAdmin}
                      onUpdate={() => fetchCupMatches(selectedSeason)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Empty Week */}
            {currentWeek &&
              (!fixturesByWeek[currentWeek] ||
                fixturesByWeek[currentWeek].length === 0) && (
                <EmptyState
                  message={`Nenhum jogo agendado para ${currentWeek}`}
                />
              )}
          </>
        )}

        {/* Create Match Dialog */}
        <CreateCupMatchDialog
          open={createMatchDialogOpen}
          onClose={() => setCreateMatchDialogOpen(false)}
          onSuccess={() => {
            setCreateMatchDialogOpen(false);
            fetchCupMatches(selectedSeason);
          }}
          selectedSeason={selectedSeason}
          cupGroupStage={isGroupStageMode}
        />
      </Container>
    </Box>
  );
};

const CupCalendar = () => {
  return (
    <Suspense
      fallback={<LoadingSkeleton message="A carregar jogos da Taça..." />}
    >
      <CupCalendarContent />
    </Suspense>
  );
};

export default CupCalendar;
