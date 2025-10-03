import React from "react";
import { Card, CardContent, Box, Typography, Fade } from "@mui/material";
import { RestoreOutlined } from "@mui/icons-material";
import { theme } from "../../../styles/theme";

/**
 * HistoryHeader Component
 * Displays the page title and description
 */
const HistoryHeader = () => {
  return (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          background: theme.colors.themed.heroGradient,
          color: "white",
          mb: 4,
          borderRadius: theme.borderRadius["2xl"],
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CardContent
          sx={{ p: { xs: 3, md: 5 }, position: "relative", zIndex: 1 }}
        >
          <Box textAlign="center">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mb={2}
            >
              <RestoreOutlined sx={{ fontSize: 50 }} />
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                HISTÓRICO
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Vencedores e estatísticas de todas as épocas
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default HistoryHeader;
