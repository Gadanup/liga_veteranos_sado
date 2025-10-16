"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Box, Container } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { theme } from "../../../styles/theme.js";
import dayjs from "dayjs";

// Components
import TeamHeader from "../../../components/features/equipas/TeamHeader";
import TeamInfoCards from "../../../components/features/equipas/TeamInfoCards";
import TeamTabs from "../../../components/features/equipas/TeamTabs";
import TeamSelectors from "../../../components/features/equipas/TeamSelectors";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import ErrorMessage from "../../../components/shared/ErrorMessage";

const TeamPageContent = ({ params }) => {
  const { teamname } = params;
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [teamData, setTeamData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamFixtures, setTeamFixtures] = useState([]);
  const [nextGame, setNextGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [allTeams, setAllTeams] = useState([]);

  // Fetch seasons on mount
  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("id, description, is_current")
        .order("id", { ascending: false });

      if (!error && data) {
        setSeasons(data);
      }
    };
    fetchSeasons();
  }, []);

  // Determine selected season from URL or default to current
  useEffect(() => {
    if (seasons.length === 0) return;

    const seasonParam = searchParams.get("season");

    if (seasonParam) {
      const newSeason = Number(seasonParam);
      // Only update if different to avoid infinite loops
      if (newSeason !== selectedSeason) {
        setSelectedSeason(newSeason);
      }
    } else {
      const currentSeason = seasons.find((s) => s.is_current);
      const defaultSeason = currentSeason ? currentSeason.id : seasons[0].id;
      if (defaultSeason !== selectedSeason) {
        setSelectedSeason(defaultSeason);
      }
    }
  }, [seasons, searchParams]);

  // Fetch teams for the selected season
  useEffect(() => {
    const fetchTeamsForSeason = async () => {
      if (!selectedSeason) return;

      const { data, error } = await supabase
        .from("teams")
        .select("id, short_name, logo_url, season")
        .eq("season", selectedSeason)
        .order("short_name", { ascending: true });

      if (!error && data) {
        setAllTeams(data);
      }
    };
    fetchTeamsForSeason();
  }, [selectedSeason]);

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!selectedSeason) return;

      setLoading(true);

      // Fetch team data
      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("short_name", decodeURIComponent(teamname))
        .eq("season", selectedSeason)
        .single();

      if (error) {
        console.error("Error fetching team data:", error);
        setTeamData(null);
        setLoading(false);
        return;
      }

      setTeamData(team);

      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*")
        .order("name", { ascending: true })
        .eq("team_id", team.id);

      if (playersError) {
        console.error("Error fetching players data:", playersError);
      } else {
        setPlayers(playersData);
      }

      // Fetch fixtures
      const { data: fixtures, error: fixturesError } = await supabase
        .from("matches")
        .select(
          `
          id,
          match_date,
          match_time,
          home_goals,
          away_goals,
          competition_type,
          round,
          week,
          home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
          away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
        `
        )
        .eq("season", selectedSeason)
        .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
        .order("match_date", { ascending: true });

      if (fixturesError) {
        console.error("Error fetching fixtures:", fixturesError);
      } else {
        setTeamFixtures(fixtures);
        const now = dayjs();
        const nextGame = fixtures.find((fixture) =>
          dayjs(fixture.match_date).isAfter(now)
        );
        setNextGame(nextGame);
      }

      setLoading(false);
    };

    fetchTeamData();
  }, [teamname, selectedSeason]);

  const handleSeasonChange = (newSeasonId) => {
    // Immediately update state before navigation to prevent race condition
    setSelectedSeason(newSeasonId);
    // Use teamname directly from params - it's already URL-safe
    router.push(`/equipas/${teamname}?season=${newSeasonId}`, {
      scroll: false,
    });
  };

  const handleTeamChange = (newTeamName) => {
    // Encode only once when changing teams
    router.push(
      `/equipas/${encodeURIComponent(newTeamName)}?season=${selectedSeason}`,
      { scroll: false }
    );
  };

  if (loading || !selectedSeason) {
    return <LoadingSkeleton message="A carregar informações da equipa..." />;
  }

  if (!teamData) {
    return <ErrorMessage message="Equipa não encontrada" />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: theme.spacing.lg,
      }}
    >
      <Container maxWidth="lg">
        {/* Season and Team Selectors */}
        {seasons.length > 0 && allTeams.length > 0 && (
          <TeamSelectors
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={handleSeasonChange}
            teams={allTeams}
            selectedTeam={teamData.short_name}
            onTeamChange={handleTeamChange}
          />
        )}

        {/* Team Header with Logo and Basic Info */}
        <TeamHeader teamData={teamData} selectedSeason={selectedSeason} />

        {/* Jersey Info and Next Game Cards */}
        <TeamInfoCards teamData={teamData} nextGame={nextGame} />

        {/* Calendar and Squad Tabs */}
        <TeamTabs
          teamData={teamData}
          teamFixtures={teamFixtures}
          players={players}
        />
      </Container>
    </Box>
  );
};

const TeamPage = ({ params }) => {
  return (
    <Suspense
      fallback={
        <LoadingSkeleton message="A carregar informações da equipa..." />
      }
    >
      <TeamPageContent params={params} />
    </Suspense>
  );
};

export default TeamPage;
