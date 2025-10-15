"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsAdmin } from "../../../hooks/admin/useIsAdmin";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Typography, Grid } from "@mui/material";
import { theme } from "../../../styles/theme.js";
import dayjs from "dayjs";

// Components
import CalendarHeader from "../../../components/features/liga/calendario/CalendarHeader";
import WeekNavigator from "../../../components/features/liga/calendario/WeekNavigator";
import MatchCard from "../../../components/features/liga/calendario/MatchCard";
import CreateMatchDialog from "../../../components/features/liga/calendario/CreateMatchDialog";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import EmptyState from "../../../components/shared/EmptyState";

const LeagueFixturesContent = () => {
  const [fixturesByWeek, setFixturesByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
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

  // Fetch matches
  const readAllMatches = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        id, match_date, match_time, week, home_goals, away_goals,
        home_team_id, away_team_id, competition_type, round, season,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "League")
      .eq("season", seasonId)
      .order("week", { ascending: true })
      .order("match_date", { ascending: true })
      .order("match_time", { ascending: true });

    if (!error) {
      const groupedByWeek = matches.reduce((acc, match) => {
        const week = match.week;
        if (!acc[week]) acc[week] = [];
        acc[week].push(match);
        return acc;
      }, {});

      setFixturesByWeek(groupedByWeek);

      // Check if there's a week in the URL
      const urlWeek = searchParams.get("week");
      const urlSeason = searchParams.get("season");

      if (urlWeek && urlSeason === String(seasonId) && groupedByWeek[urlWeek]) {
        // Use week from URL if it matches current season and exists
        setCurrentWeek(urlWeek);
      } else {
        // Otherwise find closest week
        const closestWeek = findClosestWeek(groupedByWeek);
        setCurrentWeek(closestWeek);
        // Update URL with current week
        if (closestWeek) {
          updateURL(closestWeek, seasonId);
        }
      }
    }
    setLoading(false);
  };

  const findClosestWeek = (groupedMatches) => {
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
    return closestWeek;
  };

  const updateURL = (week, season) => {
    const params = new URLSearchParams();
    if (week) params.set("week", week);
    if (season) params.set("season", season);
    router.push(`/liga/calendario?${params.toString()}`, { scroll: false });
  };

  const handleWeekChange = (newWeek) => {
    setCurrentWeek(newWeek);
    updateURL(newWeek, selectedSeason);
  };

  const handleSeasonChange = (newSeason) => {
    setSelectedSeason(newSeason);
    // Don't update week yet, let readAllMatches handle it
  };

  useEffect(() => {
    if (selectedSeason) {
      readAllMatches(selectedSeason);
    }
  }, [selectedSeason]);

  if (loading && seasons.length === 0) {
    return <LoadingSkeleton message="A carregar jogos..." />;
  }

  const weekList = Object.keys(fixturesByWeek);
  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);

  return (
    <Box sx={{ minHeight: "100vh", paddingY: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <CalendarHeader
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
          isAdmin={isAdmin}
          onCreateMatch={() => setCreateMatchDialogOpen(true)}
        />

        {/* Week Navigator */}
        {weekList.length > 0 && (
          <WeekNavigator
            weekList={weekList}
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
          />
        )}

        {/* Current Week Title */}
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
            Jornada {currentWeek}
          </Typography>
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingSkeleton message="A carregar jogos..." />
        ) : weekList.length === 0 ? (
          <EmptyState
            message={`Ainda não há jogos para a época ${currentSeasonData?.description}`}
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
                    <MatchCard
                      match={match}
                      isAdmin={isAdmin}
                      onUpdate={() => readAllMatches(selectedSeason)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Empty Week */}
            {currentWeek &&
              (!fixturesByWeek[currentWeek] ||
                fixturesByWeek[currentWeek].length === 0) && (
                <EmptyState message="Nenhum jogo agendado para esta jornada" />
              )}
          </>
        )}

        {/* Create Match Dialog */}
        <CreateMatchDialog
          open={createMatchDialogOpen}
          onClose={() => setCreateMatchDialogOpen(false)}
          onSuccess={() => {
            setCreateMatchDialogOpen(false);
            readAllMatches(selectedSeason);
          }}
          selectedSeason={selectedSeason}
        />
      </Container>
    </Box>
  );
};

const LeagueFixtures = () => {
  return (
    <Suspense fallback={<LoadingSkeleton message="A carregar jogos..." />}>
      <LeagueFixturesContent />
    </Suspense>
  );
};

export default LeagueFixtures;
