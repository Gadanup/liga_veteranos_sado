import React from "react";
import { Grid, Card, CardContent, Box, Typography } from "@mui/material";
import { SportsSoccer, Schedule } from "@mui/icons-material";
import dayjs from "dayjs";
import { theme } from "../../../styles/theme.js";

/**
 * TeamInfoCards Component
 * Displays two cards: Jersey Information and Next Game
 *
 * @param {Object} teamData - Team information including jersey details
 * @param {Object} nextGame - Next scheduled match information
 */
const TeamInfoCards = ({ teamData, nextGame }) => {
  return (
    <Grid container spacing={3} mb={4}>
      {/* Jersey Info Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: theme.borderRadius.xl,
            border: `2px solid ${theme.colors.primary[100]}`,
            height: "100%",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Card Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.primary[50],
                }}
              >
                <SportsSoccer
                  sx={{
                    fontSize: 28,
                    color: theme.colors.primary[600],
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.primary[600],
                }}
              >
                Equipamentos
              </Typography>
            </Box>

            {/* Main Jersey */}
            <Box mb={2}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: theme.typography.fontWeight.semibold,
                  mb: 1,
                }}
              >
                Principal
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary }}
              >
                {teamData.main_jersey}
              </Typography>
            </Box>

            {/* Alternative Jersey */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: theme.typography.fontWeight.semibold,
                  mb: 1,
                }}
              >
                Alternativo
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary }}
              >
                {teamData.alternative_jersey}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Next Game Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: theme.borderRadius.xl,
            border: `2px solid ${theme.colors.accent[100]}`,
            height: "100%",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Card Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.accent[50],
                }}
              >
                <Schedule
                  sx={{
                    fontSize: 28,
                    color: theme.colors.accent[600],
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.accent[600],
                }}
              >
                Próximo Jogo
              </Typography>
            </Box>

            {/* Next Game Details */}
            {nextGame ? (
              <Box>
                {/* Teams Display */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  mb={2}
                >
                  {/* Home Team */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <img
                      src={nextGame.home_team.logo_url}
                      alt={nextGame.home_team.short_name}
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {nextGame.home_team.short_name}
                    </Typography>
                  </Box>

                  {/* VS Divider */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontWeight: theme.typography.fontWeight.bold,
                    }}
                  >
                    VS
                  </Typography>

                  {/* Away Team */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <img
                      src={nextGame.away_team.logo_url}
                      alt={nextGame.away_team.short_name}
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {nextGame.away_team.short_name}
                    </Typography>
                  </Box>
                </Box>

                {/* Match Date and Stadium */}
                <Box textAlign="center">
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    {nextGame.match_date
                      ? dayjs(nextGame.match_date).format("DD/MM/YYYY")
                      : "Data a definir"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    {nextGame.home_team.stadium_name}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  textAlign: "center",
                  py: 2,
                }}
              >
                Nenhum jogo agendado
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TeamInfoCards;
