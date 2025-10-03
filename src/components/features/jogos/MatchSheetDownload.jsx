import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { theme } from "../../../styles/theme.js";

/**
 * MatchSheetDownload Component
 * Handles PDF generation and download of match sheets
 *
 * @param {Object} matchDetails - Match information
 * @param {Array} currentHomePlayers - Home team players
 * @param {Array} currentAwayPlayers - Away team players
 * @param {Array} suspendedPlayerIds - Array of suspended player IDs
 */
const MatchSheetDownload = ({
  matchDetails,
  currentHomePlayers,
  currentAwayPlayers,
  suspendedPlayerIds,
}) => {
  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add logo
    const img = new Image();
    img.src = "/logo/logo.png";
    doc.addImage(img, "PNG", 10, 10, 20, 20);

    // Header
    doc.setFontSize(18);
    doc.setTextColor(107, 75, 161);
    doc.text("LIGA DE FUTEBOL VETERANOS DO SADO", 50, 15);
    doc.setFontSize(15);
    doc.text("2024/25", 95, 22);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const matchDateText = matchDetails
      ? dayjs(matchDetails.match_date).format("DD/MM/YYYY")
      : "Date TBD";

    const competitionType =
      matchDetails.competition_type === "League"
        ? "Campeonato"
        : matchDetails.competition_type === "Cup"
          ? "Taça"
          : matchDetails.competition_type === "Supercup"
            ? "Supertaça"
            : "";

    const competitionText =
      matchDetails.competition_type === "League"
        ? `Jornada ${matchDetails.week}`
        : matchDetails.competition_type === "Cup"
          ? `Ronda ${matchDetails.round}`
          : "";

    doc.text(`${competitionType}`, 30, 30);
    doc.text(`${matchDateText}`, 95, 30);
    doc.text(`${competitionText}`, 170, 30);

    doc.line(10, 32, 200, 32);

    // Teams
    doc.setFontSize(16);
    doc.text("A", 10, 40);
    doc.text(`${matchDetails.home_team.short_name}`, 30, 40);
    doc.text("VS", 100, 40);
    if (matchDetails.away_team.short_name === "Bairro Santos Nicolau") {
      doc.text(`${matchDetails.away_team.short_name}`, 137, 40);
    } else {
      doc.text(`${matchDetails.away_team.short_name}`, 140, 40);
    }
    doc.text("B", 195, 40);

    doc.line(10, 43, 200, 43);

    // Table headers
    doc.setFontSize(11);
    doc.text("Nº", 11, 50);
    doc.text("NOMES DOS ATLETAS", 20, 50);
    doc.text("GOLOS", 67, 50);
    doc.text("DISCIPLINA", 95, 50);
    doc.text("GOLOS", 124, 50);
    doc.text("NOMES DOS ATLETAS", 145, 50);
    doc.text("Nº", 192, 50);

    let rowStartY = 53;
    let rowHeight = 5;

    const sortedHomePlayers = [...currentHomePlayers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedAwayPlayers = [...currentAwayPlayers].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const lastPlayerY =
      rowStartY +
      Math.max(sortedHomePlayers.length, sortedAwayPlayers.length) * rowHeight;

    // Draw table grid
    const columnsX = [10, 19, 66, 87, 123, 144, 191, 200];
    columnsX.forEach((x) => {
      doc.line(x, 46, x, lastPlayerY + 2);
    });

    const disciplinaX = 105;
    doc.line(disciplinaX, 51, disciplinaX, lastPlayerY + 2);

    for (let y = 46; y <= lastPlayerY; y += rowHeight) {
      doc.line(10, y, 200, y);
    }

    // Add home players
    sortedHomePlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      doc.text(String(player.number || ""), 12, yPos);
      doc.text(playerName, 20, yPos + 2);

      if (suspendedPlayerIds.includes(player.id)) {
        doc.setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("CASTIGADO", 67, yPos + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
      }
    });

    // Add away players
    sortedAwayPlayers.forEach((player, index) => {
      let yPos = rowStartY + index * rowHeight;
      const playerName = player.joker ? player.name + " (JK)" : player.name;

      doc.text(String(player.number || ""), 195, yPos);
      doc.text(playerName, 145, yPos + 2);

      if (suspendedPlayerIds.includes(player.id)) {
        doc.setFontSize(9);
        doc.setTextColor(255, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("CASTIGADO", 124, yPos + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
      }
    });

    doc.line(10, lastPlayerY + 2, 200, lastPlayerY + 2);

    // Coaches and delegates section
    const yOffset =
      75 +
      Math.max(currentHomePlayers.length, currentAwayPlayers.length) * 4 +
      5;
    doc.line(10, yOffset - 2, 200, yOffset - 2);

    doc.setFontSize(10);
    doc.text("NOMES DOS TREINADORES E DELEGADOS", 10, yOffset + 3);
    doc.setFontSize(8);
    doc.text("TREINADOR -", 12, yOffset + 10);
    doc.text("DELEGADO -", 12, yOffset + 15);
    doc.text("TREINADOR -", 120, yOffset + 10);
    doc.text("DELEGADO -", 120, yOffset + 15);

    doc.line(10, yOffset + 7, 200, yOffset + 7);
    doc.line(10, yOffset + 12, 200, yOffset + 12);
    doc.line(10, yOffset + 17, 200, yOffset + 17);
    doc.line(10, yOffset + 7, 10, yOffset + 17);
    doc.line(118, yOffset + 7, 118, yOffset + 17);
    doc.line(100, yOffset + 7, 100, yOffset + 17);
    doc.line(82, yOffset + 7, 82, yOffset + 17);
    doc.line(200, yOffset + 7, 200, yOffset + 17);

    doc.line(10, yOffset + 20, 200, yOffset + 20);

    // Observations
    doc.rect(10, yOffset + 22, 190, 15);
    doc.text("OBSERVAÇÕES:", 15, yOffset + 27);

    doc.line(10, yOffset + 39, 200, yOffset + 39);

    // Goals section
    doc.setFontSize(10);
    doc.text("GOLOS -- Nº DO JOGADOR", 10, yOffset + 44);

    doc.text("A", 10, yOffset + 54);
    for (let i = 0; i < 23; i++) {
      doc.rect(16 + i * 8, yOffset + 49, 8, 8);
    }

    doc.text("B", 10, yOffset + 64);
    for (let i = 0; i < 23; i++) {
      doc.rect(16 + i * 8, yOffset + 59, 8, 8);
    }

    doc.line(10, yOffset + 69, 200, yOffset + 69);

    // Final result
    doc.text(`${matchDetails.home_team.short_name}`, 20, yOffset + 87);
    doc.circle(70, yOffset + 87, 8);
    doc.setFontSize(12);
    doc.text("RESULTADO FINAL", 86, yOffset + 91 - 16);
    doc.setFontSize(10);
    doc.text("VS", 100, yOffset + 87);
    doc.circle(140, yOffset + 86, 8);
    doc.text(`${matchDetails.away_team.short_name}`, 160, yOffset + 87);

    doc.line(10, yOffset + 99, 200, yOffset + 99);

    // Signatures
    doc.text("DELEGADO", 10, yOffset + 107);
    doc.line(10, yOffset + 114, 50, yOffset + 114);
    doc.text("ÁRBITRO", 85, yOffset + 107);
    doc.line(85, yOffset + 114, 125, yOffset + 114);
    doc.text("DELEGADO", 160, yOffset + 107);
    doc.line(160, yOffset + 114, 200, yOffset + 114);

    doc.save(
      `fichajogo_${matchDetails.home_team.short_name}_vs_${matchDetails.away_team.short_name}.pdf`
    );
  };

  return (
    <Card sx={{ mb: 4, borderRadius: "16px" }}>
      <CardContent>
        <Box textAlign="center" py={2}>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.primary[600],
              mb: 3,
              fontWeight: "bold",
            }}
          >
            Ficha de Jogo
          </Typography>

          <Box
            onClick={() => {
              if (
                matchDetails &&
                dayjs().isAfter(dayjs(matchDetails.match_date).add(1, "day"))
              ) {
                window.open(matchDetails.match_sheet, "_blank");
              } else {
                generatePDF();
              }
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              padding: "12px 24px",
              backgroundColor: theme.colors.primary[600],
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
              transition: theme.transitions.normal,
              "&:hover": {
                backgroundColor: theme.colors.primary[700],
                transform: "translateY(-2px)",
                boxShadow: theme.shadows.lg,
              },
            }}
          >
            <Download sx={{ fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {matchDetails &&
              dayjs().isAfter(dayjs(matchDetails.match_date).add(1, "day"))
                ? "Ficha de Jogo Completa"
                : "Ficha de Jogo"}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: theme.colors.text.secondary, mt: 2 }}
          >
            {matchDetails &&
            dayjs().isAfter(dayjs(matchDetails.match_date).add(1, "day"))
              ? "Aceda à ficha de jogo oficial preenchida"
              : "Descarregue a ficha de jogo em formato PDF"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchSheetDownload;
