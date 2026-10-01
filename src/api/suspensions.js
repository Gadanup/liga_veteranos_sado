import { supabase } from "../lib/supabase";

/**
 * Every active suspension of a season, with the suspended player's name and
 * team.
 *
 * One call covers a whole page: a league matchweek shows seven matches, and
 * between them they involve all fourteen teams, so the per-match queries this
 * replaces were each asking for a slice of the same small set.
 *
 * `players!inner` keeps the existing behaviour: a suspension whose player row
 * is missing is dropped rather than rendered without a name.
 */
export const fetchActiveSuspensions = async (seasonId) => {
  const { data, error } = await supabase
    .from("suspensions")
    .select("player_id, players!inner (name, team_id)")
    .eq("active", true)
    .eq("season", seasonId);

  if (error) throw error;
  return data ?? [];
};

/**
 * Groups what fetchActiveSuspensions returns by team.
 *
 * @returns {Object} team id -> array of suspended player names
 */
export const groupSuspensionsByTeam = (suspensions) => {
  const byTeam = {};

  for (const suspension of suspensions ?? []) {
    const teamId = suspension.players?.team_id;
    const name = suspension.players?.name;
    if (!teamId || !name) continue;

    if (!byTeam[teamId]) byTeam[teamId] = [];
    byTeam[teamId].push(name);
  }

  return byTeam;
};
