import React from "react";

/**
 * ClassificationLegend Component
 * Displays color legend for position badges
 *
 * @param {Object} theme - Theme object
 */
const ClassificationLegend = ({ theme }) => {
  const legendItems = [
    {
      label: "Campeão",
      color: theme.colors.accent[500],
    },
    {
      label: "Pódio",
      color: theme.colors.accent[100],
    },
    {
      label: "Top 6",
      color: theme.colors.primary[100],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
      }}
    >
      {legendItems.map((item, index) => (
        <div
          key={index}
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
              backgroundColor: item.color,
              borderRadius: theme.borderRadius.full,
            }}
          />
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ClassificationLegend;
