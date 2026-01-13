import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { theme } from "../../../../styles/theme";

/**
 * GroupTabs Component
 * Tab navigation for switching between groups
 *
 * @param {string} activeGroup - Currently active group (A, B, C, etc.)
 * @param {Function} onGroupChange - Callback when group changes
 * @param {Array} groups - Array of available group names
 */
const GroupTabs = ({ activeGroup, onGroupChange, groups }) => {
  const handleChange = (event, newValue) => {
    onGroupChange(newValue);
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: theme.colors.border.primary,
        backgroundColor: theme.colors.background.card,
        borderRadius: `${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0`,
        boxShadow: theme.shadows.sm,
        overflow: "hidden",
      }}
    >
      <Tabs
        value={activeGroup}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: theme.colors.accent[500],
            height: 3,
          },
          "& .MuiTab-root": {
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.semibold,
            fontSize: theme.typography.fontSize.base,
            textTransform: "none",
            padding: theme.spacing.md,
            minHeight: 56,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.background.cardHover,
              color: theme.colors.primary[600],
            },
            "&.Mui-selected": {
              color: theme.colors.primary[600],
              fontWeight: theme.typography.fontWeight.bold,
            },
          },
        }}
      >
        {groups.map((group) => (
          <Tab
            key={group}
            label={`Grupo ${group}`}
            value={group}
            sx={{
              fontSize: {
                xs: theme.typography.fontSize.sm,
                sm: theme.typography.fontSize.base,
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default GroupTabs;
