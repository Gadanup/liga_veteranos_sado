import React, { useState } from "react";
import { Card, CardContent, Box, Typography, Grid, Fade } from "@mui/material";
import { Download } from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

// Sub-component
import DocumentCard from "./DocumentCard";

/**
 * DocumentsGrid Component
 * Displays a grid of all available documents
 *
 * @param {Array} documents - Array of document objects
 */
const DocumentsGrid = ({ documents }) => {
  const [hoveredDocument, setHoveredDocument] = useState(null);

  return (
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
          {/* Section Header */}
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
                sx={{ fontSize: 32, color: theme.colors.primary[600] }}
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

          {/* Documents Grid */}
          <Grid container spacing={3}>
            {documents.map((doc, index) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Fade in={true} timeout={1400 + index * 100}>
                  <div>
                    <DocumentCard
                      doc={doc}
                      hoveredDocument={hoveredDocument}
                      setHoveredDocument={setHoveredDocument}
                    />
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default DocumentsGrid;
