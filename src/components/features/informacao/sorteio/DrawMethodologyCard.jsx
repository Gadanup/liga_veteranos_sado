import React from "react";
import { Card, CardContent, Box, Typography, Paper } from "@mui/material";
import { Casino, Stadium } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * DrawMethodologyCard Component
 * Displays the draw methodology steps for the championship
 */
const DrawMethodologyCard = () => {
  const drawMethodology = [
    {
      step: 1,
      title: "Sorteio das Equipas do Pinhal Novo",
      description: "Primeiro serão sorteadas equipas a jogar no Pinhal Novo",
      detail:
        "Estas equipas terão de ser sorteadas com a condicionante de serem alocadas aos lugares: 1, 2, 5, 7, 9, 11",
      icon: <Stadium />,
      color: theme.colors.primary[500],
    },
    {
      step: 2,
      title: "Sorteio da Equipa dos Amarelos",
      description: "Segundo será sorteada a equipa dos amarelos",
      detail:
        "Com a condicionante de ser colocada num dos lugares: 3, 4, 6, 12",
      icon: <Casino />,
      color: theme.colors.accent[500],
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: "16px",
        height: "100%",
        border: `2px solid ${theme.colors.accent[100]}`,
        transition: theme.transitions.normal,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows.lg,
          borderColor: theme.colors.accent[300],
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Card Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: theme.colors.accent[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Casino
              sx={{
                fontSize: 32,
                color: theme.colors.accent[600],
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: theme.colors.accent[600],
              fontWeight: "bold",
            }}
          >
            Metodologia do Sorteio
          </Typography>
        </Box>

        {/* Methodology Steps */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {drawMethodology.map((methodology, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                backgroundColor: theme.colors.background.tertiary,
                border: `2px solid ${methodology.color}20`,
                transition: theme.transitions.normal,
                "&:hover": {
                  backgroundColor: `${methodology.color}10`,
                  transform: "scale(1.02)",
                  borderColor: `${methodology.color}40`,
                },
              }}
            >
              <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                {/* Step Number Badge */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: methodology.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  {methodology.step}
                </Box>

                {/* Step Content */}
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: methodology.color,
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    {methodology.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.colors.text.primary,
                      mb: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {methodology.description}
                  </Typography>

                  {/* Detail Box */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "8px",
                      backgroundColor: `${methodology.color}15`,
                      border: `1px solid ${methodology.color}30`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      {methodology.detail}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DrawMethodologyCard;
