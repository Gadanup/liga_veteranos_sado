import React from "react";
import { Grid, Paper, Box, Typography, Fade } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * QuickActionsGrid Component
 * Displays quick action buttons for common tasks
 *
 * @param {string} expandedCard - Currently expanded card ID
 * @param {Function} setExpandedCard - Function to set expanded card
 */
const QuickActionsGrid = ({ expandedCard, setExpandedCard }) => {
  const quickActions = [
    {
      title: "Ficha de Inscrição 2025/2026",
      description: "Download do formulário de inscrição",
      icon: <GetApp />,
      color: theme.colors.primary[500],
      action: () => {
        const link = document.createElement("a");
        link.href = "/docs/FICHA_INSCRIÇÃO_2025-2026.pdf";
        link.download = "Ficha_Inscricao_2025_2026.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      title: "Calendário 2025/2026",
      description: "Download do calendário",
      icon: <GetApp />,
      color: theme.colors.primary[500],
      action: () => {
        const link = document.createElement("a");
        link.href = "/docs/CALENDARIO_2025-2026.xlsx";
        link.download = "Calendario_2025_2026.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
  ];

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: theme.borderRadius.xl,
                backgroundColor: theme.colors.background.tertiary,
                border: `2px solid ${theme.colors.border.primary}`,
                cursor: "pointer",
                transition: theme.transitions.normal,
                "&:hover": {
                  backgroundColor: `${action.color}10`,
                  borderColor: `${action.color}30`,
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows.lg,
                },
              }}
              onClick={action.action}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                  }}
                >
                  {action.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.colors.text.primary,
                      mb: 0.5,
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Fade>
  );
};

export default QuickActionsGrid;
