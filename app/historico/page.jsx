"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Fade,
  Paper,
  Link,
  Button,
} from "@mui/material";
import {
  EmojiEvents,
  SportsSoccer,
  Shield,
  MilitaryTech,
  RestoreOutlined,
  OpenInNew,
  Star,
  SportsMartialArts,
  Visibility,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { theme } from "../../styles/theme";
import { supabase } from "../../lib/supabase";

const historicalSeasons = [
  {
    year: 2013,
    url: "https://ligaveteranossado.blogspot.com",
    winner: "Praiense",
  },
  {
    year: 2014,
    url: "https://ligaveteranossado2014.blogspot.com",
    winner: "Sport Clube Sado",
  },
  {
    year: 2015,
    url: "https://ligaveteranossado2015.blogspot.com",
    winner: "Sport Clube Sado",
  },
  {
    year: 2016,
    url: "https://ligaveteranossado2016.blogspot.com",
    winner: "Casa do Benfica de Setúbal",
  },
  {
    year: 2017,
    url: "https://ligaveteranossado2017.blogspot.com",
    winner: "Sport Clube Sado",
  },
  {
    year: 2018,
    url: "https://ligaveteranossado2018.blogspot.com",
    winner: "Ídolos da Praça",
  },
  {
    year: 2019,
    url: "https://ligaveteranosdosado2019.blogspot.com",
    winner: "Ídolos da Praça",
  },
  {
    year: 2020,
    url: "https://ligaveteranosdosado2020.blogspot.com",
    winner: "Pontes",
  },
  {
    year: 2021,
    url: "https://ligaveteranosdosado2021.blogspot.com",
    winner: "Amarelos",
  },
  {
    year: 2022,
    url: "https://ligaveteranodosado2022.blogspot.com",
    winner: "São Domingos F.C",
  },
  {
    year: 2023,
    url: "https://ligaveteranosdosado2023.blogspot.com",
    winner: "São Domingos F.C",
  },
  {
    year: 2024,
    url: "https://ligaveteranosdosado2024.blogspot.com",
    winner: "Águias S. Gabriel",
  },
];

const HistoryPage = () => {
  const router = useRouter();
  const [modernSeasonStats, setModernSeasonStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeasonWinners();
  }, []);

  const fetchSeasonWinners = async () => {
    const { data, error } = await supabase
      .from("season_winners")
      .select(
        `
      id,
      season_id,
      supercup_match_path,
      top_scorer_1_goals,
      top_scorer_2_goals,
      top_scorer_3_goals,
      discipline_yellow_cards,
      discipline_red_cards,
      seasons!inner(description),
      league_winner:teams!league_winner_id(short_name, logo_url),
      cup_winner:teams!cup_winner_id(short_name, logo_url),
      supercup_winner:teams!supercup_winner_id(short_name, logo_url),
      discipline_winner:teams!discipline_winner_id(short_name, logo_url),
      top_scorer_1:players!top_scorer_1_id(id, name, team_id),
      top_scorer_2:players!top_scorer_2_id(id, name, team_id),
      top_scorer_3:players!top_scorer_3_id(id, name, team_id)
    `
      )
      .order("season_id", { ascending: false });

    console.log("Season winners data:", data);
    console.log("Season winners error:", error);

    if (error) {
      console.error("Error fetching season winners:", error);
      setLoading(false);
      return;
    }

    // Now fetch team info for each scorer separately
    if (data && data.length > 0) {
      const enrichedData = await Promise.all(
        data.map(async (season) => {
          const scorers = await Promise.all([
            season.top_scorer_1?.team_id
              ? supabase
                  .from("teams")
                  .select("short_name, logo_url")
                  .eq("id", season.top_scorer_1.team_id)
                  .single()
              : Promise.resolve({ data: null }),
            season.top_scorer_2?.team_id
              ? supabase
                  .from("teams")
                  .select("short_name, logo_url")
                  .eq("id", season.top_scorer_2.team_id)
                  .single()
              : Promise.resolve({ data: null }),
            season.top_scorer_3?.team_id
              ? supabase
                  .from("teams")
                  .select("short_name, logo_url")
                  .eq("id", season.top_scorer_3.team_id)
                  .single()
              : Promise.resolve({ data: null }),
          ]);

          return {
            ...season,
            season: season.seasons,
            top_scorer_1: season.top_scorer_1
              ? { ...season.top_scorer_1, team: scorers[0].data }
              : null,
            top_scorer_2: season.top_scorer_2
              ? { ...season.top_scorer_2, team: scorers[1].data }
              : null,
            top_scorer_3: season.top_scorer_3
              ? { ...season.top_scorer_3, team: scorers[2].data }
              : null,
          };
        })
      );

      console.log("Enriched data:", enrichedData);
      setModernSeasonStats(enrichedData);
    }

    setLoading(false);
  };

  const StatCard = ({ icon, title, team, extraInfo, color, onClick }) => (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.background.card,
        border: `2px solid ${color}20`,
        transition: theme.transitions.normal,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          transform: onClick ? "translateY(-4px)" : "none",
          boxShadow: `0 8px 24px ${color}30`,
          borderColor: `${color}40`,
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.colors.text.secondary,
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </Typography>
      </Box>

      {team ? (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={team.logo_url}
            alt={team.short_name}
            sx={{
              width: 56,
              height: 56,
              border: `3px solid ${color}30`,
            }}
          />
          <Box flex={1}>
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: "bold",
                fontSize: "1.1rem",
                mb: 0.5,
              }}
            >
              {team.short_name}
            </Typography>
            {extraInfo && (
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary, fontSize: "0.9rem" }}
              >
                {extraInfo}
              </Typography>
            )}
          </Box>
          {onClick && (
            <Visibility
              sx={{ color: theme.colors.text.tertiary, fontSize: 20 }}
            />
          )}
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.tertiary,
            fontStyle: "italic",
            textAlign: "center",
            py: 2,
          }}
        >
          Não disputado
        </Typography>
      )}
    </Paper>
  );

  const TopScorersCard = ({ stats, color }) => {
    const scorers = [
      stats.top_scorer_1 && {
        name: stats.top_scorer_1.name,
        team: stats.top_scorer_1.team,
        goals: stats.top_scorer_1_goals,
      },
      stats.top_scorer_2 && {
        name: stats.top_scorer_2.name,
        team: stats.top_scorer_2.team,
        goals: stats.top_scorer_2_goals,
      },
      stats.top_scorer_3 && {
        name: stats.top_scorer_3.name,
        team: stats.top_scorer_3.team,
        goals: stats.top_scorer_3_goals,
      },
    ].filter(Boolean);

    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: theme.borderRadius.xl,
          backgroundColor: theme.colors.background.card,
          border: `2px solid ${color}20`,
          transition: theme.transitions.normal,
          height: "100%",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 24px ${color}30`,
            borderColor: `${color}40`,
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: `${color}15`,
              color: color,
            }}
          >
            <SportsSoccer sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.colors.text.secondary,
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Melhores Marcadores
          </Typography>
        </Box>

        {scorers.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {scorers.map((scorer, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  p: 2,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor:
                    index === 0
                      ? `${color}10`
                      : theme.colors.background.secondary,
                  border: index === 0 ? `2px solid ${color}30` : "none",
                }}
              >
                <Chip
                  label={`${index + 1}º`}
                  size="small"
                  sx={{
                    backgroundColor:
                      index === 0 ? color : theme.colors.neutral[400],
                    color: "white",
                    fontWeight: "bold",
                    minWidth: "32px",
                  }}
                />
                <Avatar
                  src={scorer.team?.logo_url}
                  alt={scorer.team?.short_name}
                  sx={{ width: 36, height: 36 }}
                />
                <Box flex={1}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.colors.text.primary,
                      fontWeight: index === 0 ? "bold" : "medium",
                      fontSize: "0.95rem",
                    }}
                  >
                    {scorer.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    {scorer.team?.short_name}
                  </Typography>
                </Box>
                <Chip
                  label={`${scorer.goals} golos`}
                  size="small"
                  sx={{
                    backgroundColor: `${color}15`,
                    color: color,
                    fontWeight: "bold",
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.tertiary,
              fontStyle: "italic",
              textAlign: "center",
              py: 2,
            }}
          >
            Sem dados disponíveis
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background.secondary,
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              background: theme.colors.themed.heroGradient,
              color: "white",
              mb: 4,
              borderRadius: theme.borderRadius["2xl"],
              overflow: "hidden",
              position: "relative",
            }}
          >
            <CardContent
              sx={{ p: { xs: 3, md: 5 }, position: "relative", zIndex: 1 }}
            >
              <Box textAlign="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  mb={2}
                >
                  <RestoreOutlined sx={{ fontSize: 50 }} />
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    HISTÓRICO
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Vencedores e estatísticas de todas as épocas
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Modern Season Stats */}
        {!loading && modernSeasonStats.length > 0 && (
          <>
            <Typography
              variant="h4"
              sx={{
                color: theme.colors.primary[600],
                fontWeight: "bold",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Star sx={{ fontSize: 32 }} />
              Estatísticas Detalhadas
            </Typography>

            {modernSeasonStats.map((stats, index) => (
              <Fade in={true} timeout={1000 + index * 200} key={stats.id}>
                <Card
                  sx={{
                    mb: 4,
                    borderRadius: theme.borderRadius["2xl"],
                    overflow: "hidden",
                    border: `2px solid ${theme.colors.primary[100]}`,
                  }}
                >
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

                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <StatCard
                          icon={<EmojiEvents sx={{ fontSize: 28 }} />}
                          title="Campeão da Liga"
                          team={stats.league_winner}
                          color={theme.colors.accent[600]}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StatCard
                          icon={<MilitaryTech sx={{ fontSize: 28 }} />}
                          title="Vencedor da Taça"
                          team={stats.cup_winner}
                          color={theme.colors.secondary[600]}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <StatCard
                              icon={<Shield sx={{ fontSize: 28 }} />}
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
                                icon={
                                  <SportsMartialArts sx={{ fontSize: 28 }} />
                                }
                                title="Melhor Disciplina"
                                team={stats.discipline_winner}
                                extraInfo={`${stats.discipline_yellow_cards || 0} amarelos • ${stats.discipline_red_cards || 0} vermelhos`}
                                color={theme.colors.warning[600]}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TopScorersCard
                          stats={stats}
                          color={theme.colors.success[600]}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </>
        )}

        {/* Historical Seasons */}
        <Fade in={true} timeout={1400}>
          <Card
            sx={{
              borderRadius: theme.borderRadius["2xl"],
              overflow: "hidden",
              border: `2px solid ${theme.colors.neutral[200]}`,
              mt: 6,
            }}
          >
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

            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={2}>
                {historicalSeasons.map((season) => (
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
        </Fade>
      </Container>
    </Box>
  );
};

export default HistoryPage;
