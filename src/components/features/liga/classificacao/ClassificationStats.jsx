import React from "react";

/**
 * ClassificationStats Component
 * Displays summary statistics about the league
 *
 * @param {Array} classification - Classification data
 * @param {Object} theme - Theme object
 */
const ClassificationStats = ({ classification, theme }) => {
  const stats = [
    {
      title: "Total de Equipas",
      value: classification.filter((t) => !t.teams.excluded).length,
      icon: "⚽",
      color: theme.colors.primary[500],
    },
    {
      title: "Jogos Disputados",
      value: Math.max(...classification.map((t) => t.matches_played), 0),
      icon: "📊",
      color: theme.colors.accent[500],
    },
    {
      title: "Total de Golos",
      value: classification.reduce((sum, t) => sum + t.goals_for, 0),
      icon: "🥅",
      color: theme.colors.sports.goals,
    },
  ];

  return (
    <div
      style={{
        marginTop: theme.spacing.xl,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: theme.spacing.lg,
      }}
    >
      {stats.map((stat, index) => (
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
  );
};

export default ClassificationStats;
