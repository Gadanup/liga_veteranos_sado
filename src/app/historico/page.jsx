"use client";
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Fade } from "@mui/material";
import { Star } from "@mui/icons-material";
import { theme } from "../../styles/theme";
import { supabase } from "../../lib/supabase";

// Components
import HistoryHeader from "../../components/features/historico/HistoryHeader";
import ModernSeasonCard from "../../components/features/historico/ModernSeasonCard";
import HistoricalSeasonsCard from "../../components/features/historico/HistoricalSeasonsCard";
import LoadingSkeleton from "../../components/shared/LoadingSkeleton";

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

    if (error) {
      console.error("Error fetching season winners:", error);
      setLoading(false);
      return;
    }

    // Fetch team info for each scorer
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

      setModernSeasonStats(enrichedData);
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSkeleton message="A carregar histórico..." />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <HistoryHeader />

        {/* Modern Season Stats */}
        {modernSeasonStats.length > 0 && (
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
                <div>
                  <ModernSeasonCard stats={stats} />
                </div>
              </Fade>
            ))}
          </>
        )}

        {/* Historical Seasons */}
        <Fade in={true} timeout={1400}>
          <div>
            <HistoricalSeasonsCard seasons={historicalSeasons} />
          </div>
        </Fade>
      </Container>
    </Box>
  );
};

export default HistoryPage;
