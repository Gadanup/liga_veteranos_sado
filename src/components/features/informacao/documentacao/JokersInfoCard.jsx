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
import { Star, Schedule, CheckCircle, Groups } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * JokersInfoCard Component
 * Displays information about Jokers eligibility and rules
 */
const JokersInfoCard = () => {
  return (
    <Fade in={true} timeout={1600}>
      <Card
        sx={{
          borderRadius: theme.borderRadius["2xl"],
          height: "100%",
          border: `2px solid ${theme.colors.accent[100]}`,
          transition: theme.transitions.normal,
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 12px 28px -5px ${theme.colors.accent[300]}40`,
            borderColor: theme.colors.accent[300],
          },
        }}
      >
        {/* Card Header Accent */}
        <Box
          sx={{
            height: "6px",
            background: `linear-gradient(90deg, ${theme.colors.accent[400]}, ${theme.colors.accent[600]})`,
          }}
        />

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Header Section */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: theme.borderRadius.xl,
                backgroundColor: theme.colors.accent[50],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Star sx={{ fontSize: 36, color: theme.colors.accent[600] }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: theme.colors.accent[600],
                  fontWeight: "bold",
                  mb: 0.5,
                }}
              >
                Jokers
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary }}
              >
                Regulamentação especial
              </Typography>
            </Box>
          </Box>

          {/* Main Content Box */}
          <Box
            sx={{
              p: 3,
              borderRadius: theme.borderRadius.xl,
              backgroundColor: theme.colors.accent[50],
              border: `2px solid ${theme.colors.accent[200]}`,
            }}
          >
            {/* Title */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Schedule
                sx={{ color: theme.colors.accent[600], fontSize: 28 }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme.colors.accent[700],
                  fontWeight: "bold",
                }}
              >
                Critérios de Elegibilidade
              </Typography>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.colors.text.primary,
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                A idade mínima para inscrição de Jokers é de{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: theme.colors.accent[600],
                    backgroundColor: theme.colors.accent[100],
                    px: 1,
                    py: 0.5,
                    borderRadius: theme.borderRadius.sm,
                  }}
                >
                  33 anos
                </Box>
                , limitados a{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: theme.colors.accent[600],
                    backgroundColor: theme.colors.accent[100],
                    px: 1,
                    py: 0.5,
                    borderRadius: theme.borderRadius.sm,
                  }}
                >
                  2 jokers por equipa
                </Box>
                .
              </Typography>
            </Box>

            {/* Chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<CheckCircle />}
                label="33+ anos"
                size="small"
                sx={{
                  backgroundColor: theme.colors.accent[600],
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Chip
                icon={<Groups />}
                label="Max. 2 por equipa"
                size="small"
                sx={{
                  backgroundColor: theme.colors.accent[600],
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default JokersInfoCard;
