import React from "react";
import ClassificationRow from "./ClassificationRow";

/**
 * ClassificationTable Component
 * Displays the standings table with header and rows
 *
 * @param {Array} classification - Classification data
 * @param {number} selectedSeason - Currently selected season
 * @param {boolean} isMobile - Whether viewing on mobile
 * @param {Object} router - Next.js router
 * @param {Object} theme - Theme object
 */
const ClassificationTable = ({
  classification,
  selectedSeason,
  isMobile,
  router,
  theme,
}) => {
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
        <div style={{ textAlign: "center" }}>{isMobile ? "G" : "GOLOS"}</div>
        {!isMobile && <div style={{ textAlign: "center" }}>DG</div>}
        <div style={{ textAlign: "center" }}>{isMobile ? "P" : "PTS"}</div>
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
          />
        ))}
      </div>
    </div>
  );
};

export default ClassificationTable;
