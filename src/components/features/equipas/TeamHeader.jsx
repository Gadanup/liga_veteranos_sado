import React from "react";
import { Card, CardContent, Grid, Box, Typography, Chip } from "@mui/material";
import { CalendarToday, Stadium } from "@mui/icons-material";
import Image from "next/image";
import { theme } from "../../../styles/theme.js";

/**
 * TeamHeader Component
 * Displays the team's main information including logo, name, stadium, and founded date
 *
 * @param {Object} teamData - Team information from database
 * @param {string} selectedSeason - Current selected season
 */
const TeamHeader = ({ teamData, selectedSeason }) => {
  return (
    <Card
      sx={{
        background: theme.colors.themed.purpleGradient,
        color: "white",
        mb: 4,
        borderRadius: theme.borderRadius.xl,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          {/* Team Logo and Info */}
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              {/* Team Logo Circle */}
              <Box
                sx={{
                  width: { xs: 80, md: 120 },
                  height: { xs: 80, md: 120 },
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${theme.colors.neutral[900]}50`,
                  border: `4px solid ${theme.colors.accent[500]}`,
                  flexShrink: 0,
                }}
              >
                <Image
                  src={teamData.logo_url}
                  alt={`${teamData.name} Logo`}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
              </Box>

              {/* Team Details */}
              <Box flex={1} minWidth={0}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: theme.typography.fontWeight.bold,
                    mb: 1,
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {teamData.name}
                </Typography>

                {/* Season Chip */}
                <Chip
                  icon={<CalendarToday sx={{ fontSize: 14 }} />}
                  label={`Época ${teamData.season || selectedSeason}`}
                  sx={{
                    backgroundColor: theme.colors.accent[500],
                    color: theme.colors.neutral[900],
                    fontWeight: theme.typography.fontWeight.bold,
                    fontSize: "0.875rem",
                    height: "32px",
                    mb: 1,
                  }}
                />

                {/* Stadium Info */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Stadium sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    {teamData.stadium_name}
                  </Typography>
                </Box>

                {/* Founded Date */}
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    Fundado: {new Date(teamData.founded).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Team Roster Image */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: "relative",
                borderRadius: theme.borderRadius.xl,
                overflow: "hidden",
                boxShadow: theme.shadows.xl,
              }}
            >
              <Image
                src={teamData.roster_url}
                alt={`${teamData.name} Roster`}
                width={300}
                height={200}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeamHeader;
