import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { Schedule } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * CompetitionFormatFooter Component
 * Displays additional information about competition format
 */
const CompetitionFormatFooter = () => {
  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${theme.colors.neutral[50]} 0%, ${theme.colors.primary[50]} 100%)`,
        border: `1px solid ${theme.colors.primary[200]}`,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Schedule
            sx={{
              fontSize: 32,
              color: theme.colors.primary[600],
            }}
          />
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.primary[600],
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Formato de Competição
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.colors.text.secondary,
                lineHeight: 1.6,
              }}
            >
              O campeonato segue o formato de liga regular com todas as equipas
              a jogarem entre si numa base home-and-away, garantindo uma
              competição justa e equilibrada ao longo da temporada.
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompetitionFormatFooter;
