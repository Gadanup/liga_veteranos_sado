import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";

/**
 * ClassificationRow Component with Form Guide
 */
const ClassificationRow = ({
  team,
  position,
  selectedSeason,
  isMobile,
  router,
  theme,
  isEvenRow,
  formData = [],
}) => {
  const [hoveredForm, setHoveredForm] = useState(null);
  const goalDiff = team.goals_for - team.goals_against;
  const isExcluded = team.teams.excluded;

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

  const getFormColor = (result) => {
    switch (result) {
      case "W":
        return theme.colors.sports.win;
      case "L":
        return theme.colors.sports.loss;
      case "D":
        return theme.colors.sports.draw;
      default:
        return theme.colors.neutral[300];
    }
  };

  const FormCircle = ({ match, index }) => {
    if (!match) {
      return (
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: theme.colors.neutral[200],
            border: `1px solid ${theme.colors.neutral[300]}`,
          }}
        />
      );
    }

    return (
      <Tooltip
        title={
          <div style={{ textAlign: "center", padding: "4px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
              {match.result === "W"
                ? "Vitória"
                : match.result === "L"
                  ? "Derrota"
                  : "Empate"}
            </div>
            <div style={{ fontSize: "11px" }}>vs {match.opponent}</div>
            <div style={{ fontSize: "11px" }}>{match.score}</div>
            <div style={{ fontSize: "10px", opacity: 0.8 }}>
              {dayjs(match.date).format("DD/MM/YYYY")}
            </div>
          </div>
        }
        arrow
        placement="top"
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: getFormColor(match.result),
            border: `2px solid ${getFormColor(match.result)}`,
            cursor: "pointer",
            transition: "all 0.2s",
            transform: hoveredForm === index ? "scale(1.3)" : "scale(1)",
          }}
          onMouseEnter={() => setHoveredForm(index)}
          onMouseLeave={() => setHoveredForm(null)}
        />
      </Tooltip>
    );
  };

  return (
    <div
      onClick={() =>
        router.push(
          `/equipas/${team.teams.short_name}?season=${selectedSeason}`
        )
      }
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "35px 1fr 35px 35px 35px 35px 45px 35px"
          : "50px 1fr 40px 40px 40px 40px 75px 50px 50px 120px",
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
          : isEvenRow
            ? theme.colors.background.card
            : theme.colors.background.tertiary,
        minHeight: isMobile ? "55px" : "60px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.primary[50];
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isExcluded
          ? theme.colors.error[50]
          : isEvenRow
            ? theme.colors.background.card
            : theme.colors.background.tertiary;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Position Badge */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: isMobile ? "28px" : "35px",
            height: isMobile ? "28px" : "35px",
            borderRadius: theme.borderRadius.full,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
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
        <div style={{ overflow: "hidden", minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: isMobile ? "12px" : theme.typography.fontSize.base,
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

      {/* Stats - Matches Played */}
      <div
        style={{
          textAlign: "center",
          fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: isExcluded
            ? theme.colors.text.tertiary
            : theme.colors.text.primary,
        }}
      >
        {team.matches_played}
      </div>

      {/* Wins */}
      <div
        style={{
          textAlign: "center",
          fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.bold,
          color: isExcluded
            ? theme.colors.text.tertiary
            : theme.colors.sports.win,
        }}
      >
        {team.wins}
      </div>

      {/* Draws */}
      <div
        style={{
          textAlign: "center",
          fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.bold,
          color: isExcluded
            ? theme.colors.text.tertiary
            : theme.colors.sports.draw,
        }}
      >
        {team.draws}
      </div>

      {/* Losses */}
      <div
        style={{
          textAlign: "center",
          fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.bold,
          color: isExcluded
            ? theme.colors.text.tertiary
            : theme.colors.sports.loss,
        }}
      >
        {team.losses}
      </div>

      {/* Goals */}
      <div
        style={{
          textAlign: "center",
          fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: isExcluded
            ? theme.colors.text.tertiary
            : theme.colors.text.primary,
        }}
      >
        <span>
          <span
            style={{
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.sports.goals,
            }}
          >
            {team.goals_for}
          </span>
          <span style={{ color: theme.colors.text.tertiary, margin: "0 1px" }}>
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
          {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
        </div>
      )}

      {/* Points */}
      <div style={{ textAlign: "center" }}>
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
            fontSize: isMobile ? "11px" : theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.bold,
            minWidth: isMobile ? "25px" : "30px",
            lineHeight: "1.2",
          }}
        >
          {team.points}
        </div>
      </div>

      {/* Form Guide - Desktop only */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <FormCircle key={index} match={formData[index]} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassificationRow;
