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
} from "@mui/material";
import {
  Close,
  Edit,
  CalendarToday,
  Timer,
  EmojiEvents,
  Groups,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme";

/**
 * EditCupMatchDialog Component
 * Dialog for editing existing Cup matches
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close callback
 * @param {Function} onSuccess - Success callback
 * @param {Object} match - Match object to edit
 * @param {boolean} cupGroupStage - Whether season has group stage
 */
const EditCupMatchDialog = ({
  open,
  onClose,
  onSuccess,
  match,
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
    home_goals: null,
    away_goals: null,
    round: "",
    group_name: "",
  });

  useEffect(() => {
    if (open && match) {
      fetchTeams();
      // Populate form with existing match data
      setFormData({
        home_team_id: match.home_team_id || "",
        away_team_id: match.away_team_id || "",
        match_date: match.match_date || "",
        match_time: match.match_time || "",
        home_goals: match.home_goals !== null ? match.home_goals : "",
        away_goals: match.away_goals !== null ? match.away_goals : "",
        round: match.round || "",
        group_name: match.group_name || "",
      });
    }
  }, [open, match]);

  const fetchTeams = async () => {
    if (!match) return;

    const { data, error } = await supabase
      .from("teams")
      .select("id, short_name, logo_url")
      .eq("season", match.season)
      .order("short_name");

    if (!error) {
      setTeams(data);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Clear group_name if knockout round is selected
      if (field === "round") {
        const knockoutRounds = ["Semifinal", "Semi 1", "Semi 2", "Final"];
        if (knockoutRounds.includes(value)) {
          updated.group_name = "";
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

    // Validate scores if provided
    if (formData.home_goals !== "" && formData.away_goals === "") {
      setError("Insira o resultado da equipa visitante");
      return false;
    }
    if (formData.away_goals !== "" && formData.home_goals === "") {
      setError("Insira o resultado da equipa da casa");
      return false;
    }

    // Validate negative scores
    if (formData.home_goals < 0 || formData.away_goals < 0) {
      setError("Os resultados não podem ser negativos");
      return false;
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
      home_goals:
        formData.home_goals !== "" ? parseInt(formData.home_goals) : null,
      away_goals:
        formData.away_goals !== "" ? parseInt(formData.away_goals) : null,
      round: formData.round || null,
      group_name: formData.group_name || null,
    };

    const { error } = await supabase
      .from("matches")
      .update(matchData)
      .eq("id", match.id);

    if (error) {
      setError("Erro ao atualizar jogo: " + error.message);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  // Group options
  const groupOptions = ["A", "B", "C"];

  // Round options
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
          <Edit sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Editar Jogo da Taça
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

          {/* Home Goals */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Golos da Casa"
              value={formData.home_goals}
              onChange={(e) => handleChange("home_goals", e.target.value)}
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              helperText="Deixe vazio se o jogo ainda não foi realizado"
            />
          </Grid>

          {/* Away Goals */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Golos Visitante"
              value={formData.away_goals}
              onChange={(e) => handleChange("away_goals", e.target.value)}
              inputProps={{ min: 0 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              helperText="Deixe vazio se o jogo ainda não foi realizado"
            />
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

          {/* Group Selection */}
          {cupGroupStage && (
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Grupo (Fase de Grupos)"
                value={formData.group_name}
                onChange={(e) => handleChange("group_name", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Groups sx={{ mr: 1, color: theme.colors.success[600] }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
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
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Atenção:</strong> Alterar os resultados irá recalcular
            automaticamente as classificações da fase de grupos (se aplicável).
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
            "Guardar Alterações"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCupMatchDialog;
