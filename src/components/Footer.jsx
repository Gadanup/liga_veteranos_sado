"use client";
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import {
  SportsSoccer,
  EmojiEvents,
  Stadium,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";
import { theme } from "../styles/theme.js";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Classificação", href: "/liga/classificacao" },
    { label: "Calendário", href: "/liga/calendario" },
    { label: "Melhores Marcadores", href: "/liga/marcadores" },
    { label: "Disciplina", href: "/liga/disciplina" },
  ];

  const competitions = [
    { label: "Liga Veteranos", href: "/liga/classificacao" },
    { label: "Taça", href: "/taca/sorteio" },
    { label: "Supertaça", href: "/jogos/233" },
  ];

  const information = [
    { label: "Sorteio do Campeonato", href: "/informacao/sorteio" },
    { label: "Documentação", href: "/informacao/documentacao" },
    { label: "Equipas", href: "/galeria/equipas" },
    { label: "Histórico", href: "/historico" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: theme.colors.themed.purpleGradient,
        color: "white",
        pt: 6,
        pb: 2,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <img
                  src="/logo/logo.png"
                  alt="Liga Veteranos do Sado Logo"
                  style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: theme.typography.fontWeight.bold,
                    fontSize: theme.typography.fontSize.lg,
                  }}
                >
                  Liga Veteranos do Sado
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                A competição de futebol veteranos mais prestigiada da região do
                Sado. Unindo paixão, tradição e fair-play desde sempre.
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SportsSoccer
                  sx={{ fontSize: 20, color: theme.colors.accent[500] }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Temporada 2024/25
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <EmojiEvents
                  sx={{ fontSize: 20, color: theme.colors.accent[500] }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  15 Equipas Participantes
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Stadium
                  sx={{ fontSize: 20, color: theme.colors.accent[500] }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Região do Sado
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                mb: 2,
                color: theme.colors.accent[500],
              }}
            >
              Liga
            </Typography>
            <Box>
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  sx={{
                    display: "block",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    mb: 1,
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.transitions.normal,
                    "&:hover": {
                      color: theme.colors.accent[500],
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Competitions */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                mb: 2,
                color: theme.colors.accent[500],
              }}
            >
              Competições
            </Typography>
            <Box>
              {competitions.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  sx={{
                    display: "block",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    mb: 1,
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.transitions.normal,
                    "&:hover": {
                      color: theme.colors.accent[500],
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Information */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                mb: 2,
                color: theme.colors.accent[500],
              }}
            >
              Informação
            </Typography>
            <Box>
              {information.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  sx={{
                    display: "block",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    mb: 1,
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.transitions.normal,
                    "&:hover": {
                      color: theme.colors.accent[500],
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                mb: 2,
                color: theme.colors.accent[500],
              }}
            >
              Contacto
            </Typography>

            <Box mb={3}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationOn
                  sx={{ fontSize: 16, color: theme.colors.accent[500] }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  Setúbal, Portugal
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Email sx={{ fontSize: 16, color: theme.colors.accent[500] }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  info@ligaveteranossado.pt
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Phone sx={{ fontSize: 16, color: theme.colors.accent[500] }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  +351 XXX XXX XXX
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontWeight: theme.typography.fontWeight.semibold,
                mb: 1,
                color: theme.colors.accent[500],
              }}
            >
              Siga-nos
            </Typography>
            <Box display="flex" gap={1}>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: theme.colors.accent[500],
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Facebook sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: theme.colors.accent[500],
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Instagram sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: theme.colors.accent[500],
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <YouTube sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Divider
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            my: 4,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: theme.typography.fontSize.xs,
            }}
          >
            © {currentYear} Liga Veteranos do Sado. Todos os direitos
            reservados.
          </Typography>

          <Box
            display="flex"
            gap={3}
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <Link
              href="/privacy"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                fontSize: theme.typography.fontSize.xs,
                "&:hover": {
                  color: theme.colors.accent[500],
                },
              }}
            >
              Política de Privacidade
            </Link>
            <Link
              href="/terms"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                fontSize: theme.typography.fontSize.xs,
                "&:hover": {
                  color: theme.colors.accent[500],
                },
              }}
            >
              Termos de Utilização
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
