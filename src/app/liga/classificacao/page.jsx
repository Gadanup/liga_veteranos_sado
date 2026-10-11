"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "../../../components/ThemeWrapper";

// Components
import ClassificationHeader from "../../../components/features/liga/classificacao/ClassificationHeader";
import ClassificationLegend from "../../../components/features/liga/classificacao/ClassificationLegend";
import ClassificationTable from "../../../components/features/liga/classificacao/ClassificationTable";
import ClassificationStats from "../../../components/features/liga/classificacao/ClassificationStats";
import LoadingSkeleton from "../../../components/features/liga/classificacao/LoadingSkeleton";
import ComparisonModal from "../../../components/features/liga/classificacao/ComparisonModal";

const Classification = () => {
  const [classification, setClassification] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [leagueMatches, setLeagueMatches] = useState([]);
  const [disciplineRank, setDisciplineRank] = useState({});
  const router = useRouter();
  const theme = useTheme();

  // This page used to keep the viewport width in state, updated from a
  // debounced resize listener, and compare it against 768 and 900 by hand.
  // The theme owns those boundaries now, and useMediaQuery re-renders on its
  // own — no listener, no state, and correct on the first paint.
  const isMobile = useMediaQuery((t) => t.breakpoints.down("md"));
  const isDesktop = useMediaQuery((t) => t.breakpoints.up("md"));

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

  // Build form data (last 5 matches for each team) from a list of matches
  const buildFormData = (matches) => {
    const formByTeam = {};

    matches.forEach((match) => {
      // Process home team
      if (!formByTeam[match.home_team_id]) {
        formByTeam[match.home_team_id] = [];
      }
      if (formByTeam[match.home_team_id].length < 5) {
        const result =
          match.home_goals > match.away_goals
            ? "W"
            : match.home_goals < match.away_goals
              ? "L"
              : "D";
        formByTeam[match.home_team_id].push({
          result,
          opponent: match.away_team.short_name,
          score: `${match.home_goals}-${match.away_goals}`,
          date: match.match_date,
        });
      }

      // Process away team
      if (!formByTeam[match.away_team_id]) {
        formByTeam[match.away_team_id] = [];
      }
      if (formByTeam[match.away_team_id].length < 5) {
        const result =
          match.away_goals > match.home_goals
            ? "W"
            : match.away_goals < match.home_goals
              ? "L"
              : "D";
        formByTeam[match.away_team_id].push({
          result,
          opponent: match.home_team.short_name,
          score: `${match.away_goals}-${match.home_goals}`,
          date: match.match_date,
        });
      }
    });

    return formByTeam;
  };

  // Fetch classification
  const readClassification = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);

    // Fetch all completed league matches once (used for form + head-to-head)
    const { data: matches } = await supabase
      .from("matches")
      .select(
        `
        id, match_date, home_team_id, away_team_id,
        home_goals, away_goals, competition_type,
        home_team:teams!matches_home_team_id_fkey (short_name),
        away_team:teams!matches_away_team_id_fkey (short_name)
      `
      )
      .eq("season", seasonId)
      .eq("competition_type", "League")
      .not("home_goals", "is", null)
      .not("away_goals", "is", null)
      .order("match_date", { ascending: false });

    const matchesList = matches || [];
    setLeagueMatches(matchesList);
    setFormData(buildFormData(matchesList));

    // The Taça Disciplina position is one of the tiebreakers (Regulamento
    // 2026/2027, Competições art. 22), so the standings need to know it.
    const { data: disciplineData } = await supabase
      .from("discipline_standings")
      .select("team_id, matches_played, calculated_points, excluded")
      .eq("season", seasonId);

    const rank = buildDisciplineRank(disciplineData || []);
    setDisciplineRank(rank);

    const { data: classificationData, error } = await supabase
      .from("league_standings")
      .select(
        `
        team_id,
        teams!league_standings_team_id_fkey (short_name, logo_url, excluded),
        matches_played, wins, draws, losses, goals_for, goals_against, points, season_year
      `
      )
      .eq("season_year", seasonId);

    if (!error) {
      const sortedData = sortClassification(
        classificationData,
        sortBy,
        sortOrder,
        matchesList,
        rank
      );
      setClassification(sortedData);
    }

    setLoading(false);
  };

  // Position of each team in the Taça Disciplina, as team_id -> index.
  // Mirrors the ordering in hooks/liga/disciplina/useDisciplineData.js — the
  // regulation points at that classification, so the two must agree. Keep
  // them in sync until the comparison moves to utils/ (step 1.2.5).
  const buildDisciplineRank = (rows) => {
    const ordered = [...rows].sort((a, b) => {
      if (a.excluded && !b.excluded) return 1;
      if (!a.excluded && b.excluded) return -1;

      const hasMatchesA = a.matches_played > 0;
      const hasMatchesB = b.matches_played > 0;
      if (hasMatchesA && !hasMatchesB) return -1;
      if (!hasMatchesA && hasMatchesB) return 1;
      if (!hasMatchesA && !hasMatchesB) {
        return a.calculated_points - b.calculated_points;
      }

      // Fewer points per match is better (Disciplina, art. 10)
      return (
        a.calculated_points / a.matches_played -
        b.calculated_points / b.matches_played
      );
    });

    const rank = {};
    ordered.forEach((row, index) => {
      rank[row.team_id] = index;
    });
    return rank;
  };

  // Build head-to-head stats among a set of tied teams, using only the
  // matches played directly between them.
  const computeHeadToHead = (teamIds, matches) => {
    const idSet = new Set(teamIds);
    const stats = {};
    teamIds.forEach((id) => {
      stats[id] = { points: 0, goalDiff: 0 };
    });

    matches.forEach((match) => {
      const { home_team_id: h, away_team_id: a } = match;
      if (
        match.home_goals == null ||
        match.away_goals == null ||
        !idSet.has(h) ||
        !idSet.has(a)
      ) {
        return;
      }

      const hg = match.home_goals;
      const ag = match.away_goals;

      stats[h].goalDiff += hg - ag;
      stats[a].goalDiff += ag - hg;

      if (hg > ag) {
        stats[h].points += 3;
      } else if (hg < ag) {
        stats[a].points += 3;
      } else {
        stats[h].points += 1;
        stats[a].points += 1;
      }
    });

    return stats;
  };

  // Resolve order between two teams level on points, in the order the
  // Regulamento 2026/2027 sets out (Competições, art. 22):
  //   1) confronto direto
  //   2) diferença de golos
  //   3) melhor classificado na Taça Disciplina
  //   4) golos marcados
  //   5) golos sofridos
  // Beyond that the regulation hands it to the Direção, so the order is
  // left untouched. Away goals in the head-to-head, used until 2025/2026,
  // are no longer a criterion.
  const compareTiedTeams = (a, b, data, matches, rank) => {
    const tiedIds = data
      .filter(
        (t) =>
          t.points === a.points && !t.teams.excluded && t.matches_played > 0
      )
      .map((t) => t.team_id);

    // Teams that have not met yet both score zero here, so this falls
    // through to the goal difference — which is what decides most ties in
    // the first half of the season.
    if (tiedIds.length > 1 && matches.length) {
      const h2h = computeHeadToHead(tiedIds, matches);
      const sa = h2h[a.team_id];
      const sb = h2h[b.team_id];
      if (sa && sb) {
        if (sa.points !== sb.points) return sb.points - sa.points;
        if (sa.goalDiff !== sb.goalDiff) return sb.goalDiff - sa.goalDiff;
      }
    }

    const gdA = a.goals_for - a.goals_against;
    const gdB = b.goals_for - b.goals_against;
    if (gdA !== gdB) return gdB - gdA;

    // Only applied when both teams appear in the Taça Disciplina; a lower
    // index is a better position there.
    const rankA = rank?.[a.team_id];
    const rankB = rank?.[b.team_id];
    if (rankA != null && rankB != null && rankA !== rankB) {
      return rankA - rankB;
    }

    if (a.goals_for !== b.goals_for) return b.goals_for - a.goals_for;
    return a.goals_against - b.goals_against;
  };

  const sortClassification = (
    data,
    field,
    order,
    matches = leagueMatches,
    rank = disciplineRank
  ) => {
    return [...data].sort((a, b) => {
      // Excluded teams always go to bottom
      if (a.teams.excluded && !b.teams.excluded) return 1;
      if (!a.teams.excluded && b.teams.excluded) return -1;

      // Teams with 0 matches always go to bottom (but above excluded teams)
      if (a.matches_played === 0 && b.matches_played > 0) return 1;
      if (a.matches_played > 0 && b.matches_played === 0) return -1;

      let valueA, valueB;

      switch (field) {
        case "points":
          // When sorting by points, apply full tiebreaker logic
          if (a.points !== b.points) {
            return order === "desc" ? b.points - a.points : a.points - b.points;
          }
          // If points are equal, use head-to-head tiebreakers
          return compareTiedTeams(a, b, data, matches, rank);

        case "goals_for":
          valueA = a.goals_for;
          valueB = b.goals_for;
          break;
        case "goals_against":
          valueA = a.goals_against;
          valueB = b.goals_against;
          break;
        case "goal_difference":
          valueA = a.goals_for - a.goals_against;
          valueB = b.goals_for - b.goals_against;
          break;
        case "wins":
          valueA = a.wins;
          valueB = b.wins;
          break;
        case "draws":
          valueA = a.draws;
          valueB = b.draws;
          break;
        case "losses":
          valueA = a.losses;
          valueB = b.losses;
          break;
        case "matches_played":
          valueA = a.matches_played;
          valueB = b.matches_played;
          break;
        default:
          // Default sorting: Points → Head-to-head → overall fallbacks
          if (a.points !== b.points) return b.points - a.points;
          return compareTiedTeams(a, b, data, matches, rank);
      }

      if (order === "desc") {
        return valueB - valueA;
      } else {
        return valueA - valueB;
      }
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
      setClassification(
        sortClassification(
          classification,
          field,
          sortOrder === "desc" ? "asc" : "desc",
          leagueMatches
        )
      );
    } else {
      // New field, default to desc
      setSortBy(field);
      setSortOrder("desc");
      setClassification(
        sortClassification(classification, field, "desc", leagueMatches)
      );
    }
  };

  useEffect(() => {
    if (selectedSeason) {
      readClassification(selectedSeason);
    }
  }, [selectedSeason]);

  if (loading && seasons.length === 0) {
    return <LoadingSkeleton theme={theme} />;
  }

  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);

  // Determine if legend should show based on viewport
  const showLegend = isDesktop;
  const showStats = isDesktop;

  return (
    <div
      style={{
        padding: isMobile ? theme.spacing.md : theme.spacing.lg,
        minHeight: "100vh",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <ClassificationHeader
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        isMobile={isMobile}
        theme={theme}
        onOpenComparison={() => setComparisonModalOpen(true)}
      />

      {/* Legend - Hide on smaller screens */}
      {showLegend && <ClassificationLegend theme={theme} />}

      {/* Table or Empty State */}
      {loading ? (
        <LoadingSkeleton theme={theme} />
      ) : classification.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: theme.spacing["2xl"],
            backgroundColor: theme.colors.background.card,
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.lg,
          }}
        >
          <p
            style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
            }}
          >
            Ainda não há dados para a época {currentSeasonData?.description}
          </p>
        </div>
      ) : (
        <>
          <ClassificationTable
            classification={classification}
            selectedSeason={selectedSeason}
            isMobile={isMobile}
            router={router}
            theme={theme}
            formData={formData}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          {showStats && (
            <ClassificationStats
              classification={classification}
              theme={theme}
            />
          )}
        </>
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        open={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        classification={classification}
        selectedSeason={selectedSeason}
        theme={theme}
      />
    </div>
  );
};

export default Classification;
