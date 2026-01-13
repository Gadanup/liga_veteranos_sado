"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Close,
  EmojiEvents,
  CalendarToday,
  Timer,
  Groups,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme";

/**
 * CreateCupMatchDialog Component
 * Dialog for creating Cup matches with group stage or knockout round selection
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close callback
 * @param {Function} onSuccess - Success callback
 * @param {number} selectedSeason - Current season ID
 * @param {boolean} cupGroupStage - Whether season has group stage
 */
const CreateCupMatchDialog = ({
  open,
  onClose,
  onSuccess,
  selectedSeason,
  cupGroupStage = false,
}) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    home_team_id: "",
    away_team_id: "",
    match_date: "",
    match_time: "",
    competition_type: "Cup",
    round: "",
    group_name: "",
    week: "", // Jornada for group stage matches
    season: selectedSeason,
  });

  useEffect(() => {
    if (open) {
      fetchTeams();
      setFormData((prev) => ({
        ...prev,
        season: selectedSeason,
        competition_type: "Cup",
      }));
    }
  }, [open, selectedSeason]);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("id, short_name, logo_url")
      .eq("season", selectedSeason)
      .order("short_name");

    if (!error) {
      setTeams(data);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Clear group_name and week if knockout round is selected
      if (field === "round") {
        const knockoutRounds = ["Semifinal", "Semi 1", "Semi 2", "Final"];
        if (knockoutRounds.includes(value)) {
          updated.group_name = "";
          updated.week = "";
        }
      }

      // Clear round if group is selected
      if (field === "group_name" && value) {
        updated.round = "";
      }

      return updated;
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.home_team_id || !formData.away_team_id) {
      setError("Selecione ambas as equipas");
      return false;
    }
    if (formData.home_team_id === formData.away_team_id) {
      setError("As equipas devem ser diferentes");
      return false;
    }
    if (!formData.match_date) {
      setError("Selecione a data do jogo");
      return false;
    }

    // Validate group stage or round selection
    if (cupGroupStage) {
      if (!formData.group_name && !formData.round) {
        setError("Selecione um grupo ou uma eliminatória");
        return false;
      }
      // If group is selected, week (jornada) is required
      if (formData.group_name && !formData.week) {
        setError("Insira a jornada para jogos da fase de grupos");
        return false;
      }
    } else {
      if (!formData.round) {
        setError("Selecione a eliminatória");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const matchData = {
      home_team_id: parseInt(formData.home_team_id),
      away_team_id: parseInt(formData.away_team_id),
      match_date: formData.match_date,
      match_time: formData.match_time || null,
      competition_type: "Cup",
      round: formData.round || null,
      group_name: formData.group_name || null,
      week: formData.week ? parseInt(formData.week) : null, // Jornada
      season: parseInt(formData.season),
      home_goals: null,
      away_goals: null,
    };

    const { error } = await supabase.from("matches").insert([matchData]);

    if (error) {
      setError("Erro ao criar jogo: " + error.message);
      setLoading(false);
    } else {
      setLoading(false);
      handleClose();
      onSuccess();
    }
  };

  const handleClose = () => {
    setFormData({
      home_team_id: "",
      away_team_id: "",
      match_date: "",
      match_time: "",
      competition_type: "Cup",
      round: "",
      group_name: "",
      week: "",
      season: selectedSeason,
    });
    setError("");
    onClose();
  };

  // Group options
  const groupOptions = ["A", "B", "C"];

  // Round options based on mode
  const roundOptions = cupGroupStage
    ? ["Semifinal", "Semi 1", "Semi 2", "Final"]
    : [
        "Oitavos de Final",
        "Quartos de Final",
        "Semifinal",
        "Semi 1",
        "Semi 2",
        "Final",
      ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: theme.colors.background.card,
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
          <EmojiEvents sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Criar Jogo da Taça
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} mt={1}>
          {/* Home Team */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Equipa da Casa"
              value={formData.home_team_id}
              onChange={(e) => handleChange("home_team_id", e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {team.logo_url && (
                      <img
                        src={team.logo_url}
                        alt={team.short_name}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                    )}
                    {team.short_name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Away Team */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Equipa Visitante"
              value={formData.away_team_id}
              onChange={(e) => handleChange("away_team_id", e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {team.logo_url && (
                      <img
                        src={team.logo_url}
                        alt={team.short_name}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                    )}
                    {team.short_name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Match Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Data do Jogo"
              value={formData.match_date}
              onChange={(e) => handleChange("match_date", e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <CalendarToday
                    sx={{ mr: 1, color: theme.colors.primary[600] }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          {/* Match Time */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="time"
              label="Hora do Jogo"
              value={formData.match_time}
              onChange={(e) => handleChange("match_time", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <Timer sx={{ mr: 1, color: theme.colors.primary[600] }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          {/* Group Selection (Group Stage Mode Only) */}
          {cupGroupStage && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Grupo (Fase de Grupos)"
                  value={formData.group_name}
                  onChange={(e) => handleChange("group_name", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Groups
                        sx={{ mr: 1, color: theme.colors.success[600] }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                  helperText="Deixe vazio se for eliminatória"
                >
                  <MenuItem value="">
                    <em>Nenhum (Eliminatória)</em>
                  </MenuItem>
                  {groupOptions.map((group) => (
                    <MenuItem key={group} value={group}>
                      Grupo {group}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Jornada Field (Only when group is selected) */}
              {formData.group_name && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Jornada"
                    value={formData.week}
                    onChange={(e) => handleChange("week", e.target.value)}
                    required
                    inputProps={{ min: 1, max: 10 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                    helperText="Número da jornada (1, 2, 3...)"
                  />
                </Grid>
              )}
            </>
          )}

          {/* Round Selection */}
          <Grid item xs={12} md={cupGroupStage ? 6 : 12}>
            <TextField
              select
              fullWidth
              label={
                cupGroupStage ? "Eliminatória (Final Four)" : "Eliminatória"
              }
              value={formData.round}
              onChange={(e) => handleChange("round", e.target.value)}
              InputProps={{
                startAdornment: (
                  <EmojiEvents
                    sx={{ mr: 1, color: theme.colors.accent[600] }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              helperText={
                cupGroupStage ? "Deixe vazio se for fase de grupos" : undefined
              }
            >
              {cupGroupStage && (
                <MenuItem value="">
                  <em>Nenhuma (Fase de Grupos)</em>
                </MenuItem>
              )}
              {roundOptions.map((round) => (
                <MenuItem key={round} value={round}>
                  {round}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Info Box */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            {cupGroupStage ? (
              <>
                <strong>Fase de Grupos:</strong> Selecione um grupo (A, B ou C)
                e deixe a eliminatória vazia.
                <br />
                <strong>Final Four:</strong> Deixe o grupo vazio e selecione a
                eliminatória (Semi 1, Semi 2 ou Final).
              </>
            ) : (
              <>
                <strong>Taça Eliminatória:</strong> Selecione a eliminatória
                correspondente ao jogo.
              </>
            )}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.colors.text.secondary,
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: theme.colors.themed.purpleGradient,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              background: theme.colors.primary[700],
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Criar Jogo"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCupMatchDialog;
