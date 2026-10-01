import { useEffect, useState } from "react";
import {
  fetchActiveSuspensions,
  groupSuspensionsByTeam,
} from "../api/suspensions";

/**
 * Active suspensions for a season, grouped by team.
 *
 * Each match card used to run this query itself, so a matchweek fired seven
 * identical-in-all-but-the-filter requests, and repeated them whenever the
 * page re-rendered — the effect depended on the match object, which the parent
 * recreated each time.
 *
 * @param {number|null} seasonId
 * @returns {{ suspensionsByTeam: Object, loading: boolean }}
 *   suspensionsByTeam maps a team id to an array of suspended player names.
 */
export const useActiveSuspensions = (seasonId) => {
  const [suspensionsByTeam, setSuspensionsByTeam] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!seasonId) {
      setSuspensionsByTeam({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchActiveSuspensions(seasonId)
      .then((suspensions) => {
        if (!cancelled) setSuspensionsByTeam(groupSuspensionsByTeam(suspensions));
      })
      .catch((error) => console.error("Error fetching suspensions:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [seasonId]);

  return { suspensionsByTeam, loading };
};
