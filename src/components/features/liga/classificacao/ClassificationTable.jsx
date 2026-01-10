import React from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ClassificationRow from "./ClassificationRow";

/**
 * ClassificationTable Component with Improved Responsive Design
 *
 * Breakpoints:
 * - xs: < 600px (mobile)
 * - sm: 600-899px (tablet portrait / small windows)
 * - md: 900-1199px (tablet landscape / medium windows)
 * - lg: 1200px+ (desktop)
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
  viewportWidth = 1200, // Pass this from parent
}) => {
  // Determine layout based on viewport width
  const getLayout = () => {
    if (viewportWidth < 600) {
      return "xs"; // Mobile
    } else if (viewportWidth < 900) {
      return "sm"; // Tablet portrait / Small window
    } else if (viewportWidth < 1200) {
      return "md"; // Tablet landscape / Medium window
    } else {
      return "lg"; // Desktop
    }
  };

  const layout = getLayout();

  // Define grid templates for different layouts
  const gridTemplates = {
    xs: {
      header: "35px 50px 35px 35px 35px 35px 45px 35px",
      columns: 8,
      showLogo: false,
      showGoalDiff: false,
      showForm: false,
      fontSize: "11px",
      padding: "8px 4px",
      gap: "4px",
    },
    sm: {
      header: "40px minmax(120px, 1fr) 40px 40px 40px 40px 60px 40px",
      columns: 8,
      showLogo: true,
      showGoalDiff: false,
      showForm: false,
      fontSize: "12px",
      padding: "10px 8px",
      gap: "8px",
    },
    md: {
      header: "45px minmax(150px, 2fr) 45px 45px 45px 45px 70px 50px 50px",
      columns: 9,
      showLogo: true,
      showGoalDiff: true,
      showForm: false,
      fontSize: "13px",
      padding: "12px",
      gap: "10px",
    },
    lg: {
      header:
        "50px minmax(180px, 2fr) 40px 40px 40px 40px 75px 50px 50px 120px",
      columns: 10,
      showLogo: true,
      showGoalDiff: true,
      showForm: true,
      fontSize: "15px",
      padding: "16px",
      gap: "12px",
    },
  };

  const currentLayout = gridTemplates[layout];

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
        fontSize: currentLayout.fontSize,
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
        width: "100%",
      }}
    >
      {/* Table Header */}
      <div
        style={{
          background: theme.colors.themed.purpleGradient,
          color: theme.colors.text.inverse,
          padding: currentLayout.padding,
          display: "grid",
          gridTemplateColumns: currentLayout.header,
          gap: currentLayout.gap,
          fontWeight: theme.typography.fontWeight.semibold,
          fontSize: currentLayout.fontSize,
          alignItems: "center",
          minHeight: layout === "xs" ? "40px" : "50px",
        }}
      >
        <div style={{ textAlign: "center" }}>POS</div>

        <div style={{ paddingLeft: layout === "xs" ? "4px" : "8px" }}>
          {layout === "xs" ? "TEAM" : "EQUIPA"}
        </div>

        <HeaderCell field="matches_played" label="J" />
        <HeaderCell field="wins" label="V" />
        <HeaderCell field="draws" label="E" />
        <HeaderCell field="losses" label="D" />
        <HeaderCell field="goals_for" label={layout === "xs" ? "G" : "GOLOS"} />

        {currentLayout.showGoalDiff && (
          <HeaderCell field="goal_difference" label="DG" />
        )}

        <HeaderCell field="points" label={layout === "xs" ? "P" : "PTS"} />

        {currentLayout.showForm && (
          <div style={{ textAlign: "center" }}>FORMA</div>
        )}
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
            layout={layout}
            layoutConfig={currentLayout}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassificationTable;
