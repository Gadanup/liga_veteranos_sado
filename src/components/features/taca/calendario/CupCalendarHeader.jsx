import React from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import { EmojiEvents, Add, CalendarToday } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * CupCalendarHeader Component
 * Header for Cup calendar page with season selector, create match button, and group filter
 *
 * @param {Array} seasons - Available seasons
 * @param {number} selectedSeason - Currently selected season
 * @param {Function} onSeasonChange - Callback when season changes
 * @param {boolean} isAdmin - Whether user is admin
 * @param {Function} onCreateMatch - Callback to open create match dialog
 * @param {boolean} isGroupStageMode - Whether current season has group stage
 * @param {string} activeFilter - Current filter (e.g., 'all', 'groupA', 'finalFour')
 */
const CupCalendarHeader = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  isAdmin,
  onCreateMatch,
  isGroupStageMode = false,
  activeFilter = "all",
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Get filter label
  const getFilterLabel = () => {
    switch (activeFilter) {
      case "all":
        return "Todos os Jogos";
      case "groupA":
        return "Grupo A";
      case "groupB":
        return "Grupo B";
      case "groupC":
        return "Grupo C";
      case "finalFour":
        return "Final Four";
      case "knockout":
        return "Eliminatórias";
      default:
        return "Todos os Jogos";
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems={isMobile ? "center" : "flex-start"}
      gap={2}
      mb={4}
    >
      {/* Title Section */}
      <Box flex={1} textAlign={isMobile ? "center" : "left"}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={isMobile ? "center" : "flex-start"}
          gap={2}
          mb={1}
        >
          <EmojiEvents sx={{ fontSize: 32, color: theme.colors.accent[500] }} />
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: "bold",
              fontSize: { xs: "24px", md: "32px" },
            }}
          >
            Calendário da Taça
          </Typography>
        </Box>

        {/* Yellow underline */}
        <Box
          sx={{
            width: "60px",
            height: "4px",
            backgroundColor: theme.colors.accent[500],
            margin: isMobile ? "0 auto" : "0",
            borderRadius: "2px",
          }}
        />

        {/* Mode Badge */}
        {isGroupStageMode && (
          <Box mt={2}>
            <Chip
              label="Fase de Grupos Ativa"
              size="small"
              sx={{
                backgroundColor: `${theme.colors.success[500]}20`,
                color: theme.colors.success[700],
                fontWeight: theme.typography.fontWeight.semibold,
                border: `1px solid ${theme.colors.success[500]}`,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Actions Container */}
      <Box
        display="flex"
        gap={2}
        flexDirection={isMobile ? "column" : "row"}
        alignItems="center"
      >
        {/* Season Selector */}
        <FormControl sx={{ minWidth: isMobile ? "100%" : 200 }}>
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
              boxShadow: theme.shadows.md,
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
                    {season.cup_group_stage && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.success[600],
                          fontSize: "11px",
                        }}
                      >
                        Com Fase de Grupos
                      </Typography>
                    )}
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Create Match Button (Admin Only) */}
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateMatch}
            sx={{
              backgroundColor: theme.colors.primary[600],
              "&:hover": {
                backgroundColor: theme.colors.primary[700],
              },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "12px",
              minWidth: isMobile ? "100%" : "auto",
            }}
          >
            Criar Jogo
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CupCalendarHeader;
