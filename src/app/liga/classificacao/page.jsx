"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const theme = useTheme();

  // Check viewport size with debounce
  const updateViewportDimensions = useCallback(() => {
    setViewportWidth(window.innerWidth);
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    // Initial check
    updateViewportDimensions();

    // Debounced resize handler
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewportDimensions, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateViewportDimensions]);

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

  // Fetch form data (last 5 matches for each team)
  const fetchFormData = async (seasonId) => {
    const { data: matches, error } = await supabase
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

    if (!error && matches) {
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

      setFormData(formByTeam);
    }
  };

  // Fetch classification
  const readClassification = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);
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
        sortOrder
      );
      setClassification(sortedData);
    }

    // Fetch form data
    await fetchFormData(seasonId);

    setLoading(false);
  };

  const sortClassification = (data, field, order) => {
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
          // If points are equal, use tiebreakers
          const gdA = a.goals_for - a.goals_against;
          const gdB = b.goals_for - b.goals_against;
          if (gdA !== gdB) return gdB - gdA;
          if (a.goals_for !== b.goals_for) return b.goals_for - a.goals_for;
          if (a.matches_played !== b.matches_played)
            return b.matches_played - a.matches_played;
          return 0;

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
          // Default sorting: Points → Goal Difference → Goals For → Matches Played
          if (a.points !== b.points) return b.points - a.points;
          const gdA_default = a.goals_for - a.goals_against;
          const gdB_default = b.goals_for - b.goals_against;
          if (gdA_default !== gdB_default) return gdB_default - gdA_default;
          if (a.goals_for !== b.goals_for) return b.goals_for - a.goals_for;
          if (a.matches_played !== b.matches_played)
            return b.matches_played - a.matches_played;
          return 0;
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
          sortOrder === "desc" ? "asc" : "desc"
        )
      );
    } else {
      // New field, default to desc
      setSortBy(field);
      setSortOrder("desc");
      setClassification(sortClassification(classification, field, "desc"));
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
  const showLegend = viewportWidth >= 900;
  const showStats = viewportWidth >= 900;

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
            viewportWidth={viewportWidth}
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
