import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Divider,
  Alert,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Close,
  Save,
  EmojiEvents,
  SportsSoccer,
  Shield,
  Add,
  Delete,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { supabase } from "../../../lib/supabase";
import { theme } from "../../../styles/theme.js";
import CardIcon from "./CardIcon";

/**
 * EditMatchDialog Component
 * Dialog for admins to edit match details and manage match events
 *
 * @param {boolean} open - Whether dialog is open
 * @param {Function} onClose - Close dialog callback
 * @param {Object} matchDetails - Current match details
 * @param {Array} suspendedPlayerIds - Array of suspended player IDs
 * @param {Function} onSuccess - Success callback to refresh data
 */
const EditMatchDialog = ({
  open,
  onClose,
  matchDetails,
  suspendedPlayerIds = [],
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    home_goals: "",
    away_goals: "",
    match_sheet: "",
    home_penalties: "",
    away_penalties: "",
  });
  const [matchEvents, setMatchEvents] = useState([]);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [newEvent, setNewEvent] = useState({
    player_id: "",
    event_type: "",
    minute: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isMobile = window.innerWidth <= 768;

  // Event type mapping
  const eventTypes = {
    1: { label: "Golo", icon: "⚽", color: theme.colors.sports.goals },
    2: { label: "Cartão Amarelo", icon: "🟨", color: "#ffcd00" },
    3: { label: "Cartão Vermelho", icon: "🟥", color: "#ef4444" },
    4: { label: "Auto-Golo", icon: "⚽", color: theme.colors.error[500] },
    5: { label: "Duplo Amarelo", icon: "🟨🟥", color: "#ff6b00" },
  };

  useEffect(() => {
    if (matchDetails && open) {
      setError(null); // Clear any previous errors
      loadData();
    }
  }, [matchDetails, open]);

  const loadData = async () => {
    try {
      // Load match details
      setFormData({
        home_goals: matchDetails.home_goals ?? "",
        away_goals: matchDetails.away_goals ?? "",
        match_sheet: matchDetails.match_sheet || "",
        home_penalties: matchDetails.home_penalties ?? "",
        away_penalties: matchDetails.away_penalties ?? "",
      });

      // Load players from both teams
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("id, name, photo_url, team_id, previousClub")
        .or(
          `team_id.eq.${matchDetails.home_team.id},team_id.eq.${matchDetails.away_team.id},previousClub.eq.${matchDetails.home_team.id},previousClub.eq.${matchDetails.away_team.id}`
        );

      if (playersError) {
        console.error("Error loading players:", playersError);
        setError("Erro ao carregar jogadores: " + playersError.message);
        return;
      }

      if (playersData) {
        const home = playersData.filter(
          (p) =>
            p.team_id === matchDetails.home_team.id ||
            p.previousClub === matchDetails.home_team.id
        );
        const away = playersData.filter(
          (p) =>
            (p.team_id === matchDetails.away_team.id ||
              p.previousClub === matchDetails.away_team.id) &&
            !home.find((h) => h.id === p.id)
        );

        // Filter out suspended players and sort by name
        const homeFiltered = home
          .filter((p) => !suspendedPlayerIds.includes(p.id))
          .sort((a, b) => a.name.localeCompare(b.name));
        const awayFiltered = away
          .filter((p) => !suspendedPlayerIds.includes(p.id))
          .sort((a, b) => a.name.localeCompare(b.name));

        setHomePlayers(homeFiltered);
        setAwayPlayers(awayFiltered);
      }

      // Load existing match events
      const { data: eventsData, error: eventsError } = await supabase
        .from("match_events")
        .select("id, match_id, player_id, event_type, minute")
        .eq("match_id", matchDetails.id)
        .order("minute", { ascending: true, nullsFirst: false });

      if (eventsError) {
        console.error("Error loading events:", eventsError);
        setError("Erro ao carregar eventos: " + eventsError.message);
        return;
      }

      if (eventsData && eventsData.length > 0) {
        // Fetch player data for all events
        const playerIds = [...new Set(eventsData.map((e) => e.player_id))];
        const { data: playersForEvents, error: playersForEventsError } =
          await supabase
            .from("players")
            .select("id, name, photo_url, team_id")
            .in("id", playerIds);

        if (playersForEventsError) {
          console.error(
            "Error loading players for events:",
            playersForEventsError
          );
        }

        // Combine events with player data
        const eventsWithPlayers = eventsData.map((event) => ({
          ...event,
          players:
            playersForEvents?.find((p) => p.id === event.player_id) || null,
        }));

        setMatchEvents(eventsWithPlayers);
      } else {
        setMatchEvents([]);
      }
    } catch (err) {
      console.error("Unexpected error in loadData:", err);
      setError("Erro inesperado ao carregar dados");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAddEvent = async () => {
    if (!newEvent.player_id || !newEvent.event_type) {
      setError("Por favor, selecione um jogador e tipo de evento");
      return;
    }

    try {
      // First insert the event
      const { data: insertedEvent, error: insertError } = await supabase
        .from("match_events")
        .insert({
          match_id: matchDetails.id,
          player_id: newEvent.player_id,
          event_type: newEvent.event_type,
          minute: newEvent.minute || null,
        })
        .select("id, match_id, player_id, event_type, minute")
        .single();

      if (insertError) throw insertError;

      // Then fetch the player data separately
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("id, name, photo_url, team_id")
        .eq("id", newEvent.player_id)
        .single();

      if (playerError) throw playerError;

      // Combine the data
      const eventWithPlayer = {
        ...insertedEvent,
        players: playerData,
      };

      setMatchEvents([...matchEvents, eventWithPlayer]);
      setNewEvent({ player_id: "", event_type: "", minute: "" });
      setError(null);
    } catch (err) {
      console.error("Error adding event:", err);
      setError(err.message || "Erro ao adicionar evento");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const { error: deleteError } = await supabase
        .from("match_events")
        .delete()
        .eq("id", eventId);

      if (deleteError) throw deleteError;

      setMatchEvents(matchEvents.filter((e) => e.id !== eventId));
    } catch (err) {
      setError(err.message || "Erro ao remover evento");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        home_goals:
          formData.home_goals === "" ? null : parseInt(formData.home_goals),
        away_goals:
          formData.away_goals === "" ? null : parseInt(formData.away_goals),
        match_sheet: formData.match_sheet || null,
        home_penalties:
          formData.home_penalties === ""
            ? null
            : parseInt(formData.home_penalties),
        away_penalties:
          formData.away_penalties === ""
            ? null
            : parseInt(formData.away_penalties),
      };

      const { error: updateError } = await supabase
        .from("matches")
        .update(updateData)
        .eq("id", matchDetails.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro ao atualizar o jogo");
    } finally {
      setLoading(false);
    }
  };

  const getPlayerTeam = (playerId) => {
    if (homePlayers.find((p) => p.id === playerId)) return "home";
    if (awayPlayers.find((p) => p.id === playerId)) return "away";
    return null;
  };

  if (!matchDetails) return null;

  const isCup = matchDetails.competition_type === "Cup";
  const isLeague = matchDetails.competition_type === "League";
  const isSupercup = matchDetails.competition_type === "Supercup";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : "20px",
          maxHeight: isMobile ? "100vh" : "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: theme.colors.themed.purpleGradient,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiEvents />
          <Typography variant="h6" fontWeight="bold">
            Editar Jogo
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: theme.colors.background.tertiary,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: isMobile ? "14px" : "16px",
            },
          }}
        >
          <Tab label="Resultado" icon={<SportsSoccer />} iconPosition="start" />
          <Tab label="Eventos" icon={<Shield />} iconPosition="start" />
        </Tabs>
      </Box>

      <DialogContent sx={{ mt: 2, px: isMobile ? 2 : 3 }}>
        {/* Match Info */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: "12px",
          }}
        >
          <Typography
            variant="body2"
            color={theme.colors.text.secondary}
            gutterBottom
          >
            {matchDetails.home_team.short_name} vs{" "}
            {matchDetails.away_team.short_name}
          </Typography>
          <Typography variant="caption" color={theme.colors.text.secondary}>
            {dayjs(matchDetails.match_date).format("DD/MM/YYYY")} •{" "}
            {matchDetails.match_time}
            {" • "}
            {isCup && `Taça - Ronda ${matchDetails.round}`}
            {isLeague && `Campeonato - Jornada ${matchDetails.week}`}
            {isSupercup && "Supertaça"}
          </Typography>
        </Box>

        {/* Tab 0: Match Result */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={theme.colors.primary[600]}
                gutterBottom
              >
                Resultado
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Golos ${matchDetails.home_team.short_name}`}
                type="number"
                value={formData.home_goals}
                onChange={(e) => handleChange("home_goals", e.target.value)}
                inputProps={{ min: 0 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Golos ${matchDetails.away_team.short_name}`}
                type="number"
                value={formData.away_goals}
                onChange={(e) => handleChange("away_goals", e.target.value)}
                inputProps={{ min: 0 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {isCup && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color={theme.colors.primary[600]}
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    Grandes Penalidades (Opcional)
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={`Penáltis ${matchDetails.home_team.short_name}`}
                    type="number"
                    value={formData.home_penalties}
                    onChange={(e) =>
                      handleChange("home_penalties", e.target.value)
                    }
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={`Penáltis ${matchDetails.away_team.short_name}`}
                    type="number"
                    value={formData.away_penalties}
                    onChange={(e) =>
                      handleChange("away_penalties", e.target.value)
                    }
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={theme.colors.primary[600]}
                gutterBottom
                sx={{ mt: 2 }}
              >
                Ficha de Jogo Completa
              </Typography>
              <Typography
                variant="caption"
                color={theme.colors.text.secondary}
                paragraph
              >
                Link para a ficha de jogo oficial preenchida
              </Typography>
              <TextField
                fullWidth
                label="Link da Ficha de Jogo"
                value={formData.match_sheet}
                onChange={(e) => handleChange("match_sheet", e.target.value)}
                placeholder="https://..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Match Events */}
        {activeTab === 1 && (
          <Box>
            {/* Add New Event Section */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: theme.colors.background.tertiary,
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={theme.colors.primary[600]}
                gutterBottom
              >
                Adicionar Evento
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Jogador</InputLabel>
                    <Select
                      value={newEvent.player_id}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, player_id: e.target.value })
                      }
                      label="Jogador"
                      sx={{ borderRadius: "12px" }}
                    >
                      <MenuItem disabled>
                        <Typography
                          variant="caption"
                          color={theme.colors.primary[600]}
                        >
                          {matchDetails.home_team.short_name}
                        </Typography>
                      </MenuItem>
                      {homePlayers.map((player) => (
                        <MenuItem key={player.id} value={player.id}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={player.photo_url}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="body2">
                              {player.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <MenuItem disabled>
                        <Typography
                          variant="caption"
                          color={theme.colors.primary[600]}
                        >
                          {matchDetails.away_team.short_name}
                        </Typography>
                      </MenuItem>
                      {awayPlayers.map((player) => (
                        <MenuItem key={player.id} value={player.id}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={player.photo_url}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="body2">
                              {player.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Evento</InputLabel>
                    <Select
                      value={newEvent.event_type}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, event_type: e.target.value })
                      }
                      label="Tipo de Evento"
                      sx={{ borderRadius: "12px" }}
                    >
                      {Object.entries(eventTypes).map(([key, value]) => (
                        <MenuItem key={key} value={parseInt(key)}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>{value.icon}</span>
                            <Typography variant="body2">
                              {value.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Min"
                    type="number"
                    value={newEvent.minute}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, minute: e.target.value })
                    }
                    inputProps={{ min: 0, max: 120 }}
                    placeholder="90"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddEvent}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: theme.colors.primary[600],
                      "&:hover": { backgroundColor: theme.colors.primary[700] },
                    }}
                  >
                    Adicionar Evento
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Existing Events List */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color={theme.colors.primary[600]}
              gutterBottom
            >
              Eventos do Jogo ({matchEvents.length})
            </Typography>

            {matchEvents.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: theme.colors.background.tertiary,
                  borderRadius: "12px",
                }}
              >
                <Typography variant="body2" color={theme.colors.text.secondary}>
                  Nenhum evento registado
                </Typography>
              </Box>
            ) : (
              <List
                sx={{
                  maxHeight: isMobile ? "300px" : "400px",
                  overflow: "auto",
                }}
              >
                {matchEvents.map((event) => {
                  const eventInfo = eventTypes[event.event_type];
                  const playerTeam = getPlayerTeam(event.player_id);

                  return (
                    <ListItem
                      key={event.id}
                      sx={{
                        mb: 1,
                        backgroundColor: theme.colors.background.tertiary,
                        borderRadius: "12px",
                        border: `2px solid ${
                          playerTeam === "home"
                            ? theme.colors.primary[200]
                            : theme.colors.accent[200]
                        }`,
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteEvent(event.id)}
                          sx={{ color: theme.colors.error[500] }}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={event.players?.photo_url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                          >
                            <Typography variant="body1" fontWeight="600">
                              {event.players?.name || "Jogador Desconhecido"}
                            </Typography>
                            <Chip
                              label={eventInfo?.label}
                              size="small"
                              sx={{
                                backgroundColor: eventInfo?.color,
                                color: "white",
                                fontWeight: 600,
                                fontSize: "11px",
                              }}
                            />
                            {event.minute && (
                              <Chip
                                label={`${event.minute}'`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "11px" }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color={theme.colors.text.secondary}
                          >
                            {playerTeam === "home"
                              ? matchDetails.home_team.short_name
                              : matchDetails.away_team.short_name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        )}

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 3, borderRadius: "12px" }}>
            Jogo atualizado com sucesso!
          </Alert>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{ p: 3, gap: 2, backgroundColor: theme.colors.background.tertiary }}
      >
        <Button
          onClick={onClose}
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
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={<Save />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            backgroundColor: theme.colors.primary[600],
            "&:hover": { backgroundColor: theme.colors.primary[700] },
          }}
        >
          {loading ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMatchDialog;
