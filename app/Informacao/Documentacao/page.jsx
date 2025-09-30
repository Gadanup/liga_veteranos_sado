"use client";
import React, { useState } from "react";
import {
  Typography,
  Divider,
  Box,
  Link,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Button,
  Fade,
  Collapse,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import Image from "next/image";
import {
  OpenInNew,
  Description,
  Info,
  SportsSoccer,
  Groups,
  Assignment,
  Download,
  Rule,
  Person,
  AccountBox,
  HelpOutline,
  Article,
  Star,
  Schedule,
  ExpandMore,
  GetApp,
  CheckCircle,
  Warning,
  InfoOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

export default function Documentacao() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredDocument, setHoveredDocument] = useState(null);

  const documents = [
    {
      id: 1,
      text: "REGULAMENTO 2024/2025",
      link: "https://drive.google.com/file/d/1PntSOOChfXJMn2_Tdyp0mU8qcy_HhJMj/view?usp=sharing",
      icon: <Rule />,
      color: theme.colors.primary[500],
      description: "Regulamento oficial da temporada",
      category: "Essencial",
      fileType: "PDF",
      size: "2.4 MB",
      lastUpdated: "15 Set 2024",
      priority: "high",
    },
    {
      id: 2,
      text: "RELATÓRIO DO ÁRBITRO",
      link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2FVQUlMd1lGV1FoQnFh&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21742&parId=101CD27EC6E1FDB3%21195&o=OneUp",
      icon: <Assignment />,
      color: theme.colors.secondary[500],
      description: "Formulário de relatório oficial",
      category: "Formulário",
      fileType: "DOCX",
      size: "150 KB",
      lastUpdated: "10 Set 2024",
      priority: "medium",
    },
    {
      id: 3,
      text: "FICHA DE JOGO EM BRANCO",
      link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2RZTWpwY0drYUtMbWY2&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21743&parId=101CD27EC6E1FDB3%21195&o=OneUp",
      icon: <Description />,
      color: theme.colors.accent[600],
      description: "Modelo de ficha para jogos",
      category: "Formulário",
      fileType: "DOCX",
      size: "200 KB",
      lastUpdated: "08 Set 2024",
      priority: "high",
    },
    {
      id: 4,
      text: "FICHA DE TRANSFERÊNCIA",
      link: "https://drive.google.com/file/d/1Vvxz82fHThEZyDWsx9hDALXRsjUFKWeh/view",
      icon: <Person />,
      color: theme.colors.warning[500],
      description: "Documento para transferências",
      category: "Formulário",
      fileType: "PDF",
      size: "180 KB",
      lastUpdated: "05 Set 2024",
      priority: "medium",
    },
    {
      id: 5,
      text: "FICHA DE INSCRIÇÃO DE JOGADOR",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSe48ZQn639DBzpV-J4xyn_FkyisjIxKODyZh4O8ebKgwqFs0w/viewform",
      icon: <AccountBox />,
      color: theme.colors.success[500],
      description: "Formulário de inscrição online",
      category: "Online",
      fileType: "FORM",
      size: "Online",
      lastUpdated: "01 Set 2024",
      priority: "high",
    },
    {
      id: 6,
      text: "COMO PREENCHER A FICHA DE JOGO",
      link: "https://drive.google.com/file/d/1LOZ528QWkKpG1IP4rz9J3KMiFISjsv9j/view",
      icon: <HelpOutline />,
      color: theme.colors.error[500],
      description: "Guia de preenchimento",
      category: "Guia",
      fileType: "PDF",
      size: "1.2 MB",
      lastUpdated: "28 Ago 2024",
      priority: "medium",
    },
  ];

  const quickActions = [
    {
      title: "Ficha de Inscrição 2025/2026",
      description: "Download do formulário de inscrição",
      icon: <GetApp />,
      color: theme.colors.primary[500],
      action: () => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement("a");
        link.href = "/docs/FICHA_INSCRIÇÃO_2025-2026.pdf"; // Replace with your actual PDF filename
        link.download = "Ficha_Inscricao_2025_2026.pdf"; // The name it will be saved as
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      title: "Calendário 2025/2026",
      description: "Download do calendário",
      icon: <GetApp />,
      color: theme.colors.primary[500],
      action: () => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement("a");
        link.href = "/docs/CALENDARIO_2025-2026.xlsx";
        link.download = "Calendario_2025_2026.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },

    // {
    //   title: "Regulamento Rápido",
    //   description: "Ver resumo do regulamento",
    //   icon: <MenuIcon />,
    //   color: theme.colors.accent[600],
    //   action: () => setExpandedCard(expandedCard === "rules" ? null : "rules"),
    // },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.colors.error[500];
      case "medium":
        return theme.colors.warning[500];
      default:
        return theme.colors.success[500];
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Essencial":
        return theme.colors.primary[500];
      case "Formulário":
        return theme.colors.secondary[500];
      case "Online":
        return theme.colors.success[500];
      case "Guia":
        return theme.colors.warning[500];
      default:
        return theme.colors.neutral[500];
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Enhanced Header Section */}
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
                    label={`${documents.length} Documentos`}
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

        {/* Quick Actions */}
        <Fade in={true} timeout={1000}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: theme.borderRadius.xl,
                    backgroundColor: theme.colors.background.tertiary,
                    border: `2px solid ${theme.colors.border.primary}`,
                    cursor: "pointer",
                    transition: theme.transitions.normal,
                    "&:hover": {
                      backgroundColor: `${action.color}10`,
                      borderColor: `${action.color}30`,
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows.lg,
                    },
                  }}
                  onClick={action.action}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: theme.borderRadius.lg,
                        backgroundColor: `${action.color}15`,
                        color: action.color,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.text.secondary }}
                      >
                        {action.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Fade>

        {/* Quick Rules Collapse */}
        <Collapse in={expandedCard === "rules"}>
          <Alert
            severity="info"
            icon={<InfoOutlined />}
            sx={{
              mb: 4,
              borderRadius: theme.borderRadius.xl,
              backgroundColor: theme.colors.primary[50],
              border: `2px solid ${theme.colors.primary[200]}`,
            }}
          >
            <AlertTitle
              sx={{ fontWeight: "bold", color: theme.colors.primary[700] }}
            >
              Pontos Principais do Regulamento
            </AlertTitle>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Jokers:</strong> Idade mínima 33 anos, máximo 2 por
                equipa
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Bolas:</strong> 3 bolas oficiais Select obrigatórias
                para jogos em casa
              </Typography>
              <Typography variant="body2">
                • <strong>Documentos:</strong> Fichas de jogo e relatórios
                obrigatórios
              </Typography>
            </Box>
          </Alert>
        </Collapse>

        {/* Enhanced Documents Section */}
        <Fade in={true} timeout={1200}>
          <Card
            sx={{
              mb: 4,
              borderRadius: theme.borderRadius["2xl"],
              border: `2px solid ${theme.colors.primary[100]}`,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: theme.borderRadius.xl,
                    backgroundColor: theme.colors.primary[50],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Download
                    sx={{
                      fontSize: 32,
                      color: theme.colors.primary[600],
                    }}
                  />
                </Box>
                <Box flex={1}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.colors.primary[600],
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    Documentos Oficiais
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    Acesso rápido a todos os documentos necessários
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {documents.map((doc, index) => (
                  <Grid item xs={12} md={6} key={doc.id}>
                    <Fade in={true} timeout={1400 + index * 100}>
                      <Paper
                        elevation={0}
                        sx={{
                          textDecoration: "none",
                          borderRadius: theme.borderRadius.xl,
                          backgroundColor: theme.colors.background.tertiary,
                          border: `2px solid transparent`,
                          transition: theme.transitions.normal,
                          cursor: "pointer",
                          overflow: "hidden",
                          "&:hover": {
                            backgroundColor: `${doc.color}08`,
                            borderColor: `${doc.color}25`,
                            transform: "translateY(-4px)",
                            boxShadow: `0 8px 25px -5px ${doc.color}30`,
                          },
                        }}
                        component={Link}
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHoveredDocument(doc.id)}
                        onMouseLeave={() => setHoveredDocument(null)}
                      >
                        {/* Priority Indicator */}
                        <Box
                          sx={{
                            height: "4px",
                            backgroundColor: getPriorityColor(doc.priority),
                            width: "100%",
                          }}
                        />

                        <Box sx={{ p: 3 }}>
                          {/* Header with Icon and Category */}
                          <Box
                            display="flex"
                            alignItems="flex-start"
                            gap={2}
                            mb={2}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: theme.borderRadius.lg,
                                backgroundColor: `${doc.color}15`,
                                color: doc.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: theme.transitions.fast,
                                transform:
                                  hoveredDocument === doc.id
                                    ? "scale(1.1)"
                                    : "scale(1)",
                              }}
                            >
                              {doc.icon}
                            </Box>
                            <Box flex={1} minWidth={0}>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={1}
                              >
                                <Chip
                                  label={doc.category}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getCategoryColor(doc.category)}15`,
                                    color: getCategoryColor(doc.category),
                                    fontWeight: "bold",
                                    fontSize: "0.75rem",
                                  }}
                                />
                                <Chip
                                  label={doc.fileType}
                                  size="small"
                                  sx={{
                                    backgroundColor: theme.colors.neutral[100],
                                    color: theme.colors.neutral[600],
                                    fontSize: "0.7rem",
                                  }}
                                />
                              </Box>
                            </Box>
                            <Tooltip title="Abrir documento">
                              <IconButton
                                size="small"
                                sx={{
                                  color: theme.colors.text.tertiary,
                                  transition: theme.transitions.fast,
                                  "&:hover": {
                                    color: doc.color,
                                    backgroundColor: `${doc.color}10`,
                                  },
                                }}
                              >
                                <OpenInNew fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          {/* Document Title and Description */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: theme.colors.text.primary,
                              mb: 1,
                              fontSize: { xs: "1rem", md: "1.1rem" },
                              lineHeight: 1.3,
                            }}
                          >
                            {doc.text}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.colors.text.secondary,
                              mb: 2,
                              lineHeight: 1.5,
                            }}
                          >
                            {doc.description}
                          </Typography>

                          {/* Document Meta Info */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              pt: 2,
                              borderTop: `1px solid ${theme.colors.border.primary}`,
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: theme.colors.text.tertiary,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {doc.size}
                              </Typography>
                              <Box
                                sx={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  backgroundColor: theme.colors.text.tertiary,
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: theme.colors.text.tertiary,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {doc.lastUpdated}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: getPriorityColor(doc.priority),
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Enhanced Information Cards */}
        <Grid container spacing={4}>
          {/* Jokers Information */}
          <Grid item xs={12} md={6}>
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
                      <Star
                        sx={{
                          fontSize: 36,
                          color: theme.colors.accent[600],
                        }}
                      />
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

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: theme.borderRadius.xl,
                      backgroundColor: theme.colors.accent[50],
                      border: `2px solid ${theme.colors.accent[200]}`,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Schedule
                        sx={{
                          color: theme.colors.accent[600],
                          fontSize: 28,
                        }}
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

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
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
          </Grid>

          {/* Official Balls Section */}
          <Grid item xs={12} md={6}>
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
                        sx={{
                          fontSize: 36,
                          color: theme.colors.success[600],
                        }}
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

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: theme.borderRadius.xl,
                      backgroundColor: theme.colors.success[50],
                      border: `2px solid ${theme.colors.success[200]}`,
                      mb: 3,
                    }}
                  >
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
                          Cada equipa em casa deve ter{" "}
                          <strong>3 bolas oficiais</strong>
                        </Typography>
                      </Alert>
                    </Box>

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
                          borderRadius: theme.borderRadius.lg,
                          overflow: "hidden",
                          border: `2px solid ${theme.colors.success[200]}`,
                          transition: theme.transitions.normal,
                          backgroundColor: "white",
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
                            display: "block",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Footer Info */}
        <Fade in={true} timeout={2200}>
          <Box
            sx={{
              mt: 4,
              p: 3,
              textAlign: "center",
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.border.primary}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                mb: 1,
              }}
            >
              Última atualização: 29 de Setembro de 2025
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.tertiary,
              }}
            >
              Todos os documentos são propriedade da organização da liga
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
