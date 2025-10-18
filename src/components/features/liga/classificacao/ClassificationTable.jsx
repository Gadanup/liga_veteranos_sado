import React from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ClassificationRow from "./ClassificationRow";

/**
 * ClassificationTable Component with Sorting
 */
const ClassificationTable = ({
  classification,
  selectedSeason,
  isMobile,
  router,
  theme,
  formData,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === "desc" ? (
      <ArrowDownward sx={{ fontSize: 14, ml: 0.5 }} />
    ) : (
      <ArrowUpward sx={{ fontSize: 14, ml: 0.5 }} />
    );
  };

  const HeaderCell = ({ field, label, clickable = true }) => (
    <div
      onClick={() => clickable && onSort(field)}
      style={{
        textAlign: "center",
        cursor: clickable ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        userSelect: "none",
        ...(clickable && {
          "&:hover": {
            color: theme.colors.accent[300],
          },
        }),
      }}
      onMouseEnter={(e) => {
        if (clickable) {
          e.currentTarget.style.color = theme.colors.accent[300];
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = theme.colors.text.inverse;
      }}
    >
      {label}
      {clickable && <SortIcon field={field} />}
    </div>
  );

  return (
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
            : "50px 1fr 40px 40px 40px 40px 75px 50px 50px 120px",
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
        <HeaderCell field="matches_played" label="J" />
        <HeaderCell field="wins" label="V" />
        <HeaderCell field="draws" label="E" />
        <HeaderCell field="losses" label="D" />
        <HeaderCell field="goals_for" label={isMobile ? "G" : "GOLOS"} />
        {!isMobile && <HeaderCell field="goal_difference" label="DG" />}
        <HeaderCell field="points" label={isMobile ? "P" : "PTS"} />
        {!isMobile && <div style={{ textAlign: "center" }}>FORMA</div>}
      </div>

      {/* Table Body */}
      <div>
        {classification.map((team, index) => (
          <ClassificationRow
            key={team.team_id}
            team={team}
            position={index + 1}
            selectedSeason={selectedSeason}
            isMobile={isMobile}
            router={router}
            theme={theme}
            isEvenRow={index % 2 === 0}
            formData={formData[team.team_id] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassificationTable;
