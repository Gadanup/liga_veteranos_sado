"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
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
  SportsSoccer,
  CalendarToday,
  Timer,
  EmojiEvents,
} from "@mui/icons-material";
import { theme } from "../../styles/theme";

const CreateMatchDialog = ({ open, onClose, onSuccess, selectedSeason }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    home_team_id: "",
    away_team_id: "",
    match_date: "",
    match_time: "",
    competition_type: "League",
    round: "",
    week: "",
    season: selectedSeason,
  });

  useEffect(() => {
    if (open) {
      fetchTeams();
      setFormData((prev) => ({ ...prev, season: selectedSeason }));
    }
  }, [open, selectedSeason]);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("id, short_name, logo_url")
      .order("short_name");

    if (!error) {
      setTeams(data);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    if (!formData.competition_type) {
      setError("Selecione o tipo de competição");
      return false;
    }
    if (formData.competition_type === "League" && !formData.week) {
      setError("Insira a jornada para jogos da liga");
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
      competition_type: formData.competition_type,
      round: formData.round || null,
      week: formData.week ? parseInt(formData.week) : null,
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
      competition_type: "League",
      round: "",
      week: "",
      season: selectedSeason,
    });
    setError("");
    onClose();
  };

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
          <SportsSoccer sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Criar Novo Jogo
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
                    <img
                      src={team.logo_url}
                      alt={team.short_name}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                    />
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
                    <img
                      src={team.logo_url}
                      alt={team.short_name}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                    />
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

          {/* Competition Type */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Tipo de Competição"
              value={formData.competition_type}
              onChange={(e) => handleChange("competition_type", e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <EmojiEvents
                    sx={{ mr: 1, color: theme.colors.primary[600] }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            >
              <MenuItem value="League">Liga</MenuItem>
              <MenuItem value="Cup">Taça</MenuItem>
              <MenuItem value="SuperCup">Supertaça</MenuItem>
            </TextField>
          </Grid>

          {/* Week (for League) */}
          {formData.competition_type === "League" && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Jornada"
                value={formData.week}
                onChange={(e) => handleChange("week", e.target.value)}
                required
                inputProps={{ min: 1 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
          )}

          {/* Round (for Cup) */}
          {formData.competition_type !== "League" && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ronda"
                value={formData.round}
                onChange={(e) => handleChange("round", e.target.value)}
                placeholder="Ex: Quartos de Final"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            borderColor: theme.colors.neutral[300],
            color: theme.colors.text.secondary,
            "&:hover": {
              borderColor: theme.colors.neutral[400],
              backgroundColor: theme.colors.neutral[50],
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            backgroundColor: theme.colors.primary[600],
            "&:hover": {
              backgroundColor: theme.colors.primary[700],
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Criar Jogo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMatchDialog;
