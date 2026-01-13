import React from "react";
import { Box } from "@mui/material";
import { theme } from "../../../../styles/theme";

/**
 * SeasonSelector Component
 * Matches design pattern from jogos/SeasonSelector
 * Simple, clean dropdown with card background
 *
 * @param {Array} seasons - Array of season objects
 * @param {number} selectedSeason - Currently selected season ID
 * @param {Function} onSeasonChange - Callback when season changes
 * @param {boolean} showLabel - Whether to show "Época:" label
 */
const SeasonSelector = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  showLabel = true,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  if (!seasons || seasons.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
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
      {showLabel && (
        <label
          htmlFor="season-select-cup"
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.secondary,
            whiteSpace: "nowrap",
          }}
        >
          Época:
        </label>
      )}
      <select
        id="season-select-cup"
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
            {season.is_current ? " ⭐" : ""}
          </option>
        ))}
      </select>
    </Box>
  );
};

export default SeasonSelector;
