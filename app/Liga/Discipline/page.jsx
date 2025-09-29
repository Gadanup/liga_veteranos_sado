"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Modal,
  IconButton,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import {
  Close,
  Warning,
  Person,
  SportsFootball,
  Shield,
  Gavel,
  DateRange,
  Info,
  EmojiEvents,
} from "@mui/icons-material";
import { theme } from "../../../styles/theme.js"; // Adjust the import path

const Discipline = () => {
  const [disciplineData, setDisciplineData] = useState([]);
  const [punishmentEvents, setPunishmentEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const currentTeam = disciplineData.find(
    (team) => team.team_id === currentTeamId
  );

  const readDiscipline = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("discipline_standings").select(`
        team_id,
        teams!discipline_standings_team_id_fkey (short_name, logo_url),
        matches_played,
        yellow_cards,
        red_cards,
        calculated_points,
        other_punishments,
        excluded
      `);

    if (error) {
      console.error("Error fetching discipline data:", error);
      setLoading(false);
      return;
    }

    // Fetch active suspensions
    const { data: suspensions, error: suspensionsError } = await supabase
      .from("suspensions")
      .select(
        `
        player_id,
        players (name, team_id),
        active
      `
      )
      .eq("active", true);

    if (suspensionsError) {
      console.error("Error fetching suspended players:", suspensionsError);
      setLoading(false);
      return;
    }

    // Group suspended players by team
    const suspendedPlayersByTeam = suspensions.reduce((acc, suspension) => {
      const teamId = suspension.players?.team_id;
      if (!teamId) return acc;
      if (!acc[teamId]) acc[teamId] = [];
      acc[teamId].push(suspension.players.name);
      return acc;
    }, {});

    // Fetch all players
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select(`id, name, team_id`);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      setLoading(false);
      return;
    }

    // Fetch match events (to count yellow cards)
    const { data: matchEvents, error: matchEventsError } = await supabase
      .from("match_events")
      .select(`player_id, event_type`)
      .eq("event_type", 2);

    if (matchEventsError) {
      console.error("Error fetching match events:", matchEventsError);
      setLoading(false);
      return;
    }

    // Count yellow cards per player
    const yellowCardCounts = matchEvents.reduce((acc, event) => {
      if (!acc[event.player_id]) acc[event.player_id] = 0;
      acc[event.player_id] += 1;
      return acc;
    }, {});

    // Identify players who are "at risk"
    const playersAtRisk = players.reduce((acc, player) => {
      const cards = yellowCardCounts[player.id] || 0;
      if ((cards + 1) % 3 === 0) {
        const teamId = player.team_id;
        if (!acc[teamId]) acc[teamId] = [];
        acc[teamId].push(player.name);
      }
      return acc;
    }, {});

    // Sort discipline data
    const sortedData = data
      .sort((a, b) => {
        if (a.excluded && !b.excluded) return 1;
        if (!a.excluded && b.excluded) return -1;

        const avgA = a.matches_played
          ? a.calculated_points / a.matches_played
          : 0;
        const avgB = b.matches_played
          ? b.calculated_points / b.matches_played
          : 0;
        return avgA - avgB;
      })
      .map((team) => ({
        ...team,
        suspendedPlayers: suspendedPlayersByTeam[team.team_id] || [],
        atRiskPlayers: playersAtRisk[team.team_id] || [],
      }));

    setDisciplineData(sortedData);
    setLoading(false);
  };

  const fetchPunishmentEvents = async (teamId) => {
    const { data, error } = await supabase
      .from("team_punishments")
      .select(
        `
        team_punishment_id,
        event_date,
        description,
        quantity,
        team_id,
        match_id,
        punishment_type_id,
        season,
        player_id,

        team:teams (
          id,
          short_name,
          logo_url
        ),

        punishment_type:punishment_types (
          punishment_type_id,
          description
        ),

        match:matches (
          id,
          home_team_id,
          away_team_id
        ),

        season_table:seasons (
          id
        ),

        player:players (
          id,
          name
        )
      `
      )
      .eq("team_id", teamId);

    if (error) {
      console.error("Error fetching punishment events:", error);
      setPunishmentEvents([]);
    } else {
      setPunishmentEvents(data ?? []);
    }
  };

  const handleRowClick = async (teamId) => {
    setCurrentTeamId(teamId);
    await fetchPunishmentEvents(teamId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPunishmentEvents([]);
  };

  useEffect(() => {
    readDiscipline();
  }, [selectedSeason]);

  const getDisciplineColor = (position) => {
    if (position <= 3) return theme.colors.sports.win;
    if (position <= 6) return theme.colors.sports.draw;
    return theme.colors.sports.loss;
  };

  const TeamCard = ({ team, position }) => {
    const isExcluded = team.excluded;
    const averagePoints =
      team.matches_played > 0
        ? (team.calculated_points / team.matches_played).toFixed(2)
        : "0.00";

    return (
      <Card
        onClick={() => handleRowClick(team.team_id)}
        sx={{
          background: isExcluded
            ? `linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)`
            : `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.background.tertiary} 100%)`,
          borderRadius: "16px",
          border: `2px solid ${isExcluded ? theme.colors.sports.loss : theme.colors.border.purple}`,
          boxShadow: theme.components.card.shadow,
          cursor: "pointer",
          transition: "all 0.3s ease",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: theme.components.card.hoverShadow,
            borderColor: theme.colors.accent[500],
            "&::before": {
              opacity: 1,
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: theme.colors.themed.goldGradient,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
        }}
      >
        <CardContent sx={{ padding: isMobile ? 2 : 3 }}>
          {/* Position Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: getDisciplineColor(position),
              color: "white",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {position}º
          </Box>

          {/* Team Header */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <img
              src={team.teams.logo_url}
              alt={`${team.teams.short_name} logo`}
              style={{
                width: isMobile ? "40px" : "44px",
                height: isMobile ? "40px" : "44px",
                objectFit: "contain",
                borderRadius: "50%",
                border: `2px solid ${theme.colors.border.purple}`,
              }}
            />
            <Box flex={1}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  fontWeight: "bold",
                  color: isExcluded
                    ? theme.colors.sports.loss
                    : theme.colors.text.primary,
                  fontSize: isMobile ? "16px" : "18px",
                  lineHeight: 1.2,
                }}
              >
                {team.teams.short_name}
              </Typography>
              {isExcluded && (
                <Chip
                  icon={<Warning />}
                  label="Excluída"
                  size="small"
                  sx={{
                    backgroundColor: theme.colors.sports.loss,
                    color: "white",
                    fontSize: "11px",
                    mt: 0.5,
                    "& .MuiChip-icon": { color: "white", fontSize: "14px" },
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Statistics Grid */}
          <Grid container spacing={1} mb={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  background: theme.colors.background.secondary,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: theme.colors.text.secondary }}
                >
                  Jogos
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: theme.colors.text.primary }}
                >
                  {isExcluded ? "-" : team.matches_played}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  background: theme.colors.background.secondary,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: theme.colors.text.secondary }}
                >
                  Pontos
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: theme.colors.text.primary }}
                >
                  {isExcluded ? "-" : team.calculated_points}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Cards Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: "16px",
                  height: "22px",
                  backgroundColor: "#ffcd00",
                  borderRadius: "2px",
                  border: "1px solid #000",
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {isExcluded ? "-" : team.yellow_cards}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: "16px",
                  height: "22px",
                  backgroundColor: "#ef4444",
                  borderRadius: "2px",
                  border: "1px solid #000",
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {isExcluded ? "-" : team.red_cards}
              </Typography>
            </Box>

            <Box
              sx={{
                background: theme.colors.primary[600],
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Média: {isExcluded ? "-" : averagePoints}
            </Box>
          </Box>

          {/* Players Status */}
          {(team.suspendedPlayers.length > 0 ||
            team.atRiskPlayers.length > 0) && (
            <Box>
              {team.suspendedPlayers.length > 0 && (
                <Box mb={1}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.colors.sports.loss, fontWeight: "bold" }}
                  >
                    Suspensos:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.sports.loss }}
                  >
                    {team.suspendedPlayers.join(", ")}
                  </Typography>
                </Box>
              )}
              {team.atRiskPlayers.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.colors.sports.draw, fontWeight: "bold" }}
                  >
                    Em Risco:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.sports.draw }}
                  >
                    {team.atRiskPlayers.join(", ")}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
        sx={{ backgroundColor: theme.colors.background.secondary }}
      >
        <Shield
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.5 },
              "100%": { opacity: 1 },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar dados disciplinares...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingY: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mb={2}
          >
            <Shield sx={{ fontSize: 32, color: theme.colors.accent[500] }} />
            <Typography
              variant="h4"
              sx={{
                color: theme.colors.primary[600],
                fontWeight: "bold",
                fontSize: "32px",
              }}
            >
              Disciplina
            </Typography>
          </Box>

          {/* Yellow underline */}
          <Box
            sx={{
              width: "60px",
              height: "4px",
              backgroundColor: theme.colors.accent[500],
              margin: "0 auto 20px auto",
              borderRadius: "2px",
            }}
          />
        </Box>

        {/* Season Selector */}
        <Box
          display="flex"
          justifyContent={isMobile ? "center" : "flex-end"}
          mb={4}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: theme.colors.text.primary }}>
              Temporada
            </InputLabel>
            <Select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              label="Temporada"
              sx={{
                backgroundColor: theme.colors.background.card,
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.colors.accent[500],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.colors.primary[600],
                  },
                },
              }}
            >
              <MenuItem value="2024">2024/2025</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Teams Grid */}
        <Grid container spacing={3}>
          {disciplineData.map((team, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={team.team_id}
              sx={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                "@keyframes fadeInUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <TeamCard team={team} position={index + 1} />
            </Grid>
          ))}
        </Grid>

        {/* No data message */}
        {disciplineData.length === 0 && (
          <Box
            textAlign="center"
            py={8}
            sx={{
              backgroundColor: theme.colors.background.card,
              borderRadius: "20px",
              border: `2px solid ${theme.colors.border.purple}`,
            }}
          >
            <Shield
              sx={{ fontSize: 80, color: theme.colors.neutral[400], mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{ color: theme.colors.text.secondary, fontWeight: "medium" }}
            >
              Nenhum dado disciplinar encontrado
            </Typography>
          </Box>
        )}
      </Container>

      {/* Punishment Details Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "90%",
            maxWidth: 1000,
            maxHeight: "90vh",
            backgroundColor: theme.colors.background.card,
            borderRadius: "20px",
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              background: theme.colors.themed.purpleGradient,
              color: "white",
              padding: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Gavel sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Detalhes Disciplinares
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {currentTeam?.teams.short_name}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box
            sx={{
              padding: 3,
              maxHeight: "calc(90vh - 120px)",
              overflow: "auto",
            }}
          >
            {punishmentEvents.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: theme.colors.primary[50] }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.primary[600],
                        }}
                      >
                        <DateRange sx={{ verticalAlign: "middle", mr: 1 }} />
                        Data
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.primary[600],
                        }}
                      >
                        <Gavel sx={{ verticalAlign: "middle", mr: 1 }} />
                        Tipo
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.primary[600],
                        }}
                      >
                        <Info sx={{ verticalAlign: "middle", mr: 1 }} />
                        Descrição
                      </TableCell>
                      {!isMobile && (
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color: theme.colors.primary[600],
                          }}
                        >
                          <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                          Jogador
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.primary[600],
                        }}
                        align="center"
                      >
                        Qtd
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {punishmentEvents.map((event) => (
                      <TableRow
                        key={event.team_punishment_id}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: theme.colors.background.secondary,
                          },
                          "&:hover": {
                            backgroundColor: theme.colors.primary[50],
                          },
                        }}
                      >
                        <TableCell>
                          {event.event_date
                            ? new Date(event.event_date).toLocaleDateString(
                                "pt-PT"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.punishment_type?.description || "-"}
                            size="small"
                            sx={{
                              backgroundColor: theme.colors.sports.draw,
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: isMobile ? 150 : 300 }}>
                          {event.description || "-"}
                        </TableCell>
                        {!isMobile && (
                          <TableCell>{event.player?.name || "-"}</TableCell>
                        )}
                        <TableCell align="center">
                          <Chip
                            label={event.quantity ?? "-"}
                            size="small"
                            sx={{
                              backgroundColor: theme.colors.primary[600],
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={6}>
                <Shield
                  sx={{ fontSize: 60, color: theme.colors.neutral[400], mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: theme.colors.text.secondary }}
                >
                  Nenhum evento disciplinar registado
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colors.text.tertiary, mt: 1 }}
                >
                  Esta equipa não possui castigos registados
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Discipline;
