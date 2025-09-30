"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "../../components/ThemeWrapper";

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

  // Fetch available seasons
  const fetchSeasons = async () => {
    const { data, error } = await supabase
      .from("seasons")
      .select("id, description, is_current")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching seasons:", error);
    } else {
      setSeasons(data);
      // Set the current season as default
      const currentSeason = data.find((s) => s.is_current);
      if (currentSeason) {
        setSelectedSeason(currentSeason.id);
      } else if (data.length > 0) {
        setSelectedSeason(data[0].id);
      }
    }
  };

  // Function to fetch and sort classification data
  const readClassification = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);
    const { data: classificationData, error } = await supabase
      .from("league_standings")
      .select(
        `
        team_id, 
        teams!league_standings_team_id_fkey (short_name, logo_url, excluded),
        matches_played,
        wins,
        draws,
        losses,
        goals_for,
        goals_against,
        points,
        season_year
      `
      )
      .eq("season_year", seasonId);

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      // Sort the classification
      const sortedData = classificationData.sort((a, b) => {
        // Always move excluded teams to the bottom
        if (a.teams.excluded && !b.teams.excluded) return 1;
        if (!a.teams.excluded && b.teams.excluded) return -1;

        // Sorting logic for non-excluded teams
        const goalDifferenceA = a.goals_for - a.goals_against;
        const goalDifferenceB = b.goals_for - b.goals_against;

        if (a.points !== b.points) {
          return b.points - a.points; // Higher points first
        } else if (goalDifferenceA !== goalDifferenceB) {
          return goalDifferenceB - goalDifferenceA; // Higher goal diff first
        } else {
          return b.goals_for - a.goals_for; // Higher goals scored first
        }
      });

      setClassification(sortedData);
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchSeasons();
  }, []);

  // Load classification when season changes
  useEffect(() => {
    if (selectedSeason) {
      readClassification(selectedSeason);
    }
  }, [selectedSeason]);

  const getPositionBadgeStyle = (position, isExcluded) => {
    if (isExcluded) {
      return {
        backgroundColor: theme.colors.error[100],
        color: theme.colors.error[700],
        border: `2px solid ${theme.colors.error[300]}`,
      };
    }

    if (position === 1) {
      return {
        backgroundColor: theme.colors.accent[500],
        color: theme.colors.neutral[900],
        border: `2px solid ${theme.colors.accent[600]}`,
        boxShadow: `0 0 20px ${theme.colors.accent[400]}`,
      };
    } else if (position <= 3) {
      return {
        backgroundColor: theme.colors.accent[100],
        color: theme.colors.accent[700],
        border: `2px solid ${theme.colors.accent[300]}`,
      };
    } else if (position <= 6) {
      return {
        backgroundColor: theme.colors.primary[100],
        color: theme.colors.primary[700],
        border: `2px solid ${theme.colors.primary[300]}`,
      };
    } else {
      return {
        backgroundColor: theme.colors.neutral[100],
        color: theme.colors.neutral[600],
        border: `2px solid ${theme.colors.neutral[300]}`,
      };
    }
  };

  const getGoalDifferenceColor = (goalDiff, isExcluded) => {
    if (isExcluded) return theme.colors.neutral[400];
    if (goalDiff > 0) return theme.colors.success[600];
    if (goalDiff < 0) return theme.colors.error[600];
    return theme.colors.neutral[500];
  };

  const LoadingSkeleton = () => (
    <div style={{ padding: theme.spacing.lg }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            height: "80px",
            backgroundColor: theme.colors.neutral[200],
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.md,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );

  if (loading && seasons.length === 0) {
    return <LoadingSkeleton />;
  }

  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);

  return (
    <div
      style={{
        padding: theme.spacing.lg,
        minHeight: "100vh",
      }}
    >
      {/* Header Section with Title and Season Selector */}
      <div
        style={{
          marginBottom: theme.spacing.xl,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "center" : "flex-start",
          gap: theme.spacing.lg,
        }}
      >
        {/* Title */}
        <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
          <h1
            style={{
              fontSize: isMobile
                ? theme.typography.fontSize["2xl"]
                : theme.typography.fontSize["3xl"],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.primary[600],
              margin: 0,
              marginBottom: theme.spacing.sm,
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            🏆 Classificação da Liga
          </h1>
        </div>

        {/* Season Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.background.card,
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.md,
            border: `2px solid ${theme.colors.primary[200]}`,
            minWidth: isMobile ? "auto" : "200px",
          }}
        >
          <label
            htmlFor="season-select"
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.secondary,
              whiteSpace: "nowrap",
            }}
          >
            Época:
          </label>
          <select
            id="season-select"
            value={selectedSeason || ""}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.primary[700],
              backgroundColor: "transparent",
              border: "none",
              borderRadius: theme.borderRadius.md,
              cursor: "pointer",
              outline: "none",
              transition: theme.transitions.normal,
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend - Hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.background.card,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.sm,
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: theme.colors.accent[500],
                borderRadius: theme.borderRadius.full,
              }}
            />
            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Campeão
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.background.card,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.sm,
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: theme.colors.accent[100],
                borderRadius: theme.borderRadius.full,
              }}
            />
            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Pódio
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.background.card,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.sm,
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: theme.colors.primary[100],
                borderRadius: theme.borderRadius.full,
              }}
            />
            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Top 6
            </span>
          </div>
        </div>
      )}

      {/* Loading indicator while fetching classification */}
      {loading ? (
        <LoadingSkeleton />
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
          {/* Classification Table */}
          <div
            style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.shadows.lg,
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                background: theme.colors.themed.purpleGradient,
                color: theme.colors.text.inverse,
                padding: isMobile
                  ? `${theme.spacing.sm} ${theme.spacing.xs}`
                  : theme.spacing.md,
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "35px 1fr 35px 35px 35px 35px 45px 35px"
                  : "50px 1fr 40px 40px 40px 40px 75px 50px 50px",
                gap: isMobile ? "4px" : theme.spacing.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
                alignItems: "center",
                minHeight: isMobile ? "40px" : "50px",
              }}
            >
              <div style={{ textAlign: "center" }}>POS</div>
              <div style={{ paddingLeft: isMobile ? "4px" : "8px" }}>
                {isMobile ? "TEAM" : "EQUIPA"}
              </div>
              <div style={{ textAlign: "center" }}>J</div>
              <div style={{ textAlign: "center" }}>V</div>
              <div style={{ textAlign: "center" }}>E</div>
              <div style={{ textAlign: "center" }}>D</div>
              <div style={{ textAlign: "center" }}>
                {isMobile ? "G" : "GOLOS"}
              </div>
              {!isMobile && <div style={{ textAlign: "center" }}>DG</div>}
              <div style={{ textAlign: "center" }}>
                {isMobile ? "P" : "PTS"}
              </div>
            </div>

            {/* Table Body */}
            <div>
              {classification.map((team, index) => {
                const position = index + 1;
                const goalDiff = team.goals_for - team.goals_against;
                const isExcluded = team.teams.excluded;

                return (
                  <div
                    key={team.team_id}
                    onClick={() =>
                      router.push(
                        `/equipas/${team.teams.short_name}?season=${selectedSeason}`
                      )
                    }
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "35px 1fr 35px 35px 35px 35px 45px 35px"
                        : "50px 1fr 40px 40px 40px 40px 75px 50px 50px",
                      gap: isMobile ? "4px" : theme.spacing.sm,
                      padding: isMobile
                        ? `${theme.spacing.sm} ${theme.spacing.xs}`
                        : theme.spacing.md,
                      alignItems: "center",
                      borderBottom: `1px solid ${theme.colors.border.primary}`,
                      cursor: "pointer",
                      transition: theme.transitions.normal,
                      backgroundColor: isExcluded
                        ? theme.colors.error[50]
                        : index % 2 === 0
                          ? theme.colors.background.card
                          : theme.colors.background.tertiary,
                      minHeight: isMobile ? "55px" : "60px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme.colors.primary[50];
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = theme.shadows.md;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isExcluded
                        ? theme.colors.error[50]
                        : index % 2 === 0
                          ? theme.colors.background.card
                          : theme.colors.background.tertiary;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Position Badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: isMobile ? "28px" : "35px",
                          height: isMobile ? "28px" : "35px",
                          borderRadius: theme.borderRadius.full,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isMobile
                            ? "11px"
                            : theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.bold,
                          ...getPositionBadgeStyle(position, isExcluded),
                        }}
                      >
                        {position}
                      </div>
                    </div>

                    {/* Team Info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: isMobile ? "6px" : theme.spacing.sm,
                        overflow: "hidden",
                        paddingLeft: isMobile ? "4px" : "8px",
                      }}
                    >
                      <div
                        style={{
                          width: isMobile ? "32px" : "36px",
                          height: isMobile ? "32px" : "36px",
                          borderRadius: theme.borderRadius.md,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: theme.colors.background.tertiary,
                          boxShadow: theme.shadows.sm,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={team.teams.logo_url}
                          alt={`${team.teams.short_name} logo`}
                          style={{
                            width: isMobile ? "26px" : "30px",
                            height: isMobile ? "26px" : "30px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          overflow: "hidden",
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile
                              ? "12px"
                              : theme.typography.fontSize.base,
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: isExcluded
                              ? theme.colors.text.tertiary
                              : theme.colors.text.primary,
                            fontFamily: theme.typography.fontFamily.primary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: "1.3",
                          }}
                        >
                          {team.teams.short_name}
                        </div>
                        {isExcluded && !isMobile && (
                          <div
                            style={{
                              fontSize: theme.typography.fontSize.xs,
                              color: theme.colors.error[600],
                              fontWeight: theme.typography.fontWeight.medium,
                              lineHeight: "1",
                            }}
                          >
                            Excluído
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: isMobile
                          ? "11px"
                          : theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: isExcluded
                          ? theme.colors.text.tertiary
                          : theme.colors.text.primary,
                      }}
                    >
                      {isExcluded ? "-" : team.matches_played}
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: isMobile
                          ? "11px"
                          : theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: isExcluded
                          ? theme.colors.text.tertiary
                          : theme.colors.sports.win,
                      }}
                    >
                      {isExcluded ? "-" : team.wins}
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: isMobile
                          ? "11px"
                          : theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: isExcluded
                          ? theme.colors.text.tertiary
                          : theme.colors.sports.draw,
                      }}
                    >
                      {isExcluded ? "-" : team.draws}
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: isMobile
                          ? "11px"
                          : theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: isExcluded
                          ? theme.colors.text.tertiary
                          : theme.colors.sports.loss,
                      }}
                    >
                      {isExcluded ? "-" : team.losses}
                    </div>

                    {/* Goals */}
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: isMobile
                          ? "11px"
                          : theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: isExcluded
                          ? theme.colors.text.tertiary
                          : theme.colors.text.primary,
                      }}
                    >
                      {isExcluded ? (
                        "-"
                      ) : (
                        <span>
                          <span
                            style={{
                              fontWeight: theme.typography.fontWeight.bold,
                              color: theme.colors.sports.goals,
                            }}
                          >
                            {team.goals_for}
                          </span>
                          <span
                            style={{
                              color: theme.colors.text.tertiary,
                              margin: "0 1px",
                            }}
                          >
                            :
                          </span>
                          <span
                            style={{
                              fontWeight: theme.typography.fontWeight.bold,
                              color: theme.colors.error[600],
                            }}
                          >
                            {team.goals_against}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Goal Difference - Desktop only */}
                    {!isMobile && (
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.bold,
                          color: getGoalDifferenceColor(goalDiff, isExcluded),
                        }}
                      >
                        {isExcluded
                          ? "-"
                          : goalDiff > 0
                            ? `+${goalDiff}`
                            : goalDiff}
                      </div>
                    )}

                    {/* Points */}
                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          padding: isMobile
                            ? "3px 6px"
                            : `${theme.spacing.xs} ${theme.spacing.sm}`,
                          borderRadius: theme.borderRadius.md,
                          backgroundColor: isExcluded
                            ? theme.colors.neutral[200]
                            : theme.colors.accent[100],
                          color: isExcluded
                            ? theme.colors.text.tertiary
                            : theme.colors.accent[700],
                          fontSize: isMobile
                            ? "11px"
                            : theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.bold,
                          minWidth: isMobile ? "25px" : "30px",
                          lineHeight: "1.2",
                        }}
                      >
                        {isExcluded ? "-" : team.points}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Stats - Hidden on mobile */}
          {!isMobile && (
            <div
              style={{
                marginTop: theme.spacing.xl,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: theme.spacing.lg,
              }}
            >
              {[
                {
                  title: "Total de Equipas",
                  value: classification.filter((t) => !t.teams.excluded).length,
                  icon: "⚽",
                  color: theme.colors.primary[500],
                },
                {
                  title: "Jogos Disputados",
                  value: Math.max(
                    ...classification.map((t) => t.matches_played),
                    0
                  ),
                  icon: "📊",
                  color: theme.colors.accent[500],
                },
                {
                  title: "Total de Golos",
                  value: classification.reduce(
                    (sum, t) => sum + t.goals_for,
                    0
                  ),
                  icon: "🥅",
                  color: theme.colors.sports.goals,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: theme.colors.background.card,
                    padding: theme.spacing.lg,
                    borderRadius: theme.borderRadius.xl,
                    boxShadow: theme.shadows.md,
                    textAlign: "center",
                    border: `1px solid ${theme.colors.border.primary}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.typography.fontSize["2xl"],
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize["2xl"],
                      fontWeight: theme.typography.fontWeight.bold,
                      color: stat.color,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                  >
                    {stat.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Classification;
