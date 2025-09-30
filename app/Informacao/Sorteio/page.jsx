import React from "react";
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";
import {
  EmojiEvents,
  SportsSoccer,
  Timeline,
  Assignment,
  Info,
  CheckCircle,
  Casino,
  Stadium,
  Groups,
  Schedule,
  MilitaryTech,
  SwapHoriz,
} from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

export default function Sorteio() {
  const championshipNotes = [
    {
      icon: <Groups />,
      text: "Campeonato com 13 equipas participantes",
    },
    {
      icon: <SportsSoccer />,
      text: "Cada equipa joga contra todas as restantes duas vezes (uma casa e outra fora)",
    },
    {
      icon: <Timeline />,
      text: "Campeonato em formato liga regular",
    },
  ];

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

  const cupRules = [
    {
      icon: <Groups />,
      text: "Apenas três equipas a jogar em simultâneo, por fase, no Pinhal Novo",
    },
    {
      icon: <SwapHoriz />,
      text: "Equipas vão sendo sorteadas e colocadas sequencialmente nos lugares (1,2,3,4, etc)",
    },
    {
      icon: <Stadium />,
      text: "Caso o sorteio dite mais de 3 equipas com campo no PN, a jogar em simultâneo, será alterado o visitado (visitante passa para visitado)",
    },
    {
      icon: <CheckCircle />,
      text: "15ª posição fará com que essa equipa fiquem isenta na primeira fase",
    },
    {
      icon: <MilitaryTech />,
      text: "Poderão também ser feitas alterações às localizações dos jogos dos quartos de final (devido à condicionante do campo)",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Card
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            mb: 4,
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box textAlign="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                mb={3}
              >
                <EmojiEvents
                  sx={{
                    fontSize: { xs: 40, md: 50 },
                    color: theme.colors.accent[500],
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Sorteio das Competições
                </Typography>
              </Box>

              <Chip
                icon={<Info />}
                label="Liga Veteranos do Sado 2025/2026"
                sx={{
                  backgroundColor: theme.colors.accent[500],
                  color: theme.colors.neutral[900],
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "16px" },
                  py: 2,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Liga Section */}
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
          <Timeline sx={{ fontSize: 32 }} />
          Campeonato (Liga)
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Championship Information Card */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                borderRadius: "16px",
                height: "100%",
                border: `2px solid ${theme.colors.primary[100]}`,
                transition: theme.transitions.normal,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows.lg,
                  borderColor: theme.colors.primary[300],
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: theme.colors.primary[50],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Assignment
                      sx={{
                        fontSize: 32,
                        color: theme.colors.primary[600],
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                    }}
                  >
                    Informações do Campeonato
                  </Typography>
                </Box>

                <List sx={{ py: 0 }}>
                  {championshipNotes.map((note, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 2,
                        borderRadius: "12px",
                        mb: 1,
                        backgroundColor:
                          index % 2 === 0
                            ? theme.colors.background.tertiary
                            : "transparent",
                        transition: theme.transitions.normal,
                        "&:hover": {
                          backgroundColor: theme.colors.primary[50],
                          transform: "translateX(8px)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 48,
                          color: theme.colors.primary[600],
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "8px",
                            backgroundColor: theme.colors.primary[100],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {note.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={note.text}
                        primaryTypographyProps={{
                          variant: "body1",
                          sx: {
                            color: theme.colors.text.primary,
                            fontWeight: "medium",
                            lineHeight: 1.6,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Draw Methodology Card */}
          <Grid item xs={12} lg={6}>
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
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        gap={2}
                        mb={2}
                      >
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
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* Taça Section */}
        <Typography
          variant="h4"
          sx={{
            color: theme.colors.secondary[600],
            fontWeight: "bold",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <MilitaryTech sx={{ fontSize: 32 }} />
          Taça
        </Typography>

        <Card
          sx={{
            borderRadius: "16px",
            border: `2px solid ${theme.colors.secondary[100]}`,
            transition: theme.transitions.normal,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows.lg,
              borderColor: theme.colors.secondary[300],
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: theme.colors.secondary[50],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <EmojiEvents
                  sx={{
                    fontSize: 32,
                    color: theme.colors.secondary[600],
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: theme.colors.secondary[600],
                  fontWeight: "bold",
                }}
              >
                Regras do Sorteio da Taça
              </Typography>
            </Box>

            <List sx={{ py: 0 }}>
              {cupRules.map((rule, index) => (
                <ListItem
                  key={index}
                  sx={{
                    px: 0,
                    py: 2,
                    borderRadius: "12px",
                    mb: 1,
                    backgroundColor:
                      index % 2 === 0
                        ? theme.colors.background.tertiary
                        : "transparent",
                    transition: theme.transitions.normal,
                    "&:hover": {
                      backgroundColor: theme.colors.secondary[50],
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      color: theme.colors.secondary[600],
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        backgroundColor: theme.colors.secondary[100],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {rule.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={rule.text}
                    primaryTypographyProps={{
                      variant: "body1",
                      sx: {
                        color: theme.colors.text.primary,
                        fontWeight: "medium",
                        lineHeight: 1.6,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Additional Information Footer */}
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
                  O campeonato segue o formato de liga regular com todas as
                  equipas a jogarem entre si numa base home-and-away, garantindo
                  uma competição justa e equilibrada ao longo da temporada.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
