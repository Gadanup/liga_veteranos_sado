import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import dayjs from "dayjs";

/**
 * Custom hook to fetch and process cup matches data
 *
 * @returns {Object} - { matches, bracketData, loading }
 */
export const useCupMatches = () => {
  const [matches, setMatches] = useState({
    round8: [],
    round4: [],
    round2: [],
    final: [],
  });
  const [loading, setLoading] = useState(true);

  const placeholderRounds = {
    round8: Array(8).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    round4: Array(4).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    round2: Array(2).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    final: [
      {
        id: "TBD",
        stadium: "TBD",
        sides: [
          { team: { name: "TBD", logo: null }, score: null },
          { team: { name: "TBD", logo: null }, score: null },
        ],
      },
    ],
  };

  const fetchMatchesByRound = async (round) => {
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        id, home_goals, away_goals, home_penalties, away_penalties,
        match_date, match_time,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "Cup")
      .eq("season", "2024")
      .eq("round", round)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return data;
  };

  const formatMatches = (matches) => {
    return matches.map((match) => ({
      id: match.id,
      date: match.match_date
        ? dayjs(match.match_date).format("DD/MM/YYYY")
        : "TBD",
      time: match.match_time,
      stadium: match.home_team?.stadium_name || "TBD",
      sides: [
        {
          team: {
            name: match.home_team ? match.home_team.short_name : "TBD",
            logo: match.home_team ? match.home_team.logo_url : null,
          },
          score:
            match.home_goals !== null && match.home_goals !== undefined
              ? `${match.home_goals}${match.home_penalties ? ` (${match.home_penalties})` : ""}`
              : "---",
          winner:
            match.home_goals > match.away_goals ||
            (match.home_goals === match.away_goals &&
              match.home_penalties > match.away_penalties),
        },
        {
          team: {
            name:
              match.id === 248 && !match.away_team
                ? "------------"
                : match.away_team
                  ? match.away_team.short_name
                  : "TBD",
            logo: match.away_team ? match.away_team.logo_url : null,
          },
          score:
            match.away_goals !== null && match.away_goals !== undefined
              ? `${match.away_goals}${match.away_penalties ? ` (${match.away_penalties})` : ""}`
              : "---",
          winner:
            match.away_goals > match.home_goals ||
            (match.away_goals === match.home_goals &&
              match.away_penalties > match.home_penalties),
        },
      ],
    }));
  };

  useEffect(() => {
    const fetchAllRounds = async () => {
      setLoading(true);
      const [round8, round4, round2, final] = await Promise.all([
        fetchMatchesByRound("8"),
        fetchMatchesByRound("4"),
        fetchMatchesByRound("2"),
        fetchMatchesByRound("1"),
      ]);

      setMatches({
        round8: round8.length ? round8 : placeholderRounds.round8,
        round4: round4.length ? round4 : placeholderRounds.round4,
        round2: round2.length ? round2 : placeholderRounds.round2,
        final: final.length ? final : placeholderRounds.final,
      });
      setLoading(false);
    };

    fetchAllRounds();
  }, []);

  const bracketData = {
    round8: formatMatches(matches.round8),
    round4: formatMatches(matches.round4),
    round2: formatMatches(matches.round2),
    final: formatMatches(matches.final),
  };

  return { matches, bracketData, loading };
};
