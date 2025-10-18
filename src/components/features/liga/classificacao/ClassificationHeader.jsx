import React from "react";
import {
  Select,
  MenuItem,
  Box,
  Chip,
  Button,
  FormControl,
} from "@mui/material";
import { CalendarToday, CompareArrows } from "@mui/icons-material";

/**
 * ClassificationHeader Component
 * Displays the page title, enhanced season selector, and comparison button
 */
const ClassificationHeader = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  isMobile,
  theme,
  onOpenComparison,
}) => {
  return (
    <div
      style={{
        marginBottom: theme.spacing.xl,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "center" : "flex-start",
        gap: theme.spacing.lg,
      }}
    >
      {/* Title */}
      <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
        <h1
          style={{
            fontSize: isMobile
              ? theme.typography.fontSize["2xl"]
              : theme.typography.fontSize["3xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary[600],
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontFamily: theme.typography.fontFamily.primary,
          }}
        >
          🏆 Classificação da Liga
        </h1>
      </div>

      {/* Actions Container */}
      <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
        {/* Compare Button - Desktop Only */}
        {!isMobile && (
          <Button
            variant="outlined"
            startIcon={<CompareArrows />}
            onClick={onOpenComparison}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: theme.colors.primary[300],
              color: theme.colors.primary[700],
              "&:hover": {
                borderColor: theme.colors.primary[500],
                backgroundColor: theme.colors.primary[50],
              },
            }}
          >
            Comparar Equipas
          </Button>
        )}

        {/* Enhanced Season Selector */}
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
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default ClassificationHeader;
