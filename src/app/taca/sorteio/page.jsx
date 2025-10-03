"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { EmojiEvents, SportsSoccer } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

// Components
import CupHeader from "../../../components/features/taca/sorteio/CupHeader";
import CupBracket from "../../../components/features/taca/sorteio/CupBracket";
import CupMobileView from "../../../components/features/taca/sorteio/CupMobileView";
import CupNote from "../../../components/features/taca/sorteio/CupNote";
import { useCupMatches } from "../../../hooks/taca/sorteio/useCupMatches";

const Cup = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { matches, bracketData, loading } = useCupMatches();

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
        <EmojiEvents
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
              "40%": { transform: "translateY(-10px)" },
              "60%": { transform: "translateY(-5px)" },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar eliminatórias da taça...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", paddingY: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <CupHeader />

        {/* Content */}
        {isMobile ? (
          <CupMobileView bracketData={bracketData} router={router} />
        ) : (
          <CupBracket
            bracketData={bracketData}
            router={router}
            isMobile={isMobile}
          />
        )}

        {/* Note */}
        <CupNote />
      </Container>
    </Box>
  );
};

export default Cup;
