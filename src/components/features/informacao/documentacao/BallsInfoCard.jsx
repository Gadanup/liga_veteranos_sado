import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Alert,
  Fade,
} from "@mui/material";
import { SportsSoccer, Warning, CheckCircle } from "@mui/icons-material";
import Image from "next/image";
import { theme } from "../../../../styles/theme.js";

/**
 * BallsInfoCard Component
 * Displays official ball specifications and requirements
 */
const BallsInfoCard = () => {
  return (
    <Fade in={true} timeout={1800}>
      <Card
        sx={{
          borderRadius: theme.borderRadius["2xl"],
          height: "100%",
          border: `2px solid ${theme.colors.success[100]}`,
          transition: theme.transitions.normal,
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 12px 28px -5px ${theme.colors.success[300]}40`,
            borderColor: theme.colors.success[300],
          },
        }}
      >
        {/* Card Header Accent */}
        <Box
          sx={{
            height: "6px",
            background: `linear-gradient(90deg, ${theme.colors.success[400]}, ${theme.colors.success[600]})`,
          }}
        />

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Header Section */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: theme.borderRadius.xl,
                backgroundColor: theme.colors.success[50],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SportsSoccer
                sx={{ fontSize: 36, color: theme.colors.success[600] }}
              />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: theme.colors.success[600],
                  fontWeight: "bold",
                  mb: 0.5,
                }}
              >
                Bolas Oficiais
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary }}
              >
                Especificações da liga
              </Typography>
            </Box>
          </Box>

          {/* Specifications Box */}
          <Box
            sx={{
              p: 3,
              borderRadius: theme.borderRadius.xl,
              backgroundColor: theme.colors.success[50],
              border: `2px solid ${theme.colors.success[200]}`,
              mb: 3,
            }}
          >
            {/* Brand and Model */}
            <Box mb={2}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.colors.text.primary,
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: theme.colors.success[600],
                  }}
                >
                  Marca:
                </Box>{" "}
                Select
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.colors.text.primary,
                  mb: 2,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: theme.colors.success[600],
                  }}
                >
                  Modelo:
                </Box>{" "}
                Team ou Liga PRO
              </Typography>

              {/* Warning Alert */}
              <Alert
                severity="warning"
                icon={<Warning />}
                sx={{
                  backgroundColor: theme.colors.warning[50],
                  border: `1px solid ${theme.colors.warning[200]}`,
                  borderRadius: theme.borderRadius.lg,
                  "& .MuiAlert-icon": {
                    color: theme.colors.warning[600],
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.warning[800],
                    fontWeight: "medium",
                  }}
                >
                  Cada equipa em casa deve ter <strong>3 bolas oficiais</strong>
                </Typography>
              </Alert>
            </Box>

            {/* Requirement Chip */}
            <Chip
              icon={<CheckCircle />}
              label="3 bolas obrigatórias"
              size="small"
              sx={{
                backgroundColor: theme.colors.success[600],
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>

          {/* Ball Images */}
          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            alignItems="center"
            sx={{
              p: 3,
              borderRadius: theme.borderRadius.xl,
              backgroundColor: theme.colors.background.tertiary,
              border: `2px solid ${theme.colors.success[100]}`,
            }}
          >
            {[1, 2, 3].map((ballNum) => (
              <Box
                key={ballNum}
                sx={{
                  width: 85,
                  height: 85,
                  borderRadius: theme.borderRadius.lg,
                  overflow: "hidden",
                  border: `2px solid ${theme.colors.success[200]}`,
                  transition: theme.transitions.normal,
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  "&:hover": {
                    transform: "scale(1.05) rotate(5deg)",
                    borderColor: theme.colors.success[400],
                    boxShadow: `0 8px 20px -5px ${theme.colors.success[400]}50`,
                  },
                }}
              >
                <Image
                  src={`/bolas/bola${ballNum}.png`}
                  alt={`Bola Oficial ${ballNum}`}
                  width={85}
                  height={85}
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default BallsInfoCard;
