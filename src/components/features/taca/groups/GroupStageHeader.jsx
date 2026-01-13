import React from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../../styles/theme";

/**
 * GroupStageHeader Component
 * Header for the group stage view with season selector
 *
 * @param {Array} seasons - Available seasons
 * @param {number} selectedSeason - Currently selected season
 * @param {Function} onSeasonChange - Callback when season changes
 */
const GroupStageHeader = ({ seasons, selectedSeason, onSeasonChange }) => {
  return (
    <Box
      sx={{
        marginBottom: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 2,
      }}
    >
      {/* Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <EmojiEvents
          sx={{
            fontSize: 40,
            color: theme.colors.accent[500],
          }}
        />
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              fontSize: { xs: "24px", md: "32px" },
            }}
          >
            Taça - Fase de Grupos
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              marginTop: 0.5,
            }}
          >
            Classificação e jogos dos grupos
          </Typography>
        </Box>
      </Box>

      {/* Season Selector */}
      {seasons && seasons.length > 0 && (
        <FormControl
          sx={{
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: theme.borderRadius.lg,
              backgroundColor: theme.colors.background.card,
              "&:hover": {
                backgroundColor: theme.colors.background.cardHover,
              },
              "&.Mui-focused": {
                backgroundColor: theme.colors.background.card,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.colors.primary[600],
                  borderWidth: 2,
                },
              },
            },
          }}
        >
          <Select
            value={selectedSeason || ""}
            onChange={(e) => onSeasonChange(e.target.value)}
            displayEmpty
            sx={{
              "& .MuiSelect-select": {
                padding: "12px 16px",
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              },
            }}
          >
            {seasons.map((season) => (
              <MenuItem
                key={season.id}
                value={season.id}
                sx={{
                  fontWeight: season.is_current
                    ? theme.typography.fontWeight.bold
                    : theme.typography.fontWeight.normal,
                  color: season.is_current
                    ? theme.colors.primary[600]
                    : theme.colors.text.primary,
                  "&:hover": {
                    backgroundColor: theme.colors.primary[50],
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.colors.primary[100],
                    "&:hover": {
                      backgroundColor: theme.colors.primary[200],
                    },
                  },
                }}
              >
                {season.description}
                {season.is_current && " (Atual)"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default GroupStageHeader;
