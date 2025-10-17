"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Fade,
  Collapse,
  Alert,
  AlertTitle,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

// Components
import DocumentationHeader from "../../../components/features/informacao/documentacao/DocumentationHeader";
import QuickActionsGrid from "../../../components/features/informacao/documentacao/QuickActionsGrid";
import DocumentsGrid from "../../../components/features/informacao/documentacao/DocumentsGrid";
import JokersInfoCard from "../../../components/features/informacao/documentacao/JokersInfoCard";
import BallsInfoCard from "../../../components/features/informacao/documentacao/BallsInfoCard";
import FooterInfo from "../../../components/features/informacao/documentacao/FooterInfo";

const documents = [
  // Old regulation kept for reference
  // {
  //   id: 1,
  //   text: "REGULAMENTO 2024/2025",
  //   link: "https://drive.google.com/file/d/1PntSOOChfXJMn2_Tdyp0mU8qcy_HhJMj/view?usp=sharing",
  //   icon: "Rule",
  //   color: theme.colors.primary[500],
  //   description: "Regulamento oficial da temporada",
  //   category: "Essencial",
  //   fileType: "PDF",
  //   size: "2.4 MB",
  //   lastUpdated: "15 Set 2024",
  //   priority: "high",
  // },
  {
    id: 1,
    text: "REGULAMENTO 2025/2026",
    link: "https://drive.google.com/file/d/1nT7aJWLuh34ArfHtohUx9qxuAjk934tk/view?usp=drive_link",
    icon: "Rule",
    color: theme.colors.primary[500],
    description: "Regulamento oficial da temporada",
    category: "Essencial",
    fileType: "PDF",
    size: "5.6 MB",
    lastUpdated: "17 Set 2025",
    priority: "high",
  },
  {
    id: 2,
    text: "RELATÓRIO DO ÁRBITRO",
    link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2FVQUlMd1lGV1FoQnFh&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21742&parId=101CD27EC6E1FDB3%21195&o=OneUp",
    icon: "Assignment",
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
    icon: "Description",
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
    icon: "Person",
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
    icon: "AccountBox",
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
    icon: "HelpOutline",
    color: theme.colors.error[500],
    description: "Guia de preenchimento",
    category: "Guia",
    fileType: "PDF",
    size: "1.2 MB",
    lastUpdated: "28 Ago 2024",
    priority: "medium",
  },
];

export default function Documentacao() {
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <DocumentationHeader documentsCount={documents.length} />

        {/* Footer Info */}
        <FooterInfo />

        {/* Quick Actions */}
        <QuickActionsGrid
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        />

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
              <p style={{ marginBottom: "8px" }}>
                • <strong>Jokers:</strong> Idade mínima 33 anos, máximo 2 por
                equipa
              </p>
              <p style={{ marginBottom: "8px" }}>
                • <strong>Bolas:</strong> 3 bolas oficiais Select obrigatórias
                para jogos em casa
              </p>
              <p>
                • <strong>Documentos:</strong> Fichas de jogo e relatórios
                obrigatórios
              </p>
            </Box>
          </Alert>
        </Collapse>

        {/* Documents Grid */}
        <DocumentsGrid documents={documents} />

        {/* Information Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <JokersInfoCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <BallsInfoCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
