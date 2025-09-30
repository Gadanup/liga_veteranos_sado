"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Container,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  SportsSoccer,
  EmojiEvents,
  FilterList,
  Person,
  Groups,
} from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

const Goalscorers = () => {
  const [goalscorers, setGoalscorers] = useState([]);
  const [filteredGoalscorers, setFilteredGoalscorers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [teams, setTeams] = useState([]);
  const [viewMode, setViewMode] = useState("podium");

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Fetch available seasons
  const fetchSeasons = async () => {
    const { data, error } = await supabase
      .from("seasons")
      .select("id, description, is_current")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching seasons:", error);
    } else {
      setSeasons(data);
      // Set the current season as default
      const currentSeason = data.find((s) => s.is_current);
      if (currentSeason) {
        setSelectedSeason(currentSeason.id);
      } else if (data.length > 0) {
        setSelectedSeason(data[0].id);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchSeasons();
  }, []);

  // Load goalscorers when season changes
  useEffect(() => {
    if (selectedSeason) {
      fetchGoalscorers(selectedSeason);
    }
  }, [selectedSeason]);

  useEffect(() => {
    filterGoalscorers();
  }, [searchTerm, teamFilter, goalscorers]);

  const fetchGoalscorers = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);

    // Fetch matches for selected season
    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("id")
      .in("competition_type", ["League", "Cup"])
      .eq("season", seasonId);

    if (matchesError) {
      console.error("Error fetching matches:", matchesError);
      setLoading(false);
      return;
    }

    // Fetch match events (goals) in batches
    const matchIds = matches.map((match) => match.id);
    const fetchAllMatchEvents = async () => {
      let allEvents = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: matchEvents, error } = await supabase
          .from("match_events")
          .select("player_id")
          .in("match_id", matchIds)
          .eq("event_type", 1)
          .range(from, from + batchSize - 1);

        if (error) {
          console.error("Error fetching match events:", error);
          break;
        }

        allEvents = [...allEvents, ...matchEvents];

        if (matchEvents.length < batchSize) {
          hasMore = false;
        } else {
          from += batchSize;
        }
      }

      return allEvents;
    };

    const matchEvents = await fetchAllMatchEvents();

    // Count goals for each player
    const goalsCount = matchEvents.reduce((acc, event) => {
      acc[event.player_id] = (acc[event.player_id] || 0) + 1;
      return acc;
    }, {});

    // Fetch player details along with team_id
    const playerIds = Object.keys(goalsCount);

    if (playerIds.length === 0) {
      setGoalscorers([]);
      setFilteredGoalscorers([]);
      setTeams([]);
      setLoading(false);
      return;
    }

    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name, photo_url, team_id")
      .in("id", playerIds);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      setLoading(false);
      return;
    }

    // Fetch team details using the team_id from the players
    const teamIds = players.map((player) => player.team_id);
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("id, short_name, logo_url")
      .in("id", teamIds);

    if (teamsError) {
      console.error("Error fetching teams:", teamsError);
      setLoading(false);
      return;
    }

    // Set teams for filter
    setTeams(teamsData);

    // Combine goals count, player details, and team details
    const goalscorersData = players.map((player) => {
      const team = teamsData.find((team) => team.id === player.team_id);
      return {
        ...player,
        goals: goalsCount[player.id] || 0,
        team_name: team ? team.short_name : "Unknown Team",
        team_logo_url: team ? team.logo_url : null,
      };
    });

    // Sort by goals in descending order and add original ranking immediately
    const sortedGoalscorers = goalscorersData.sort((a, b) => b.goals - a.goals);

    // Add originalRank to each player immediately
    const goalscorersWithRanking = sortedGoalscorers.map((player, index) => ({
      ...player,
      originalRank: index + 1,
    }));

    setGoalscorers(goalscorersWithRanking);
    setFilteredGoalscorers(goalscorersWithRanking);

    setLoading(false);
  };

  const filterGoalscorers = () => {
    let filtered = goalscorers;

    // Filter by search term (player name)
    if (searchTerm) {
      filtered = filtered.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by team
    if (teamFilter) {
      filtered = filtered.filter((player) => player.team_name === teamFilter);
    }

    setFilteredGoalscorers(filtered);
  };

  const getPodiumPosition = (index) => {
    if (index === 0)
      return {
        color: theme.colors.accent[500],
        size: isMobile ? 100 : 120,
        label: "1º",
      };
    if (index === 1)
      return { color: "#C0C0C0", size: isMobile ? 100 : 120, label: "2º" };
    if (index === 2)
      return { color: "#CD7F32", size: isMobile ? 100 : 120, label: "3º" };
    return null;
  };

  const PodiumCard = ({ player, position }) => {
    const podiumInfo = getPodiumPosition(position);

    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.background.tertiary} 100%)`,
          borderRadius: "20px",
          border: `3px solid ${podiumInfo.color}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.1)`,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          height: "100%",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: `0 12px 40px rgba(0,0,0,0.15)`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            transition: "all 0.3s ease",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${podiumInfo.color}, ${theme.colors.accent[400]})`,
          },
        }}
      >
        <CardContent sx={{ textAlign: "center", padding: isMobile ? 2 : 3 }}>
          {/* Position Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              background: podiumInfo.color,
              color: "white",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {podiumInfo.label}
          </Box>

          {/* Player Photo */}
          <Avatar
            alt={player.name}
            src={player.photo_url}
            sx={{
              width: podiumInfo.size,
              height: podiumInfo.size,
              margin: `${isMobile ? 20 : 30}px auto 16px auto`,
              border: `4px solid ${podiumInfo.color}`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
            }}
          />

          {/* Player Name */}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: "bold",
              color: theme.colors.text.primary,
              marginBottom: 1,
              lineHeight: 1.2,
            }}
          >
            {player.name}
          </Typography>

          {/* Team Info */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            mb={2}
            sx={{
              background: theme.colors.background.secondary,
              padding: "8px 16px",
              borderRadius: "20px",
              border: `1px solid ${theme.colors.border.primary}`,
            }}
          >
            {player.team_logo_url && (
              <Avatar
                alt={player.team_name}
                src={player.team_logo_url}
                sx={{ width: 24, height: 24 }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                fontWeight: "medium",
              }}
            >
              {player.team_name}
            </Typography>
          </Box>

          {/* Goals */}
          <Box
            sx={{
              background: theme.colors.themed.purpleGradient,
              color: "white",
              padding: "12px 20px",
              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <SportsSoccer sx={{ fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {player.goals} {player.goals === 1 ? "Golo" : "Golos"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const PlayerCard = ({ player, index }) => {
    return (
      <Card
        sx={{
          background: theme.colors.background.card,
          borderRadius: "16px",
          border: `2px solid ${theme.colors.border.purple}`,
          boxShadow: theme.components.card.shadow,
          transition: "all 0.3s ease",
          height: "120px",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.components.card.hoverShadow,
            borderColor: theme.colors.accent[500],
          },
          animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
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
        <CardContent
          sx={{
            padding: "16px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            "&:last-child": { paddingBottom: "16px" },
          }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            {/* Ranking */}
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.primary[600],
                fontWeight: "bold",
                minWidth: "35px",
                fontSize: "18px",
              }}
            >
              {player.originalRank}º
            </Typography>

            {/* Player Photo */}
            <Avatar
              alt={player.name}
              src={player.photo_url}
              sx={{
                width: 50,
                height: 50,
                border: `2px solid ${theme.colors.border.purple}`,
                flexShrink: 0,
              }}
            />

            {/* Player Info */}
            <Box flex={1} minWidth={0}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: theme.colors.text.primary,
                  lineHeight: 1.3,
                  fontSize: "15px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {player.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                {player.team_logo_url && (
                  <Avatar
                    alt={player.team_name}
                    src={player.team_logo_url}
                    sx={{ width: 18, height: 18, flexShrink: 0 }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.secondary,
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  {player.team_name}
                </Typography>
              </Box>
            </Box>

            {/* Goals */}
            <Chip
              icon={<SportsSoccer sx={{ fontSize: "16px !important" }} />}
              label={`${player.goals}`}
              sx={{
                backgroundColor: theme.colors.primary[600],
                color: "white",
                fontWeight: "bold",
                fontSize: "13px",
                height: "32px",
                minWidth: "60px",
                flexShrink: 0,
                "& .MuiChip-icon": {
                  color: "white",
                  fontSize: "16px",
                },
                "& .MuiChip-label": {
                  paddingLeft: "6px",
                  paddingRight: "8px",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Memoized filter section
  const FilterSection = React.useMemo(
    () => (
      <Box
        sx={{
          background: theme.colors.background.card,
          padding: isMobile ? 2 : 3,
          borderRadius: "20px",
          border: `2px solid ${theme.colors.border.purple}`,
          boxShadow: theme.components.card.shadow,
          marginBottom: 4,
        }}
      >
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          alignItems={isMobile ? "stretch" : "center"}
        >
          {/* Search Field */}
          <TextField
            fullWidth={isMobile}
            sx={{ flex: isMobile ? 1 : 2 }}
            placeholder="Procurar jogador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.colors.primary[600] }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.colors.accent[500],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.colors.primary[600],
                  },
                },
              },
            }}
          />

          {/* Team Filter */}
          <FormControl sx={{ minWidth: isMobile ? "100%" : 200 }}>
            <InputLabel>Filtrar por Equipa</InputLabel>
            <Select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              label="Filtrar por Equipa"
              sx={{
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
              <MenuItem value="">Todas as Equipas</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.short_name}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={team.logo_url}
                      alt={team.short_name}
                      sx={{ width: 24, height: 24 }}
                    />
                    {team.short_name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* View Toggle */}
          <Box display="flex" gap={1}>
            <Chip
              icon={<EmojiEvents />}
              label="Pódio"
              clickable
              onClick={() => setViewMode("podium")}
              sx={{
                backgroundColor:
                  viewMode === "podium"
                    ? theme.colors.primary[600]
                    : theme.colors.background.secondary,
                color:
                  viewMode === "podium" ? "white" : theme.colors.text.primary,
                "& .MuiChip-icon": {
                  color:
                    viewMode === "podium" ? "white" : theme.colors.text.primary,
                },
              }}
            />
            <Chip
              icon={<FilterList />}
              label="Lista"
              clickable
              onClick={() => setViewMode("list")}
              sx={{
                backgroundColor:
                  viewMode === "list"
                    ? theme.colors.primary[600]
                    : theme.colors.background.secondary,
                color:
                  viewMode === "list" ? "white" : theme.colors.text.primary,
                "& .MuiChip-icon": {
                  color:
                    viewMode === "list" ? "white" : theme.colors.text.primary,
                },
              }}
            />
          </Box>
        </Box>

        {/* Results Count */}
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            marginTop: 2,
            textAlign: "center",
          }}
        >
          {filteredGoalscorers.length}{" "}
          {filteredGoalscorers.length === 1
            ? "jogador encontrado"
            : "jogadores encontrados"}
        </Typography>
      </Box>
    ),
    [
      searchTerm,
      teamFilter,
      teams,
      viewMode,
      filteredGoalscorers.length,
      isMobile,
    ]
  );

  if (loading && seasons.length === 0) {
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
        <SportsSoccer
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "spin 2s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar marcadores...
        </Typography>
      </Box>
    );
  }

  const currentSeasonData = seasons.find((s) => s.id === selectedSeason);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingY: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Title and Season Selector */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "center" : "flex-start"}
          gap={2}
          mb={4}
        >
          {/* Title Section */}
          <Box flex={1} textAlign={isMobile ? "center" : "left"}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={isMobile ? "center" : "flex-start"}
              gap={2}
              mb={1}
            >
              <EmojiEvents
                sx={{ fontSize: 32, color: theme.colors.accent[500] }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: theme.colors.primary[600],
                  fontWeight: "bold",
                  fontSize: "32px",
                }}
              >
                Marcadores
              </Typography>
            </Box>

            {/* Yellow underline */}
            <Box
              sx={{
                width: "60px",
                height: "4px",
                backgroundColor: theme.colors.accent[500],
                margin: isMobile ? "0 auto" : "0",
                borderRadius: "2px",
              }}
            />
          </Box>

          {/* Season Selector */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              backgroundColor: theme.colors.background.card,
              padding: "8px 16px",
              borderRadius: "12px",
              boxShadow: theme.components.card.shadow,
              border: `2px solid ${theme.colors.primary[200]}`,
              minWidth: isMobile ? "auto" : "200px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: "medium",
                color: theme.colors.text.secondary,
                whiteSpace: "nowrap",
              }}
            >
              Época:
            </Typography>
            <select
              value={selectedSeason || ""}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              style={{
                padding: "4px 12px",
                fontSize: "16px",
                fontWeight: "600",
                color: theme.colors.primary[700],
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.description}
                </option>
              ))}
            </select>
          </Box>
        </Box>

        {/* Filter Section */}
        {FilterSection}

        {/* Loading or Content */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="40vh"
            flexDirection="column"
            gap={2}
          >
            <SportsSoccer
              sx={{
                fontSize: 60,
                color: theme.colors.primary[600],
                animation: "spin 2s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: theme.colors.text.secondary }}
            >
              A carregar marcadores...
            </Typography>
          </Box>
        ) : filteredGoalscorers.length === 0 ? (
          /* No results message */
          <Box
            textAlign="center"
            py={8}
            sx={{
              backgroundColor: theme.colors.background.card,
              borderRadius: "20px",
              border: `2px solid ${theme.colors.border.purple}`,
            }}
          >
            <Person
              sx={{ fontSize: 80, color: theme.colors.neutral[400], mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{ color: theme.colors.text.secondary, fontWeight: "medium" }}
            >
              {searchTerm || teamFilter
                ? "Nenhum jogador encontrado"
                : `Ainda não há marcadores para a época ${currentSeasonData?.description}`}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.colors.text.tertiary, mt: 1 }}
            >
              {searchTerm || teamFilter
                ? "Tente ajustar os filtros de pesquisa"
                : "Os golos aparecerão aqui assim que os jogos forem disputados"}
            </Typography>
          </Box>
        ) : (
          /* Content */
          <>
            {viewMode === "podium" &&
            filteredGoalscorers.length >= 3 &&
            !searchTerm.trim() &&
            !teamFilter ? (
              <>
                {/* Top 3 Podium */}
                <Grid container spacing={3} mb={6}>
                  <Grid item xs={12} md={4}>
                    <PodiumCard player={filteredGoalscorers[0]} position={0} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PodiumCard player={filteredGoalscorers[1]} position={1} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PodiumCard player={filteredGoalscorers[2]} position={2} />
                  </Grid>
                </Grid>

                {/* Rest of the players */}
                {filteredGoalscorers.length > 3 && (
                  <Grid container spacing={2}>
                    {filteredGoalscorers.slice(3).map((player, index) => (
                      <Grid item xs={12} sm={6} md={4} key={player.id}>
                        <PlayerCard player={player} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            ) : (
              /* List View or Filtered Results */
              <Grid container spacing={2}>
                {filteredGoalscorers.map((player, index) => (
                  <Grid item xs={12} sm={6} md={4} key={player.id}>
                    <PlayerCard player={player} index={index} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Goalscorers;
