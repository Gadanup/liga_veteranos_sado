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
  Tooltip,
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
  Edit as EditIcon,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";
import { supabase } from "../../../../lib/supabase.ts";
import { useIsAdmin } from "../../../../hooks/admin/useIsAdmin.js";

// The two dialogs double as edit forms, so their initial values live in a
// factory instead of an inline literal: the same shape is needed when opening
// them empty and when resetting them after a save or an edit.
const emptySuspension = () => ({
  player_id: null,
  player_name: "",
  suspension_date: new Date().toISOString().split("T")[0],
  matches_suspended: 1,
  reason: "",
  active: true,
});

const emptyPunishment = () => ({
  punishment_type_id: "",
  event_date: new Date().toISOString().split("T")[0],
  description: "",
  quantity: 1,
  player_id: null,
  player_name: "",
  match_id: null,
});

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

  // Suspension Dialog State. editingSuspensionId is null while adding and
  // holds the row id while editing — that is what tells the dialog whether to
  // insert or to update.
  const [suspensionDialog, setSuspensionDialog] = useState(false);
  const [editingSuspensionId, setEditingSuspensionId] = useState(null);
  const [newSuspension, setNewSuspension] = useState(emptySuspension());

  // Punishment Dialog State
  const [punishmentDialog, setPunishmentDialog] = useState(false);
  const [editingPunishmentId, setEditingPunishmentId] = useState(null);
  const [newPunishment, setNewPunishment] = useState(emptyPunishment());

  // One confirmation dialog serves both deletes. window.confirm was used
  // before, but a native dialog on top of the modal is easy to miss on a
  // phone and cannot name what is about to disappear.
  const [deleteTarget, setDeleteTarget] = useState(null);

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
        .select("id, name, photo_url, transferDate, previousClub")
        .eq("team_id", currentTeam.team_id)
        .order("name");

      if (error) throw error;

      // Fetch previous club names for players who transferred in this season
      const previousClubIds = [
        ...new Set(
          data.filter((p) => p.previousClub).map((p) => Number(p.previousClub))
        ),
      ];
      let previousClubNames = {};
      if (previousClubIds.length > 0) {
        const { data: clubs } = await supabase
          .from("teams")
          .select("id, short_name")
          .in("id", previousClubIds);
        previousClubNames = Object.fromEntries(
          clubs?.map((c) => [c.id, c.short_name]) || []
        );
      }

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
          const player = data.find((p) => p.id === event.player_id);
          const wasAtPreviousClub =
            !!player?.transferDate && match.match_date < player.transferDate;

          // Use the team the player was actually on during this match
          const playerTeamIdAtTime = wasAtPreviousClub
            ? Number(player.previousClub)
            : currentTeam.team_id;

          const isHome = match.home_team_id === playerTeamIdAtTime;
          const opponent = isHome
            ? match.away_team?.short_name
            : match.home_team?.short_name;

          yellowCardDetails[event.player_id].push({
            match_id: event.match_id,
            match_date: match.match_date,
            minute: event.minute,
            opponent: opponent,
            isHome: isHome,
            wasAtPreviousClub,
            previousClubName: wasAtPreviousClub
              ? previousClubNames[Number(player.previousClub)] || null
              : null,
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

      // Also fetch suspensions from players who have since transferred away from this team,
      // but earned their suspension while they were still here (suspension_date < transferDate).
      const { data: transferredOut } = await supabase
        .from("players")
        .select("id, transferDate")
        .eq("previousClub", currentTeam.team_id)
        .not("transferDate", "is", null);

      let transferredSuspensions = [];
      if (transferredOut?.length > 0) {
        const transferredIds = transferredOut.map((p) => p.id);
        const { data: tSusp } = await supabase
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
          .in("player_id", transferredIds)
          .order("suspension_date", { ascending: false });

        transferredSuspensions = (tSusp || [])
          .filter((s) => {
            const p = transferredOut.find((p) => p.id === s.player_id);
            return p && s.suspension_date < p.transferDate;
          })
          .map((s) => ({ ...s, isTransferredPlayer: true }));
      }

      const allSuspensions = [...(data || []), ...transferredSuspensions].sort(
        (a, b) => new Date(b.suspension_date) - new Date(a.suspension_date)
      );

      setSuspensions(
        allSuspensions.map((s) => ({
          ...s,
          player_name: s.players?.name,
        }))
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

  const openAddSuspension = () => {
    setEditingSuspensionId(null);
    setNewSuspension(emptySuspension());
    setSuspensionDialog(true);
  };

  const openEditSuspension = (suspension) => {
    setEditingSuspensionId(suspension.id);
    setNewSuspension({
      player_id: suspension.player_id,
      player_name: suspension.player_name || "",
      suspension_date: suspension.suspension_date,
      matches_suspended: suspension.matches_suspended ?? 1,
      reason: suspension.reason || "",
      active: !!suspension.active,
    });
    setSuspensionDialog(true);
  };

  const closeSuspensionDialog = () => {
    setSuspensionDialog(false);
    setEditingSuspensionId(null);
    setNewSuspension(emptySuspension());
  };

  const openAddPunishment = () => {
    setEditingPunishmentId(null);
    setNewPunishment(emptyPunishment());
    setPunishmentDialog(true);
  };

  const openEditPunishment = (event) => {
    setEditingPunishmentId(event.team_punishment_id);
    setNewPunishment({
      punishment_type_id: event.punishment_type_id ?? "",
      event_date: event.event_date || new Date().toISOString().split("T")[0],
      description: event.description || "",
      quantity: event.quantity ?? 1,
      player_id: event.player_id || null,
      player_name: event.player?.name || "",
      // No field in the dialog edits the match, so carry the existing value
      // through instead of writing null back over it.
      match_id: event.match_id || null,
    });
    setPunishmentDialog(true);
  };

  const closePunishmentDialog = () => {
    setPunishmentDialog(false);
    setEditingPunishmentId(null);
    setNewPunishment(emptyPunishment());
  };

  const handleSaveSuspension = async () => {
    if (!newSuspension.player_id || !newSuspension.reason) {
      showSnackbar("Por favor preencha todos os campos obrigatórios", "error");
      return;
    }

    const isEdit = Boolean(editingSuspensionId);
    setLoading(true);
    try {
      const values = {
        player_id: newSuspension.player_id,
        suspension_date: newSuspension.suspension_date,
        // The number field is empty, not 0, while the admin retypes it, and
        // parseInt("") is NaN — which Postgres rejects.
        matches_suspended: Number(newSuspension.matches_suspended) || 1,
        reason: newSuspension.reason,
        active: newSuspension.active,
      };

      const { error } = isEdit
        ? await supabase
            .from("suspensions")
            .update(values)
            .eq("id", editingSuspensionId)
        : await supabase
            .from("suspensions")
            .insert({ ...values, season: selectedSeason });

      if (error) throw error;

      showSnackbar(
        isEdit
          ? "Suspensão atualizada com sucesso!"
          : "Suspensão adicionada com sucesso!",
        "success"
      );
      closeSuspensionDialog();
      fetchSuspensions();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error saving suspension:", error);
      showSnackbar(
        isEdit ? "Erro ao atualizar suspensão" : "Erro ao adicionar suspensão",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSavePunishment = async () => {
    if (!newPunishment.punishment_type_id) {
      showSnackbar("Por favor selecione o tipo de castigo", "error");
      return;
    }

    const isEdit = Boolean(editingPunishmentId);
    setLoading(true);
    try {
      const values = {
        punishment_type_id: newPunishment.punishment_type_id,
        event_date: newPunishment.event_date,
        description: newPunishment.description,
        quantity: Number(newPunishment.quantity) || 1,
        player_id: newPunishment.player_id || null,
        match_id: newPunishment.match_id || null,
      };

      const { error } = isEdit
        ? await supabase
            .from("team_punishments")
            .update(values)
            .eq("team_punishment_id", editingPunishmentId)
        : await supabase.from("team_punishments").insert({
            ...values,
            team_id: currentTeam.team_id,
            season: selectedSeason,
          });

      if (error) throw error;

      showSnackbar(
        isEdit
          ? "Castigo atualizado com sucesso!"
          : "Castigo adicionado com sucesso!",
        "success"
      );
      closePunishmentDialog();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error saving punishment:", error);
      showSnackbar(
        isEdit ? "Erro ao atualizar castigo" : "Erro ao adicionar castigo",
        "error"
      );
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

  const handleDeleteSuspension = async (suspensionId) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("suspensions")
        .delete()
        .eq("id", suspensionId);

      if (error) throw error;

      showSnackbar("Suspensão eliminada com sucesso!", "success");
      fetchSuspensions();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error("Error deleting suspension:", error);
      showSnackbar("Erro ao eliminar suspensão", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePunishment = async (punishmentId) => {
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { kind, id } = deleteTarget;
    setDeleteTarget(null);
    if (kind === "suspension") {
      await handleDeleteSuspension(id);
    } else {
      await handleDeletePunishment(id);
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
              onClick={openAddSuspension}
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
                          <Box>
                            <Typography fontWeight={600}>
                              {suspension.player_name}
                            </Typography>
                            {suspension.isTransferredPlayer && (
                              <Chip
                                label="Transferido"
                                size="small"
                                sx={{
                                  height: "18px",
                                  fontSize: "10px",
                                  backgroundColor: "rgba(107, 114, 128, 0.15)",
                                  color: "#4b5563",
                                  fontWeight: 600,
                                  mt: 0.25,
                                }}
                              />
                            )}
                          </Box>
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
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            sx={{ whiteSpace: "nowrap" }}
                          >
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
                                  minHeight: 44,
                                }}
                              >
                                Cumprir
                              </Button>
                            )}
                            <Tooltip title="Editar suspensão">
                              <IconButton
                                onClick={() => openEditSuspension(suspension)}
                                disabled={loading}
                                aria-label="Editar suspensão"
                                sx={{
                                  p: 1.5,
                                  color: theme.colors.primary[600],
                                  "&:hover": {
                                    backgroundColor: theme.colors.primary[50],
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar suspensão">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  setDeleteTarget({
                                    kind: "suspension",
                                    id: suspension.id,
                                    label: `a suspensão de ${
                                      suspension.player_name || "este jogador"
                                    } de ${new Date(
                                      suspension.suspension_date
                                    ).toLocaleDateString("pt-PT")}`,
                                  })
                                }
                                disabled={loading}
                                aria-label="Eliminar suspensão"
                                sx={{
                                  p: 1.5,
                                  "&:hover": {
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                  },
                                }}
                              >
                                <Delete sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
              onClick={openAddPunishment}
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
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            <Tooltip title="Editar castigo">
                              <IconButton
                                onClick={() => openEditPunishment(event)}
                                disabled={loading}
                                aria-label="Editar castigo"
                                sx={{
                                  p: 1.5,
                                  color: theme.colors.primary[600],
                                  "&:hover": {
                                    backgroundColor: theme.colors.primary[50],
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar castigo">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  setDeleteTarget({
                                    kind: "punishment",
                                    id: event.team_punishment_id,
                                    label: `o castigo "${
                                      event.punishment_type?.description ||
                                      "sem tipo"
                                    }"${
                                      event.event_date
                                        ? ` de ${new Date(
                                            event.event_date
                                          ).toLocaleDateString("pt-PT")}`
                                        : ""
                                    }`,
                                  })
                                }
                                disabled={loading}
                                aria-label="Eliminar castigo"
                                sx={{
                                  p: 1.5,
                                  "&:hover": {
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                  },
                                }}
                              >
                                <Delete sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
                            : "rgba(20, 51, 74, 0.1)",
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
                                  justifyContent="space-between"
                                  mb={0.5}
                                >
                                  <Box display="flex" alignItems="center" gap={1}>
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
                                  {card.wasAtPreviousClub && (
                                    <Chip
                                      label={
                                        card.previousClubName
                                          ? `Anterior: ${card.previousClubName}`
                                          : "Clube anterior"
                                      }
                                      size="small"
                                      sx={{
                                        height: "18px",
                                        fontSize: "10px",
                                        backgroundColor:
                                          "rgba(107, 114, 128, 0.15)",
                                        color: "#4b5563",
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
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
                                      mt: 0.5,
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
        onClose={closeSuspensionDialog}
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
              {editingSuspensionId ? "Editar Suspensão" : "Adicionar Suspensão"}
            </Typography>
          </Box>
          <IconButton
            onClick={closeSuspensionDialog}
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
              getOptionLabel={(option) => option.name || ""}
              // Controlled, so the dialog can open with the player already
              // chosen when editing. A player who has since transferred away
              // is not in `players`, so fall back to the name on the row.
              value={
                players.find((p) => p.id === newSuspension.player_id) ||
                (newSuspension.player_id
                  ? {
                      id: newSuspension.player_id,
                      name: newSuspension.player_name,
                    }
                  : null)
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) =>
                setNewSuspension({
                  ...newSuspension,
                  player_id: value?.id ?? null,
                  player_name: value?.name ?? "",
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
            {editingSuspensionId && (
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={newSuspension.active ? "ativa" : "cumprida"}
                  label="Estado"
                  onChange={(e) =>
                    setNewSuspension({
                      ...newSuspension,
                      active: e.target.value === "ativa",
                    })
                  }
                  sx={{ borderRadius: "12px" }}
                >
                  <MenuItem value="ativa">Ativa</MenuItem>
                  <MenuItem value="cumprida">Cumprida</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button
            onClick={closeSuspensionDialog}
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
            onClick={handleSaveSuspension}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              minHeight: 44,
              background: theme.colors.themed.purpleGradient,
            }}
          >
            {editingSuspensionId ? "Guardar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Punishment Dialog */}
      <Dialog
        open={punishmentDialog}
        onClose={closePunishmentDialog}
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
              {editingPunishmentId
                ? "Editar Castigo da Equipa"
                : "Adicionar Castigo à Equipa"}
            </Typography>
          </Box>
          <IconButton
            onClick={closePunishmentDialog}
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
                getOptionLabel={(option) => option.name || ""}
                // Controlled for the same reason as the suspension dialog.
                value={
                  players.find((p) => p.id === newPunishment.player_id) ||
                  (newPunishment.player_id
                    ? {
                        id: newPunishment.player_id,
                        name: newPunishment.player_name,
                      }
                    : null)
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, value) =>
                  setNewPunishment({
                    ...newPunishment,
                    player_id: value?.id || null,
                    player_name: value?.name || "",
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
            onClick={closePunishmentDialog}
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
            onClick={handleSavePunishment}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              minHeight: 44,
              background: theme.colors.themed.purpleGradient,
            }}
          >
            {editingPunishmentId ? "Guardar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation, shared by suspensions and punishments */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Eliminar registo?
        </DialogTitle>
        <DialogContent>
          <Typography color={theme.colors.text.secondary}>
            Vai eliminar {deleteTarget?.label}. Esta ação não pode ser
            revertida.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              minHeight: 44,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={confirmDelete}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              minHeight: 44,
            }}
          >
            Eliminar
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
