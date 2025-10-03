import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
} from "@mui/material";
import { Search, EmojiEvents, FilterList } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * GoalscorersFilters Component
 * Search, team filter, and view mode controls
 *
 * @param {string} searchTerm - Current search term
 * @param {Function} onSearchChange - Callback when search changes
 * @param {string} teamFilter - Current team filter
 * @param {Function} onTeamFilterChange - Callback when team filter changes
 * @param {Array} teams - Available teams
 * @param {string} viewMode - Current view mode (podium/list)
 * @param {Function} onViewModeChange - Callback when view mode changes
 * @param {number} resultsCount - Number of filtered results
 * @param {boolean} isMobile - Whether viewing on mobile
 */
const GoalscorersFilters = ({
  searchTerm,
  onSearchChange,
  teamFilter,
  onTeamFilterChange,
  teams,
  viewMode,
  onViewModeChange,
  resultsCount,
  isMobile,
}) => {
  return (
    <Box
      sx={{
        background: theme.colors.background.card,
        padding: isMobile ? 2 : 3,
        borderRadius: "20px",
        border: `2px solid ${theme.colors.border.purple}`,
        boxShadow: theme.components.card.shadow,
        marginBottom: 4,
      }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
        alignItems={isMobile ? "stretch" : "center"}
      >
        {/* Search Field */}
        <TextField
          fullWidth={isMobile}
          sx={{ flex: isMobile ? 1 : 2 }}
          placeholder="Procurar jogador..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.colors.primary[600] }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "12px" },
          }}
        />

        {/* Team Filter */}
        <FormControl sx={{ minWidth: isMobile ? "100%" : 200 }}>
          <InputLabel>Filtrar por Equipa</InputLabel>
          <Select
            value={teamFilter}
            onChange={(e) => onTeamFilterChange(e.target.value)}
            label="Filtrar por Equipa"
            sx={{ borderRadius: "12px" }}
          >
            <MenuItem value="">Todas as Equipas</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.short_name}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={team.logo_url}
                    alt={team.short_name}
                    sx={{ width: 24, height: 24 }}
                  />
                  {team.short_name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* View Toggle */}
        <Box display="flex" gap={1}>
          <Chip
            icon={<EmojiEvents />}
            label="Pódio"
            clickable
            onClick={() => onViewModeChange("podium")}
            sx={{
              backgroundColor:
                viewMode === "podium"
                  ? theme.colors.primary[600]
                  : theme.colors.background.secondary,
              color:
                viewMode === "podium" ? "white" : theme.colors.text.primary,
              "& .MuiChip-icon": {
                color:
                  viewMode === "podium" ? "white" : theme.colors.text.primary,
              },
            }}
          />
          <Chip
            icon={<FilterList />}
            label="Lista"
            clickable
            onClick={() => onViewModeChange("list")}
            sx={{
              backgroundColor:
                viewMode === "list"
                  ? theme.colors.primary[600]
                  : theme.colors.background.secondary,
              color: viewMode === "list" ? "white" : theme.colors.text.primary,
              "& .MuiChip-icon": {
                color:
                  viewMode === "list" ? "white" : theme.colors.text.primary,
              },
            }}
          />
        </Box>
      </Box>

      {/* Results Count */}
      <Typography
        variant="body2"
        sx={{
          color: theme.colors.text.secondary,
          marginTop: 2,
          textAlign: "center",
        }}
      >
        {resultsCount}{" "}
        {resultsCount === 1 ? "jogador encontrado" : "jogadores encontrados"}
      </Typography>
    </Box>
  );
};

export default GoalscorersFilters;
