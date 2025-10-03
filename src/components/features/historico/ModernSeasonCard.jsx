import React from "react";
import { Card, Box, Typography, CardContent, Grid, Chip } from "@mui/material";
import { EmojiEvents, Star } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { theme } from "../../../styles/theme";

// Sub-components
import StatCard from "./StatCard";
import TopScorersCard from "./TopScorersCard";

/**
 * ModernSeasonCard Component
 * Displays detailed statistics for a modern season
 *
 * @param {Object} stats - Season statistics data
 */
const ModernSeasonCard = ({ stats }) => {
  const router = useRouter();

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: theme.borderRadius["2xl"],
        overflow: "hidden",
        border: `2px solid ${theme.colors.primary[100]}`,
      }}
    >
      {/* Season Header */}
      <Box
        sx={{
          background: theme.colors.themed.purpleGradient,
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <EmojiEvents sx={{ fontSize: 36 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Época {stats.season?.description}
          </Typography>
        </Box>
        <Chip
          label="Época na App"
          icon={<Star />}
          sx={{
            backgroundColor: theme.colors.accent[500],
            color: theme.colors.neutral[900],
            fontWeight: "bold",
            fontSize: "0.9rem",
            py: 2.5,
          }}
        />
      </Box>

      {/* Season Stats Grid */}
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* League Winner */}
          <Grid item xs={12} md={6}>
            <StatCard
              icon={<EmojiEvents sx={{ fontSize: 28 }} />}
              title="Campeão da Liga"
              team={stats.league_winner}
              color={theme.colors.accent[600]}
            />
          </Grid>

          {/* Cup Winner */}
          <Grid item xs={12} md={6}>
            <StatCard
              icon={<EmojiEvents sx={{ fontSize: 28 }} />}
              title="Vencedor da Taça"
              team={stats.cup_winner}
              color={theme.colors.secondary[600]}
            />
          </Grid>

          {/* Supercup and Discipline Winners */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StatCard
                  icon={<EmojiEvents sx={{ fontSize: 28 }} />}
                  title="Vencedor da Supertaça"
                  team={stats.supercup_winner}
                  onClick={
                    stats.supercup_match_path
                      ? () =>
                          router.push(
                            `/${stats.supercup_match_path.replace(/^\/+/, "")}`
                          )
                      : null
                  }
                  color={theme.colors.primary[600]}
                />
              </Grid>

              {stats.discipline_winner && (
                <Grid item xs={12}>
                  <StatCard
                    icon={<EmojiEvents sx={{ fontSize: 28 }} />}
                    title="Melhor Disciplina"
                    team={stats.discipline_winner}
                    extraInfo={`${stats.discipline_yellow_cards || 0} amarelos • ${stats.discipline_red_cards || 0} vermelhos`}
                    color={theme.colors.warning[600]}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Top Scorers */}
          <Grid item xs={12} md={6}>
            <TopScorersCard stats={stats} color={theme.colors.success[600]} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ModernSeasonCard;
