"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Grid } from "@mui/material";
import { theme } from "../../../styles/theme.js";

// Components
import MatchHeader from "../../../components/features/jogos/MatchHeader";
import SeasonSelector from "../../../components/features/jogos/SeasonSelector";
import MatchSheetDownload from "../../../components/features/jogos/MatchSheetDownload";
import MatchStatistics from "../../../components/features/jogos/MatchStatistics";
import TeamSquads from "../../../components/features/jogos/TeamSquads";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";

const MatchPage = () => {
  const [matchDetails, setMatchDetails] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [currentHomePlayers, setCurrentHomePlayers] = useState([]);
  const [currentAwayPlayers, setCurrentAwayPlayers] = useState([]);
  const [matchEvents, setMatchEvents] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suspendedPlayerIds, setSuspendedPlayerIds] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [supercupMatches, setSupercupMatches] = useState([]);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

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

  // Fetch match data
  useEffect(() => {
    if (id && selectedSeason) {
      const loadMatchData = async () => {
        setLoading(true);
        try {
          // Fetch match details
          const { data: matchData, error } = await supabase
            .from("matches")
            .select(
              `
              id, competition_type, week, round, home_goals, away_goals,
              home_penalties, away_penalties, match_date, match_time,
              match_sheet, season,
              home_team:teams!matches_home_team_id_fkey (id, short_name, logo_url, stadium_name),
              away_team:teams!matches_away_team_id_fkey (id, short_name, logo_url)
            `
            )
            .eq("id", id)
            .single();

          if (error) {
            setError("Erro ao carregar detalhes do jogo");
            return;
          }

          setMatchDetails(matchData);

          // If Supercup, fetch all supercup matches
          if (matchData.competition_type === "Supercup") {
            const { data: supercupData } = await supabase
              .from("matches")
              .select(
                `id, season, match_date,
                home_team:teams!matches_home_team_id_fkey (short_name),
                away_team:teams!matches_away_team_id_fkey (short_name)`
              )
              .eq("competition_type", "Supercup")
              .order("season", { ascending: false });

            if (supercupData) setSupercupMatches(supercupData);
          }

          // Fetch players, events, suspensions in parallel
          const [
            playersResult,
            eventsResult,
            suspensionsResult,
            currentPlayersResult,
          ] = await Promise.allSettled([
            supabase
              .from("players")
              .select("id, name, photo_url, joker, team_id, previousClub"),
            supabase
              .from("match_events")
              .select("event_type, player_id")
              .eq("match_id", matchData.id),
            supabase.from("suspensions").select("player_id").eq("active", true),
            supabase
              .from("players")
              .select("id, name, photo_url, joker, team_id")
              .in("team_id", [matchData.home_team.id, matchData.away_team.id]),
          ]);

          // Process players
          if (
            playersResult.status === "fulfilled" &&
            playersResult.value.data
          ) {
            const allPlayers = playersResult.value.data;
            const homePlayersData = allPlayers.filter(
              (p) =>
                p.team_id === matchData.home_team.id ||
                p.previousClub === matchData.home_team.id
            );
            const awayPlayersData = allPlayers.filter(
              (p) =>
                p.team_id === matchData.away_team.id ||
                p.previousClub === matchData.away_team.id
            );
            const homePlayerIds = homePlayersData.map((p) => p.id);
            const filteredAwayPlayers = awayPlayersData.filter(
              (p) => !homePlayerIds.includes(p.id)
            );

            setHomePlayers(homePlayersData);
            setAwayPlayers(filteredAwayPlayers);
          }

          // Process current players
          if (
            currentPlayersResult.status === "fulfilled" &&
            currentPlayersResult.value.data
          ) {
            const allCurrentPlayers = currentPlayersResult.value.data;
            setCurrentHomePlayers(
              allCurrentPlayers.filter(
                (p) => p.team_id === matchData.home_team.id
              )
            );
            setCurrentAwayPlayers(
              allCurrentPlayers.filter(
                (p) => p.team_id === matchData.away_team.id
              )
            );
          }

          // Process events
          if (eventsResult.status === "fulfilled" && eventsResult.value.data) {
            const events = eventsResult.value.data;
            setMatchEvents(events);

            if (events.length > 0) {
              const playerIds = events.map((e) => e.player_id);
              const { data: eventPlayersData } = await supabase
                .from("players")
                .select("id, name, team_id, joker, previousClub")
                .in("id", playerIds);

              if (eventPlayersData) setPlayersData(eventPlayersData);
            }
          }

          // Process suspensions
          if (
            suspensionsResult.status === "fulfilled" &&
            suspensionsResult.value.data
          ) {
            setSuspendedPlayerIds(
              suspensionsResult.value.data.map((r) => r.player_id)
            );
          }
        } catch (err) {
          setError("Erro inesperado ao carregar o jogo");
        } finally {
          setLoading(false);
        }
      };

      loadMatchData();
    }
  }, [id, selectedSeason]);

  const handleSeasonChange = (newSeasonId) => {
    const match = supercupMatches.find((m) => m.season === newSeasonId);
    if (match) router.push(`/jogos/${match.id}`);
  };

  if (loading) {
    return <LoadingSkeleton message="A carregar detalhes do jogo..." />;
  }

  if (!matchDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <p style={{ color: theme.colors.text.secondary }}>
          Carregar dados do Jogo
        </p>
      </Container>
    );
  }

  const isSupercup = matchDetails.competition_type === "Supercup";

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Season Selector for Supercup */}
        {isSupercup && supercupMatches.length > 1 && (
          <SeasonSelector
            seasons={seasons}
            selectedSeason={matchDetails.season}
            onSeasonChange={handleSeasonChange}
          />
        )}

        {/* Match Header */}
        <MatchHeader matchDetails={matchDetails} />

        {/* Download Match Sheet */}
        <MatchSheetDownload
          matchDetails={matchDetails}
          currentHomePlayers={currentHomePlayers}
          currentAwayPlayers={currentAwayPlayers}
          suspendedPlayerIds={suspendedPlayerIds}
        />

        {/* Match Statistics */}
        <MatchStatistics
          matchDetails={matchDetails}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          matchEvents={matchEvents}
          playersData={playersData}
        />

        {/* Team Squads */}
        <TeamSquads
          matchDetails={matchDetails}
          currentHomePlayers={currentHomePlayers}
          currentAwayPlayers={currentAwayPlayers}
          suspendedPlayerIds={suspendedPlayerIds}
        />
      </Container>
    </Box>
  );
};

export default MatchPage;
