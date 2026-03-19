import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

/**
 * Custom hook to fetch and process discipline data
 *
 * @param {number} seasonId - Selected season ID
 * @returns {Object} - { disciplineData, loading }
 */
export const useDisciplineData = (seasonId) => {
  const [disciplineData, setDisciplineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seasonId) return;

    const fetchDisciplineData = async () => {
      setLoading(true);

      // Fetch discipline standings
      const { data, error } = await supabase
        .from("discipline_standings")
        .select(
          `
          team_id,
          teams!discipline_standings_team_id_fkey (short_name, logo_url),
          matches_played, yellow_cards, red_cards, calculated_points,
          other_punishments, excluded, season
        `
        )
        .eq("season", seasonId);

      if (error) {
        console.error("Error fetching discipline data:", error);
        setLoading(false);
        return;
      }

      // Fetch active suspensions — include transfer fields to show under both teams when applicable
      const { data: suspensions, error: suspensionsError } = await supabase
        .from("suspensions")
        .select(
          `player_id, suspension_date, players (name, team_id, previousClub, transferDate), active, season`
        )
        .eq("active", true)
        .eq("season", seasonId);

      if (suspensionsError) {
        console.error("Error fetching suspended players:", suspensionsError);
        setLoading(false);
        return;
      }

      // Group suspended players by team.
      // If a player transferred mid-season and the suspension was earned before the transfer,
      // show the player under BOTH the current team and the previous club.
      const suspendedPlayersByTeam = suspensions.reduce((acc, suspension) => {
        const player = suspension.players;
        if (!player) return acc;

        // Always show under current team
        if (player.team_id) {
          if (!acc[player.team_id]) acc[player.team_id] = [];
          if (!acc[player.team_id].includes(player.name)) {
            acc[player.team_id].push(player.name);
          }
        }

        // Also show under previous club if suspension was earned before the transfer date
        if (
          player.previousClub &&
          player.transferDate &&
          suspension.suspension_date < player.transferDate
        ) {
          const prevClubId = Number(player.previousClub);
          if (!acc[prevClubId]) acc[prevClubId] = [];
          if (!acc[prevClubId].includes(player.name)) {
            acc[prevClubId].push(player.name);
          }
        }

        return acc;
      }, {});

      // Fetch all players
      const { data: players, error: playersError } = await supabase
        .from("players")
        .select(`id, name, team_id`);

      if (playersError) {
        console.error("Error fetching players:", playersError);
        setLoading(false);
        return;
      }

      // Fetch match events to count yellow cards
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("id")
        .eq("season", seasonId);

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        setLoading(false);
        return;
      }

      const matchIds = matches.map((m) => m.id);

      const { data: matchEvents, error: matchEventsError } = await supabase
        .from("match_events")
        .select(`player_id, event_type, match_id`)
        .eq("event_type", 2)
        .in("match_id", matchIds);

      if (matchEventsError) {
        console.error("Error fetching match events:", matchEventsError);
        setLoading(false);
        return;
      }

      // Count yellow cards per player
      const yellowCardCounts = matchEvents.reduce((acc, event) => {
        if (!acc[event.player_id]) acc[event.player_id] = 0;
        acc[event.player_id] += 1;
        return acc;
      }, {});

      // Identify players at risk (next yellow = suspension)
      const playersAtRisk = players.reduce((acc, player) => {
        const cards = yellowCardCounts[player.id] || 0;
        if ((cards + 1) % 3 === 0) {
          const teamId = player.team_id;
          if (!acc[teamId]) acc[teamId] = [];
          acc[teamId].push(player.name);
        }
        return acc;
      }, {});

      // Sort discipline data
      const sortedData = data
        .sort((a, b) => {
          // Excluded teams go to the bottom
          if (a.excluded && !b.excluded) return 1;
          if (!a.excluded && b.excluded) return -1;

          // Teams with 0 matches should be sorted by total points (not average)
          // and placed after teams with matches
          const hasMatchesA = a.matches_played > 0;
          const hasMatchesB = b.matches_played > 0;

          // If one has matches and the other doesn't
          if (hasMatchesA && !hasMatchesB) return -1; // A comes first
          if (!hasMatchesA && hasMatchesB) return 1; // B comes first

          // If both have no matches, sort by total calculated_points (ascending)
          if (!hasMatchesA && !hasMatchesB) {
            return a.calculated_points - b.calculated_points;
          }

          // If both have matches, sort by average (ascending)
          const avgA = a.calculated_points / a.matches_played;
          const avgB = b.calculated_points / b.matches_played;
          return avgA - avgB;
        })
        .map((team) => ({
          ...team,
          suspendedPlayers: suspendedPlayersByTeam[team.team_id] || [],
          atRiskPlayers: playersAtRisk[team.team_id] || [],
        }));

      setDisciplineData(sortedData);
      setLoading(false);
    };

    fetchDisciplineData();
  }, [seasonId]);

  return { disciplineData, loading };
};
