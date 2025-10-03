import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Fade,
} from "@mui/material";
import { Info, Article } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * DocumentationHeader Component
 * Displays the page title, description, and document count
 *
 * @param {number} documentsCount - Total number of documents available
 */
const DocumentationHeader = ({ documentsCount }) => {
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
        {/* Decorative Circle */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />

        <CardContent
          sx={{ p: { xs: 3, md: 5 }, position: "relative", zIndex: 1 }}
        >
          <Box textAlign="center">
            {/* Icon and Title */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mb={3}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: theme.borderRadius.xl,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Info
                  sx={{
                    fontSize: { xs: 40, md: 50 },
                    color: theme.colors.accent[400],
                  }}
                />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", md: "3rem" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                DOCUMENTAÇÃO
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                opacity: 0.9,
                maxWidth: "600px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Centro de recursos e documentos oficiais da liga
            </Typography>

            {/* Chips */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Chip
                icon={<Article />}
                label="Documentação Oficial"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "16px" },
                  py: 2,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              />
              <Chip
                label={`${documentsCount} Documentos`}
                sx={{
                  backgroundColor: theme.colors.accent[500],
                  color: theme.colors.neutral[900],
                  fontWeight: "bold",
                  fontSize: { xs: "14px", md: "16px" },
                  py: 2,
                }}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default DocumentationHeader;
