"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "../../../components/ThemeWrapper";

// Components
import ClassificationHeader from "../../../components/features/liga/classificacao/ClassificationHeader";
import ClassificationLegend from "../../../components/features/liga/classificacao/ClassificationLegend";
import ClassificationTable from "../../../components/features/liga/classificacao/ClassificationTable";
import ClassificationStats from "../../../components/features/liga/classificacao/ClassificationStats";
import LoadingSkeleton from "../../../components/features/liga/classificacao/LoadingSkeleton";

const Classification = () => {
  const [classification, setClassification] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      const sortedData = classificationData.sort((a, b) => {
        if (a.teams.excluded && !b.teams.excluded) return 1;
        if (!a.teams.excluded && b.teams.excluded) return -1;

        const goalDifferenceA = a.goals_for - a.goals_against;
        const goalDifferenceB = b.goals_for - b.goals_against;

        if (a.points !== b.points) return b.points - a.points;
        if (goalDifferenceA !== goalDifferenceB)
          return goalDifferenceB - goalDifferenceA;
        return b.goals_for - a.goals_for;
      });

      setClassification(sortedData);
    }
    setLoading(false);
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

  return (
    <div style={{ padding: theme.spacing.lg, minHeight: "100vh" }}>
      {/* Header */}
      <ClassificationHeader
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        isMobile={isMobile}
        theme={theme}
      />

      {/* Legend */}
      {!isMobile && <ClassificationLegend theme={theme} />}

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
          />
          {!isMobile && (
            <ClassificationStats
              classification={classification}
              theme={theme}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Classification;
