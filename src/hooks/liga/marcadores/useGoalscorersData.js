import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

/**
 * Custom hook to fetch and process goalscorers data
 *
 * @param {number} seasonId - Selected season ID
 * @returns {Object} - { goalscorers, teams, loading }
 */
export const useGoalscorersData = (seasonId) => {
  const [goalscorers, setGoalscorers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seasonId) return;

    const fetchGoalscorers = async () => {
      setLoading(true);

      // Fetch matches for selected season
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("id")
        .in("competition_type", ["League", "Cup"])
        .eq("season", seasonId);

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        setLoading(false);
        return;
      }

      // Fetch match events (goals) in batches
      const matchIds = matches.map((match) => match.id);
      const fetchAllMatchEvents = async () => {
        let allEvents = [];
        let from = 0;
        const batchSize = 1000;
        let hasMore = true;

        while (hasMore) {
          const { data: matchEvents, error } = await supabase
            .from("match_events")
            .select("player_id")
            .in("match_id", matchIds)
            .eq("event_type", 1)
            .range(from, from + batchSize - 1);

          if (error) {
            console.error("Error fetching match events:", error);
            break;
          }

          allEvents = [...allEvents, ...matchEvents];

          if (matchEvents.length < batchSize) {
            hasMore = false;
          } else {
            from += batchSize;
          }
        }

        return allEvents;
      };

      const matchEvents = await fetchAllMatchEvents();

      // Count goals for each player
      const goalsCount = matchEvents.reduce((acc, event) => {
        acc[event.player_id] = (acc[event.player_id] || 0) + 1;
        return acc;
      }, {});

      // Fetch player details
      const playerIds = Object.keys(goalsCount);

      if (playerIds.length === 0) {
        setGoalscorers([]);
        setTeams([]);
        setLoading(false);
        return;
      }

      const { data: players, error: playersError } = await supabase
        .from("players")
        .select("id, name, photo_url, team_id")
        .in("id", playerIds);

      if (playersError) {
        console.error("Error fetching players:", playersError);
        setLoading(false);
        return;
      }

      // Fetch team details
      const teamIds = players.map((player) => player.team_id);
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("id, short_name, logo_url")
        .in("id", teamIds);

      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        setLoading(false);
        return;
      }

      setTeams(teamsData);

      // Combine goals count, player details, and team details
      const goalscorersData = players.map((player) => {
        const team = teamsData.find((team) => team.id === player.team_id);
        return {
          ...player,
          goals: goalsCount[player.id] || 0,
          team_name: team ? team.short_name : "Unknown Team",
          team_logo_url: team ? team.logo_url : null,
        };
      });

      // Sort and add ranking
      const sortedGoalscorers = goalscorersData
        .sort((a, b) => b.goals - a.goals)
        .map((player, index) => ({
          ...player,
          originalRank: index + 1,
        }));

      setGoalscorers(sortedGoalscorers);
      setLoading(false);
    };

    fetchGoalscorers();
  }, [seasonId]);

  return { goalscorers, teams, loading };
};
