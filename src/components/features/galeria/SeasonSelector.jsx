import React, { useState, useEffect } from "react";
import { theme } from "../../../styles/theme.js";

/**
 * SeasonSelector Component
 * Dropdown to select different seasons
 *
 * @param {Array} seasons - Array of season objects with id and description
 * @param {number} selectedSeason - Currently selected season ID
 * @param {Function} onSeasonChange - Callback when season is changed
 */
const SeasonSelector = ({ seasons, selectedSeason, onSeasonChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
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
        flexShrink: 0,
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
  );
};

export default SeasonSelector;
