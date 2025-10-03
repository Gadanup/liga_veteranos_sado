import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import { theme } from "../../../styles/theme.js";

/**
 * SquadTab Component
 * Displays team manager and players
 *
 * @param {Object} teamData - Team information including manager
 * @param {Array} players - List of players
 */
const SquadTab = ({ teamData, players }) => {
  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      {/* Manager Section */}
      {teamData.manager_name && (
        <Box mb={4}>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: theme.typography.fontWeight.bold,
              mb: 3,
            }}
          >
            Treinador
          </Typography>

          <Card
            sx={{
              borderRadius: theme.borderRadius.lg,
              border: `2px solid ${theme.colors.accent[200]}`,
              backgroundColor: theme.colors.accent[50],
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  alt={teamData.manager_name}
                  src={teamData.manager_photo_url}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `3px solid ${theme.colors.accent[500]}`,
                    boxShadow: theme.shadows.md,
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {teamData.manager_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    Treinador Principal
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Players Section */}
      <Typography
        variant="h6"
        sx={{
          color: theme.colors.primary[600],
          fontWeight: theme.typography.fontWeight.bold,
          mb: 3,
        }}
      >
        Jogadores ({players.length})
      </Typography>

      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
            <Card
              sx={{
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border.primary}`,
                transition: theme.transitions.normal,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows.md,
                  borderColor: theme.colors.primary[300],
                },
              }}
            >
              <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Avatar
                  alt={player.name}
                  src={player.photo_url}
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto",
                    mb: 2,
                    border: `2px solid ${theme.colors.primary[200]}`,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    fontSize: "0.9rem",
                    lineHeight: 1.3,
                  }}
                >
                  {player.name}
                  {player.joker && (
                    <Chip
                      label="JK"
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: theme.colors.accent[500],
                        color: "white",
                        fontSize: "0.7rem",
                        height: "20px",
                      }}
                    />
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SquadTab;
