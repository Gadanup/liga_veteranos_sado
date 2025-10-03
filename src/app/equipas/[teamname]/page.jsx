"use client";
import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { theme } from "../../../styles/theme.js";
import dayjs from "dayjs";

// Components
import TeamHeader from "../../../components/features/equipas/TeamHeader";
import TeamInfoCards from "../../../components/features/equipas/TeamInfoCards";
import TeamTabs from "../../../components/features/equipas/TeamTabs";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import ErrorMessage from "../../../components/shared/ErrorMessage";

const TeamPage = ({ params }) => {
  const { teamname } = params;
  const searchParams = useSearchParams();

  // State
  const [teamData, setTeamData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamFixtures, setTeamFixtures] = useState([]);
  const [nextGame, setNextGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);

      // Get season from URL or default to current season
      let targetSeason = searchParams.get("season");

      if (!targetSeason) {
        const { data: currentSeasonData } = await supabase
          .from("seasons")
          .select("id")
          .eq("is_current", true)
          .single();

        targetSeason = currentSeasonData?.id;
      }

      setSelectedSeason(targetSeason);

      // Fetch team data
      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("short_name", decodeURIComponent(teamname))
        .eq("season", targetSeason)
        .single();

      if (error) {
        console.error("Error fetching team data:", error);
      } else {
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
          .eq("season", targetSeason)
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
      }
      setLoading(false);
    };

    fetchTeamData();
  }, [teamname, searchParams]);

  if (loading) {
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

export default TeamPage;
