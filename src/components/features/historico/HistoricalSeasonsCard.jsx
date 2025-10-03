import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import { RestoreOutlined, EmojiEvents, OpenInNew } from "@mui/icons-material";
import { theme } from "../../../styles/theme";

/**
 * HistoricalSeasonsCard Component
 * Displays links to historical season blogs
 *
 * @param {Array} seasons - Array of historical season objects
 */
const HistoricalSeasonsCard = ({ seasons }) => {
  return (
    <Card
      sx={{
        borderRadius: theme.borderRadius["2xl"],
        overflow: "hidden",
        border: `2px solid ${theme.colors.neutral[200]}`,
        mt: 6,
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.colors.neutral[700]} 0%, ${theme.colors.neutral[900]} 100%)`,
          color: "white",
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <RestoreOutlined sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Épocas Históricas (2012-2024)
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
              Consulte os blogs oficiais das épocas anteriores
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Historical Seasons Grid */}
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {seasons.map((season) => (
            <Grid item xs={12} sm={6} md={4} key={season.year}>
              <Paper
                elevation={0}
                component={Link}
                href={season.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  p: 2.5,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.background.tertiary,
                  border: `2px solid ${theme.colors.border.primary}`,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: theme.transitions.normal,
                  "&:hover": {
                    backgroundColor: theme.colors.accent[50],
                    borderColor: theme.colors.accent[300],
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows.md,
                  },
                }}
              >
                {/* Season Info */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                  >
                    {season.year - 1}/{season.year}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {season.winner}
                  </Typography>
                </Box>

                {/* Icons */}
                <Box display="flex" alignItems="center" gap={1}>
                  <EmojiEvents
                    sx={{ color: theme.colors.accent[500], fontSize: 24 }}
                  />
                  <OpenInNew
                    sx={{
                      color: theme.colors.text.tertiary,
                      fontSize: 18,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HistoricalSeasonsCard;
