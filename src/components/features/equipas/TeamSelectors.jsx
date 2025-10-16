import React from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  Avatar,
  Chip,
} from "@mui/material";
import { CalendarToday, Groups } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

/**
 * TeamSelectors Component
 * Displays season and team selector dropdowns with enhanced styling
 *
 * @param {Array} seasons - Array of season objects
 * @param {number} selectedSeason - Currently selected season ID
 * @param {Function} onSeasonChange - Callback when season changes
 * @param {Array} teams - Array of team objects for the selected season
 * @param {string} selectedTeam - Currently selected team short_name
 * @param {Function} onTeamChange - Callback when team changes
 */
const TeamSelectors = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  teams,
  selectedTeam,
  onTeamChange,
}) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      gap={2}
      mb={4}
      justifyContent="flex-end"
    >
      {/* Season Selector */}
      <FormControl
        sx={{
          minWidth: isMobile ? "100%" : 200,
        }}
      >
        <Select
          value={selectedSeason || ""}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          displayEmpty
          startAdornment={
            <CalendarToday
              sx={{
                mr: 1,
                fontSize: 20,
                color: theme.colors.primary[600],
              }}
            />
          }
          sx={{
            backgroundColor: theme.colors.background.card,
            borderRadius: "12px",
            border: `2px solid ${theme.colors.primary[200]}`,
            boxShadow: theme.components.card.shadow,
            fontWeight: 600,
            color: theme.colors.primary[700],
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover": {
              backgroundColor: theme.colors.background.card,
              border: `2px solid ${theme.colors.primary[300]}`,
            },
            "&.Mui-focused": {
              backgroundColor: theme.colors.background.card,
              border: `2px solid ${theme.colors.primary[500]}`,
            },
            "& .MuiSelect-select": {
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: `1px solid ${theme.colors.border.primary}`,
                mt: 1,
                maxHeight: 300,
                "& .MuiMenuItem-root": {
                  py: 1.5,
                  px: 2,
                  borderRadius: "8px",
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    backgroundColor: theme.colors.primary[50],
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.colors.primary[100],
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: theme.colors.primary[150],
                    },
                  },
                },
              },
            },
          }}
        >
          {seasons.map((season) => (
            <MenuItem key={season.id} value={season.id}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box>
                  <Box
                    sx={{
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Época {season.description}
                  </Box>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Team Selector */}
      <FormControl
        sx={{
          minWidth: isMobile ? "100%" : 250,
        }}
      >
        <Select
          value={selectedTeam || ""}
          onChange={(e) => onTeamChange(e.target.value)}
          displayEmpty
          startAdornment={
            <Groups
              sx={{
                mr: 1,
                fontSize: 20,
                color: theme.colors.accent[600],
              }}
            />
          }
          renderValue={(selected) => {
            const team = teams.find((t) => t.short_name === selected);
            if (!team) return "Selecione uma equipa";

            return (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  src={team.logo_url}
                  alt={team.short_name}
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
                <Box
                  sx={{
                    fontWeight: 600,
                    color: theme.colors.primary[700],
                  }}
                >
                  {team.short_name}
                </Box>
              </Box>
            );
          }}
          sx={{
            backgroundColor: theme.colors.background.card,
            borderRadius: "12px",
            border: `2px solid ${theme.colors.accent[200]}`,
            boxShadow: theme.components.card.shadow,
            fontWeight: 600,
            color: theme.colors.primary[700],
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover": {
              backgroundColor: theme.colors.background.card,
              border: `2px solid ${theme.colors.accent[300]}`,
            },
            "&.Mui-focused": {
              backgroundColor: theme.colors.background.card,
              border: `2px solid ${theme.colors.accent[500]}`,
            },
            "& .MuiSelect-select": {
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: `1px solid ${theme.colors.border.primary}`,
                mt: 1,
                maxHeight: 400,
                "& .MuiMenuItem-root": {
                  py: 1.5,
                  px: 2,
                  borderRadius: "8px",
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    backgroundColor: theme.colors.accent[50],
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.colors.accent[100],
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: theme.colors.accent[150],
                    },
                  },
                },
              },
            },
          }}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.short_name}>
              <Box display="flex" alignItems="center" gap={1.5} width="100%">
                <Avatar
                  src={team.logo_url}
                  alt={team.short_name}
                  sx={{
                    width: 32,
                    height: 32,
                    border: `2px solid ${theme.colors.border.primary}`,
                  }}
                />
                <Box
                  sx={{
                    fontWeight: 600,
                    color: theme.colors.text.primary,
                    flex: 1,
                  }}
                >
                  {team.short_name}
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TeamSelectors;
