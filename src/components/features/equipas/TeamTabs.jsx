import React, { useState } from "react";
import { Card, CardContent, Box, Tabs, Tab } from "@mui/material";
import { CalendarToday, Groups } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

// Sub-components
import CalendarTab from "./CalendarTab";
import SquadTab from "./SquadTab";

/**
 * TeamTabs Component
 * Container for Calendar and Squad tabs
 *
 * @param {Object} teamData - Team information
 * @param {Array} teamFixtures - List of team matches
 * @param {Array} players - List of team players
 */
const TeamTabs = ({ teamData, teamFixtures, players }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Card
      sx={{
        borderRadius: theme.borderRadius.xl,
        overflow: "hidden",
        border: `2px solid ${theme.colors.border.primary}`,
      }}
    >
      {/* Tabs Header */}
      <Box
        sx={{
          borderBottom: `1px solid ${theme.colors.border.primary}`,
          backgroundColor: theme.colors.background.tertiary,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.secondary,
              "&.Mui-selected": {
                color: theme.colors.primary[600],
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.colors.primary[600],
              height: 3,
            },
          }}
        >
          <Tab
            icon={<CalendarToday />}
            iconPosition="start"
            label="Calendário"
          />
          <Tab icon={<Groups />} iconPosition="start" label="Plantel" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <CardContent sx={{ p: 0 }}>
        {tabIndex === 0 && (
          <CalendarTab teamData={teamData} teamFixtures={teamFixtures} />
        )}
        {tabIndex === 1 && <SquadTab teamData={teamData} players={players} />}
      </CardContent>
    </Card>
  );
};

export default TeamTabs;
