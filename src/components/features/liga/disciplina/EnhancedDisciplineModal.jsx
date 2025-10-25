import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Autocomplete,
  FormHelperText,
  Avatar,
} from "@mui/material";
import {
  Close,
  Gavel,
  DateRange,
  Info,
  Person,
  Shield,
  PersonOff,
  Add,
  CheckCircle,
  Delete,
  Warning,
  SportsSoccer,
  TrendingUp,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";
import { supabase } from "../../../../lib/supabase.ts";
import { useIsAdmin } from "../../../../hooks/admin/useIsAdmin.js";

/**
 * Enhanced Discipline Modal Component
 * Manages team discipline including suspensions and punishments
 */
const EnhancedDisciplineModal = ({
  open,
  onClose,
  currentTeam,
  punishmentEvents,
  isMobile,
  selectedSeason,
  onDataUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [players, setPlayers] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [punishmentTypes, setPunishmentTypes] = useState([]);
  const [playerYellowCardDetails, setPlayerYellowCardDetails] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useIsAdmin();

  // Suspension Dialog State
  const [suspensionDialog, setSuspensionDialog] = useState(false);
  const [newSuspension, setNewSuspension] = useState({
    player_id: null,
    suspension_date: new Date().toISOString().split("T")[0],
    matches_suspended: 1,
    reason: "",
  });

  // Punishment Dialog State
  const [punishmentDialog, setPunishmentDialog] = useState(false);
  const [newPunishment, setNewPunishment] = useState({
    punishment_type_id: "",
    event_date: new Date().toISOString().split("T")[0],
    description: "",
    quantity: 1,
    player_id: null,
    match_id: null,
  });

  useEffect(() => {
    if (open && currentTeam) {
      // Reset state when opening modal or changing team
      setPlayers([]);
      setSuspensions([]);
      setPlayerYellowCardDetails({});
      setActiveTab(0);

      fetchPunishmentTypes();
      fetchPlayers();
    }
  }, [open, currentTeam?.team_id, selectedSeason]);

  // Fetch suspensions after players are loaded
  useEffect(() => {
    if (open && currentTeam && players.length > 0) {
      fetchSuspensions();
    }
  }, [players.length, open, currentTeam?.team_id]);

  const fetchPlayers = async () => {
    if (!currentTeam?.team_id) return;

    try {
      const { data, error } = await supabase
        .from("players")
        .select("id, name, photo_url")
        .eq("team_id", currentTeam.team_id)
        .order("name");

      if (error) throw error;

      // Fetch matches with team names
      const { data: matches } = await supabase
        .from("matches")
        .select(
          `
          id, 
          match_date, 
          home_team_id, 
          away_team_id,
          home_team:teams!matches_home_team_id_fkey(short_name),
          away_team:teams!matches_away_team_id_fkey(short_name)
        `
        )
        .eq("season", selectedSeason);

      const matchIds = matches?.map((m) => m.id) || [];

      // Fetch yellow card events
      const { data: matchEvents } = await supabase
        .from("match_events")
        .select("player_id, match_id, minute")
        .eq("event_type", 2)
        .in("match_id", matchIds);

      const yellowCardCounts = {};
      const yellowCardDetails = {};

      matchEvents?.forEach((event) => {
        yellowCardCounts[event.player_id] =
          (yellowCardCounts[event.player_id] || 0) + 1;

        if (!yellowCardDetails[event.player_id]) {
          yellowCardDetails[event.player_id] = [];
        }

        const match = matches.find((m) => m.id === event.match_id);
        if (match) {
          const isHome = match.home_team_id === currentTeam.team_id;
          const opponent = isHome
            ? match.away_team?.short_name
            : match.home_team?.short_name;

          yellowCardDetails[event.player_id].push({
            match_id: event.match_id,
            match_date: match.match_date,
            minute: event.minute,
            opponent: opponent,
            isHome: isHome,
          });
        }
      });

      // Sort yellow cards by date for each player
      Object.keys(yellowCardDetails).forEach((playerId) => {
        yellowCardDetails[playerId].sort(
          (a, b) => new Date(a.match_date) - new Date(b.match_date)
        );
      });

      setPlayerYellowCardDetails(yellowCardDetails);

      const playersWithCards = data?.map((player) => ({
        ...player,
        yellow_cards: yellowCardCounts?.[player.id] || 0,
      }));

      setPlayers(playersWithCards || []);
    } catch (error) {
      console.error("Error fetching players:", error);
      showSnackbar("Erro ao carregar jogadores", "error");
    }
  };

  const fetchSuspensions = async () => {
    if (!currentTeam?.team_id || players.length === 0) return;

    try {
      const playerIds = players.map((p) => p.id);

      const { data, error } = await supabase
        .from("suspensions")
        .select(
          `
          id,
          player_id,
          suspension_date,
          matches_suspended,
          reason,
          active,
          players (name)
        `
        )
        .eq("season", selectedSeason)
        .in("player_id", playerIds)
        .order("suspension_date", { ascending: false });

      if (error) throw error;

      setSuspensions(
        data?.map((s) => ({
          ...s,
          player_name: s.players?.name,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching suspensions:", error);
    }
  };

  const fetchPunishmentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("punishment_types")
        .select("*")
        .order("description");

      if (error) throw error;
      setPunishmentTypes(data || []);
    } catch (error) {
      console.error("Error fetching punishment types:", error);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddSuspension = async () => {
    if (!newSuspension.player_id || !newSuspension.reason) {
      showSnackbar("Por favor preencha todos os campos obrigatórios", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("suspensions").insert({
        player_id: newSuspension.player_id,
        suspension_date: newSuspension.suspension_date,
        matches_suspended: newSuspension.matches_suspended,
        reason: newSuspension.reason,
        active: true,
        season: selectedSeason,
      });

      if (error) throw error;

      showSnackbar("Suspensão adicionada com sucesso!", "success");
      setSuspensionDialog(false);
      setNewSuspension({
        player_id: null,
        suspension_date: new Date().toISOString().split("T")[0],
        matches_suspended: 1,
        reason: "",
      });
      fetchSuspensions();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error adding suspension:", error);
      showSnackbar("Erro ao adicionar suspensão", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPunishment = async () => {
    if (!newPunishment.punishment_type_id) {
      showSnackbar("Por favor selecione o tipo de castigo", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("team_punishments").insert({
        team_id: currentTeam.team_id,
        punishment_type_id: newPunishment.punishment_type_id,
        event_date: newPunishment.event_date,
        description: newPunishment.description,
        quantity: newPunishment.quantity,
        player_id: newPunishment.player_id || null,
        match_id: newPunishment.match_id || null,
        season: selectedSeason,
      });

      if (error) throw error;

      showSnackbar("Castigo adicionado com sucesso!", "success");
      setPunishmentDialog(false);
      setNewPunishment({
        punishment_type_id: "",
        event_date: new Date().toISOString().split("T")[0],
        description: "",
        quantity: 1,
        player_id: null,
        match_id: null,
      });
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error adding punishment:", error);
      showSnackbar("Erro ao adicionar castigo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateSuspension = async (suspensionId) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("suspensions")
        .update({ active: false })
        .eq("id", suspensionId);

      if (error) throw error;

      showSnackbar("Suspensão desativada com sucesso!", "success");
      fetchSuspensions();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error deactivating suspension:", error);
      showSnackbar("Erro ao desativar suspensão", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePunishment = async (punishmentId) => {
    if (!window.confirm("Tem certeza que deseja remover este castigo?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("team_punishments")
        .delete()
        .eq("team_punishment_id", punishmentId);

      if (error) throw error;

      showSnackbar("Castigo removido com sucesso!", "success");
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error deleting punishment:", error);
      showSnackbar("Erro ao remover castigo", "error");
    } finally {
      setLoading(false);
    }
  };

  const getPlayerYellowCardStatus = (yellowCards) => {
    const nextSuspension = Math.ceil((yellowCards + 1) / 3) * 3;
    const cardsToSuspension = nextSuspension - yellowCards;

    if (cardsToSuspension === 1) {
      return {
        text: "PRÓXIMO AMARELO = SUSPENSÃO",
        color: theme.colors.sports.loss,
        warning: true,
      };
    } else if (cardsToSuspension === 2) {
      return {
        text: `${cardsToSuspension} amarelos para suspensão`,
        color: theme.colors.sports.draw,
        warning: false,
      };
    }
    return {
      text: `${cardsToSuspension} amarelos para suspensão`,
      color: theme.colors.text.secondary,
      warning: false,
    };
  };

  const renderOverviewTab = () => {
    const avgPoints =
      currentTeam?.matches_played > 0
        ? (currentTeam.calculated_points / currentTeam.matches_played).toFixed(
            2
          )
        : "0.00";

    return (
      <Box>
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                boxShadow: theme.components.card.shadow,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.components.card.hoverShadow,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "rgba(251, 191, 36, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "16px",
                        height: "24px",
                        backgroundColor: "#ffcd00",
                        borderRadius: "3px",
                        border: "1px solid #000",
                      }}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  mb={0.5}
                >
                  Cartões Amarelos
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#92400e" }}
                >
                  {currentTeam?.yellow_cards || 0}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Total na época
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                boxShadow: theme.components.card.shadow,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.components.card.hoverShadow,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "rgba(239, 68, 68, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "16px",
                        height: "24px",
                        backgroundColor: "#ef4444",
                        borderRadius: "3px",
                        border: "1px solid #000",
                      }}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  mb={0.5}
                >
                  Cartões Vermelhos
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#991b1b" }}
                >
                  {currentTeam?.red_cards || 0}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Total na época
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                boxShadow: theme.components.card.shadow,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.components.card.hoverShadow,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "rgba(59, 130, 246, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 28, color: "#1e40af" }} />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  mb={0.5}
                >
                  Pontos Totais
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold", color: "#1e40af" }}
                >
                  {currentTeam?.calculated_points || 0}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Média: {avgPoints} por jogo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Alert
          severity="info"
          icon={<Info />}
          sx={{
            mb: 3,
            borderRadius: "12px",
            border: "1px solid #bfdbfe",
            backgroundColor: "#eff6ff",
          }}
        >
          <Typography variant="body2">
            <strong>Sistema de Pontuação:</strong> Amarelo = 5 pontos | Vermelho
            = 20 pontos | Suspensões a cada 3 amarelos (3º, 6º, 9º, etc.)
          </Typography>
        </Alert>

        {currentTeam?.suspendedPlayers?.length > 0 && (
          <Card
            sx={{
              mb: 2.5,
              borderRadius: "16px",
              border: "2px solid #fecaca",
              backgroundColor: "#fef2f2",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonOff
                    sx={{ color: theme.colors.sports.loss, fontSize: 24 }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={theme.colors.sports.loss}
                >
                  Jogadores Suspensos
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {currentTeam.suspendedPlayers.map((player, idx) => (
                  <Chip
                    key={idx}
                    label={player}
                    sx={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px",
                      height: "36px",
                      borderRadius: "10px",
                      "& .MuiChip-icon": {
                        color: "white",
                      },
                    }}
                    icon={<PersonOff />}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {currentTeam?.atRiskPlayers?.length > 0 && (
          <Card
            sx={{
              borderRadius: "16px",
              border: "2px solid #fde68a",
              backgroundColor: "#fffbeb",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(251, 191, 36, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Warning
                    sx={{ color: theme.colors.sports.draw, fontSize: 24 }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={theme.colors.sports.draw}
                >
                  Jogadores em Risco
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {currentTeam.atRiskPlayers.map((player, idx) => (
                  <Chip
                    key={idx}
                    label={player}
                    sx={{
                      backgroundColor: theme.colors.sports.draw,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px",
                      height: "36px",
                      borderRadius: "10px",
                      "& .MuiChip-icon": {
                        color: "white",
                      },
                    }}
                    icon={<Warning />}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderSuspensionsTab = () => {
    return (
      <Box>
        {isAdmin && (
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.colors.text.primary}
            >
              Suspensões
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSuspensionDialog(true)}
              sx={{
                background: theme.colors.themed.purpleGradient,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "12px",
                px: 3,
                py: 1,
                boxShadow: theme.components.card.shadow,
                "&:hover": {
                  boxShadow: theme.components.card.hoverShadow,
                },
              }}
            >
              Adicionar Suspensão
            </Button>
          </Box>
        )}

        {suspensions.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "16px",
              boxShadow: theme.components.card.shadow,
              border: `1px solid ${theme.colors.border.purple}`,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.colors.primary[50] }}>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Jogador
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Jogos
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Motivo
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    Estado
                  </TableCell>
                  {isAdmin && (
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Ações
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {suspensions.map((suspension) => {
                  const player = players.find(
                    (p) => p.id === suspension.player_id
                  );
                  return (
                    <TableRow
                      key={suspension.id}
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
                        <Box display="flex" alignItems="center" gap={1.5}>
                          {player?.photo_url ? (
                            <Avatar
                              src={player.photo_url}
                              sx={{
                                width: 36,
                                height: 36,
                                border: `2px solid ${theme.colors.border.purple}`,
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: theme.colors.primary[100],
                                color: theme.colors.primary[600],
                                border: `2px solid ${theme.colors.border.purple}`,
                              }}
                            >
                              <Person sx={{ fontSize: 20 }} />
                            </Avatar>
                          )}
                          <Typography fontWeight={600}>
                            {suspension.player_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          suspension.suspension_date
                        ).toLocaleDateString("pt-PT")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={suspension.matches_suspended}
                          size="small"
                          sx={{
                            backgroundColor: theme.colors.primary[600],
                            color: "white",
                            fontWeight: 600,
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>
                      <TableCell>{suspension.reason}</TableCell>
                      <TableCell>
                        <Chip
                          label={suspension.active ? "Ativa" : "Cumprida"}
                          color={suspension.active ? "error" : "success"}
                          size="small"
                          sx={{ fontWeight: 600, borderRadius: "8px" }}
                        />
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          {suspension.active && (
                            <Button
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() =>
                                handleDeactivateSuspension(suspension.id)
                              }
                              disabled={loading}
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px",
                              }}
                            >
                              Cumprir
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: "16px",
              border: `2px dashed ${theme.colors.border.purple}`,
            }}
          >
            <PersonOff
              sx={{ fontSize: 60, color: theme.colors.neutral[400], mb: 2 }}
            />
            <Typography
              variant="h6"
              color={theme.colors.text.secondary}
              fontWeight={600}
            >
              Nenhuma suspensão registada
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderPunishmentsTab = () => {
    return (
      <Box>
        {isAdmin && (
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.colors.text.primary}
            >
              Castigos da Equipa
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setPunishmentDialog(true)}
              sx={{
                background: theme.colors.themed.purpleGradient,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "12px",
                px: 3,
                py: 1,
                boxShadow: theme.components.card.shadow,
                "&:hover": {
                  boxShadow: theme.components.card.hoverShadow,
                },
              }}
            >
              Adicionar Castigo
            </Button>
          </Box>
        )}

        {punishmentEvents?.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "16px",
              boxShadow: theme.components.card.shadow,
              border: `1px solid ${theme.colors.border.purple}`,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.colors.primary[50] }}>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DateRange sx={{ fontSize: 18 }} />
                      Data
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Gavel sx={{ fontSize: 18 }} />
                      Tipo
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Info sx={{ fontSize: 18 }} />
                      Descrição
                    </Box>
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person sx={{ fontSize: 18 }} />
                        Jogador
                      </Box>
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: "bold", py: 2 }} align="center">
                    Qtd
                  </TableCell>
                  {isAdmin && (
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Ações
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {punishmentEvents.map((event) => {
                  const player = players.find((p) => p.id === event.player_id);
                  return (
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
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: isMobile ? 150 : 300 }}>
                        {event.description || "-"}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {event.player?.name ? (
                            <Box display="flex" alignItems="center" gap={1.5}>
                              {player?.photo_url ? (
                                <Avatar
                                  src={player.photo_url}
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    border: `2px solid ${theme.colors.border.purple}`,
                                  }}
                                />
                              ) : (
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    backgroundColor: theme.colors.primary[100],
                                    color: theme.colors.primary[600],
                                    border: `2px solid ${theme.colors.border.purple}`,
                                  }}
                                >
                                  <Person sx={{ fontSize: 18 }} />
                                </Avatar>
                              )}
                              <Typography>{event.player.name}</Typography>
                            </Box>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Chip
                          label={event.quantity ?? "-"}
                          size="small"
                          sx={{
                            backgroundColor: theme.colors.primary[600],
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeletePunishment(event.team_punishment_id)
                            }
                            disabled={loading}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: "16px",
              border: `2px dashed ${theme.colors.border.purple}`,
            }}
          >
            <Shield
              sx={{ fontSize: 60, color: theme.colors.neutral[400], mb: 2 }}
            />
            <Typography
              variant="h6"
              color={theme.colors.text.secondary}
              fontWeight={600}
            >
              Nenhum castigo registado
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderPlayersTab = () => {
    return (
      <Box>
        <Typography
          variant="h6"
          mb={3}
          fontWeight="bold"
          color={theme.colors.text.primary}
        >
          Estado dos Jogadores
        </Typography>
        <Grid container spacing={2.5}>
          {players.map((player) => {
            const status = getPlayerYellowCardStatus(player.yellow_cards);
            const yellowCards = playerYellowCardDetails[player.id] || [];

            return (
              <Grid item xs={12} key={player.id}>
                <Card
                  sx={{
                    border: status.warning
                      ? `2px solid ${theme.colors.sports.loss}`
                      : `1px solid ${theme.colors.border.purple}`,
                    backgroundColor: status.warning ? "#fef2f2" : "white",
                    borderRadius: "16px",
                    boxShadow: status.warning
                      ? "0 4px 12px rgba(239, 68, 68, 0.15)"
                      : theme.components.card.shadow,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: status.warning
                        ? "0 8px 20px rgba(239, 68, 68, 0.2)"
                        : theme.components.card.hoverShadow,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        {player.photo_url ? (
                          <Avatar
                            src={player.photo_url}
                            sx={{
                              width: 56,
                              height: 56,
                              border: `3px solid ${theme.colors.border.purple}`,
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: theme.colors.primary[100],
                              color: theme.colors.primary[600],
                              border: `3px solid ${theme.colors.border.purple}`,
                            }}
                          >
                            <Person sx={{ fontSize: 28 }} />
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {player.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {player.yellow_cards}{" "}
                            {player.yellow_cards === 1
                              ? "Cartão Amarelo"
                              : "Cartões Amarelos"}
                          </Typography>
                        </Box>
                      </Box>
                      {status.warning && (
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: "rgba(239, 68, 68, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Warning
                            sx={{
                              color: theme.colors.sports.loss,
                              fontSize: 28,
                            }}
                          />
                        </Box>
                      )}
                    </Box>

                    <Box
                      display="flex"
                      gap={2}
                      alignItems="center"
                      flexWrap="wrap"
                      mb={yellowCards.length > 0 ? 2 : 0}
                    >
                      <Chip
                        label={`${player.yellow_cards} Amarelos`}
                        sx={{
                          backgroundColor: "#fef3c7",
                          fontWeight: 600,
                          fontSize: "14px",
                          height: "32px",
                          borderRadius: "8px",
                        }}
                      />
                      <Chip
                        label={status.text}
                        sx={{
                          backgroundColor: status.warning
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(107, 75, 161, 0.1)",
                          color: status.color,
                          fontWeight: 600,
                          fontSize: "14px",
                          height: "32px",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>

                    {yellowCards.length > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${theme.colors.border.purple}`,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            color: theme.colors.text.primary,
                          }}
                        >
                          Histórico de Cartões Amarelos:
                        </Typography>
                        <Grid container spacing={1}>
                          {yellowCards.map((card, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                              <Box
                                sx={{
                                  backgroundColor:
                                    theme.colors.background.secondary,
                                  padding: 1.5,
                                  borderRadius: "8px",
                                  border: `1px solid ${theme.colors.border.purple}`,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: theme.colors.primary[50],
                                    transform: "translateY(-2px)",
                                    boxShadow: theme.components.card.shadow,
                                  },
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  mb={0.5}
                                >
                                  <Box
                                    sx={{
                                      width: "12px",
                                      height: "16px",
                                      backgroundColor: "#ffcd00",
                                      borderRadius: "2px",
                                      border: "1px solid #000",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 700,
                                      color: theme.colors.text.primary,
                                    }}
                                  >
                                    Cartão #{idx + 1}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "13px", mb: 0.5 }}
                                >
                                  <strong>vs</strong> {card.opponent || "N/A"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: "block",
                                    fontSize: "12px",
                                    mb: 0.5,
                                  }}
                                >
                                  {card.match_date
                                    ? new Date(
                                        card.match_date
                                      ).toLocaleDateString("pt-PT")
                                    : "N/A"}
                                </Typography>
                                {card.minute && (
                                  <Chip
                                    label={`${card.minute}'`}
                                    size="small"
                                    sx={{
                                      height: "20px",
                                      fontSize: "11px",
                                      backgroundColor:
                                        theme.colors.primary[600],
                                      color: "white",
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "90%",
            maxWidth: 1200,
            maxHeight: "90vh",
            backgroundColor: theme.colors.background.card,
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
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
              {currentTeam?.teams?.logo_url && (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "14px",
                    background: "white",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={currentTeam.teams.logo_url}
                    alt="Team logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  Gestão Disciplinar
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.95 }}>
                  {currentTeam?.teams?.short_name}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: theme.colors.background.secondary,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                minHeight: "64px",
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "15px",
                  minHeight: "64px",
                  color: theme.colors.text.secondary,
                  "&.Mui-selected": {
                    color: theme.colors.primary[600],
                  },
                },
                "& .MuiTabs-indicator": {
                  height: "3px",
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: theme.colors.primary[600],
                },
              }}
            >
              <Tab icon={<Info />} iconPosition="start" label="Visão Geral" />
              <Tab
                icon={<PersonOff />}
                iconPosition="start"
                label="Suspensões"
              />
              <Tab icon={<Gavel />} iconPosition="start" label="Castigos" />
              <Tab
                icon={<SportsSoccer />}
                iconPosition="start"
                label="Jogadores"
              />
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: "auto", padding: 4 }}>
            {activeTab === 0 && renderOverviewTab()}
            {activeTab === 1 && renderSuspensionsTab()}
            {activeTab === 2 && renderPunishmentsTab()}
            {activeTab === 3 && renderPlayersTab()}
          </Box>
        </Box>
      </Modal>

      {/* Add Suspension Dialog */}
      <Dialog
        open={suspensionDialog}
        onClose={() => setSuspensionDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <PersonOff />
            <Typography variant="h6" fontWeight="bold">
              Adicionar Suspensão
            </Typography>
          </Box>
          <IconButton
            onClick={() => setSuspensionDialog(false)}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Autocomplete
              options={players}
              getOptionLabel={(option) => option.name}
              onChange={(e, value) =>
                setNewSuspension({ ...newSuspension, player_id: value?.id })
              }
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {option.photo_url ? (
                      <Avatar
                        src={option.photo_url}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: theme.colors.primary[100],
                          color: theme.colors.primary[600],
                        }}
                      >
                        <Person sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}
                    <Typography>{option.name}</Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Jogador"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
            <TextField
              label="Data da Suspensão"
              type="date"
              value={newSuspension.suspension_date}
              onChange={(e) =>
                setNewSuspension({
                  ...newSuspension,
                  suspension_date: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
            <TextField
              label="Jogos Suspensos"
              type="number"
              value={newSuspension.matches_suspended}
              onChange={(e) =>
                setNewSuspension({
                  ...newSuspension,
                  matches_suspended: parseInt(e.target.value),
                })
              }
              required
              inputProps={{ min: 1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
            <TextField
              label="Motivo"
              multiline
              rows={3}
              value={newSuspension.reason}
              onChange={(e) =>
                setNewSuspension({ ...newSuspension, reason: e.target.value })
              }
              placeholder="Ex: 3º cartão amarelo, Agressão, Vermelho direto, etc."
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button
            onClick={() => setSuspensionDialog(false)}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSuspension}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              background: theme.colors.themed.purpleGradient,
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Punishment Dialog */}
      <Dialog
        open={punishmentDialog}
        onClose={() => setPunishmentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Gavel />
            <Typography variant="h6" fontWeight="bold">
              Adicionar Castigo à Equipa
            </Typography>
          </Box>
          <IconButton
            onClick={() => setPunishmentDialog(false)}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Castigo</InputLabel>
              <Select
                value={newPunishment.punishment_type_id}
                onChange={(e) =>
                  setNewPunishment({
                    ...newPunishment,
                    punishment_type_id: e.target.value,
                  })
                }
                label="Tipo de Castigo"
                sx={{
                  borderRadius: "12px",
                }}
              >
                {punishmentTypes.map((type) => (
                  <MenuItem
                    key={type.punishment_type_id}
                    value={type.punishment_type_id}
                  >
                    {type.description} (+{type.points_added} pontos)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Data do Evento"
              type="date"
              value={newPunishment.event_date}
              onChange={(e) =>
                setNewPunishment({
                  ...newPunishment,
                  event_date: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
            <TextField
              label="Descrição"
              multiline
              rows={3}
              value={newPunishment.description}
              onChange={(e) =>
                setNewPunishment({
                  ...newPunishment,
                  description: e.target.value,
                })
              }
              placeholder="Detalhe o que aconteceu..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
            <TextField
              label="Quantidade"
              type="number"
              value={newPunishment.quantity}
              onChange={(e) =>
                setNewPunishment({
                  ...newPunishment,
                  quantity: parseInt(e.target.value),
                })
              }
              helperText="Caso haja vários jogos de suspensão ou múltiplas ocorrências"
              inputProps={{ min: 1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
            <Box>
              <Autocomplete
                options={players}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) =>
                  setNewPunishment({
                    ...newPunishment,
                    player_id: value?.id || null,
                  })
                }
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      {option.photo_url ? (
                        <Avatar
                          src={option.photo_url}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: theme.colors.primary[100],
                            color: theme.colors.primary[600],
                          }}
                        >
                          <Person sx={{ fontSize: 18 }} />
                        </Avatar>
                      )}
                      <Typography>{option.name}</Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Jogador (opcional)"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                )}
              />
              <FormHelperText sx={{ mt: 1, ml: 2 }}>
                Selecione um jogador apenas se o castigo for aplicado a um
                jogador específico
              </FormHelperText>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button
            onClick={() => setPunishmentDialog(false)}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleAddPunishment}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              background: theme.colors.themed.purpleGradient,
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: theme.components.card.shadow,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EnhancedDisciplineModal;
