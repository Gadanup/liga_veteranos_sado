import React from "react";
import { Box, Container, Typography, Grid, Divider } from "@mui/material";
import { Timeline, MilitaryTech } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

// Components
import SorteioHeader from "../../../components/features/informacao/sorteio/SorteioHeader";
import ChampionshipInfoCard from "../../../components/features/informacao/sorteio/ChampionshipInfoCard";
import DrawMethodologyCard from "../../../components/features/informacao/sorteio/DrawMethodologyCard";
import CupRulesCard from "../../../components/features/informacao/sorteio/CupRulesCard";
import CompetitionFormatFooter from "../../../components/features/informacao/sorteio/CompetitionFormatFooter";

export default function Sorteio() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <SorteioHeader />

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
          <Grid item xs={12} lg={6}>
            <ChampionshipInfoCard />
          </Grid>
          <Grid item xs={12} lg={6}>
            <DrawMethodologyCard />
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

        <CupRulesCard />

        {/* Footer */}
        <CompetitionFormatFooter />
      </Container>
    </Box>
  );
}
