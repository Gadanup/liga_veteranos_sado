import React from "react";

/**
 * ClassificationHeader Component
 * Displays the page title and season selector
 *
 * @param {Array} seasons - Available seasons
 * @param {number} selectedSeason - Currently selected season
 * @param {Function} onSeasonChange - Callback when season changes
 * @param {boolean} isMobile - Whether viewing on mobile
 * @param {Object} theme - Theme object
 */
const ClassificationHeader = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  isMobile,
  theme,
}) => {
  return (
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
          onChange={(e) => onSeasonChange(Number(e.target.value))}
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
  );
};

export default ClassificationHeader;
