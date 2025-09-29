"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Chip,
  CircularProgress,
  Modal,
  Backdrop,
  IconButton,
} from "@mui/material";
import { Groups, SportsSoccer, EmojiEvents, Close } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

export default function Equipas() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  // Function to fetch teams from the Supabase "teams" table
  const fetchTeams = async () => {
    setLoading(true);
    const { data: teamsData, error } = await supabase
      .from("teams")
      .select("id, short_name, logo_url, roster_url, excluded")
      .order("short_name", { ascending: true });

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      setTeams(teamsData.filter((team) => !team.excluded));
    }
    setLoading(false);
  };

  const handleImageClick = (imageUrl, teamName) => {
    setSelectedImage(imageUrl);
    setSelectedTeamName(teamName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setSelectedTeamName("");
  };

  // Use effect to fetch teams data on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  const LoadingSkeleton = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      flexDirection="column"
      gap={3}
      sx={{ backgroundColor: theme.colors.background.secondary }}
    >
      <SportsSoccer
        sx={{
          fontSize: 60,
          color: theme.colors.primary[600],
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
        A carregar equipas...
      </Typography>
    </Box>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: theme.spacing.lg,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            marginBottom: theme.spacing.xl,
            textAlign: "center",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mb={2}
          >
            <Groups
              sx={{
                fontSize: { xs: 40, md: 50 },
                color: theme.colors.primary[600],
              }}
            />
            <Typography
              sx={{
                fontSize: theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.primary[600],
                margin: 0,
                fontFamily: theme.typography.fontFamily.primary,
              }}
            >
              Equipas
            </Typography>
          </Box>

          <Box
            sx={{
              width: "60px",
              height: "4px",
              backgroundColor: theme.colors.accent[500],
              margin: "0 auto",
              borderRadius: theme.borderRadius.full,
              mb: 3,
            }}
          />

          <Chip
            icon={<EmojiEvents />}
            label={`${teams.length} Equipas Participantes`}
            sx={{
              backgroundColor: theme.colors.accent[500],
              color: theme.colors.neutral[900],
              fontWeight: "bold",
              fontSize: { xs: "14px", md: "16px" },
              py: 2,
            }}
          />
        </Box>

        {/* Teams Grid */}
        <Grid container spacing={3}>
          {teams.map((team, index) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={team.id}>
              <TeamCard
                team={team}
                index={index}
                onImageClick={handleImageClick}
              />
            </Grid>
          ))}
        </Grid>

        {/* Footer Stats */}
        <Box
          sx={{
            marginTop: theme.spacing.xl,
            textAlign: "center",
          }}
        >
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.colors.neutral[50]} 0%, ${theme.colors.primary[50]} 100%)`,
              border: `1px solid ${theme.colors.primary[200]}`,
              borderRadius: theme.borderRadius.xl,
              p: { xs: 3, md: 4 },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              flexDirection={{ xs: "column", md: "row" }}
            >
              <SportsSoccer
                sx={{
                  fontSize: 32,
                  color: theme.colors.primary[600],
                }}
              />
              <Box textAlign={{ xs: "center", md: "left" }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.colors.primary[600],
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  Liga de Futebol Veteranos do Sado
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.colors.text.secondary,
                    lineHeight: 1.6,
                  }}
                >
                  Temporada 2024/25 • {teams.length} equipas em competição
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Container>

      {/* Image Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
            maxWidth: "1200px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.xl,
            p: 0,
            outline: "none",
            overflow: "hidden",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              background: theme.colors.themed.purpleGradient,
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
              }}
            >
              {selectedTeamName}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Modal Image */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "60vh", sm: "70vh", md: "75vh" },
              overflow: "hidden",
            }}
          >
            <img
              src={selectedImage}
              alt={`${selectedTeamName} roster`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: theme.colors.background.secondary,
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

// TeamCard Component to display each team's logo, name, and roster image
function TeamCard({ team, index, onImageClick }) {
  return (
    <Card
      sx={{
        borderRadius: theme.borderRadius.xl,
        overflow: "hidden",
        transition: theme.transitions.normal,
        cursor: "pointer",
        border: `2px solid ${theme.colors.border.primary}`,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows.xl,
          borderColor: theme.colors.primary[300],
        },
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.6s ease-out forwards",
        opacity: 0,
        "@keyframes fadeInUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Team Header */}
      <CardContent
        sx={{
          background: theme.colors.themed.purpleGradient,
          color: "white",
          textAlign: "center",
          py: 2,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${theme.colors.accent[500]}20 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Team Logo */}
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 1.5,
              boxShadow: `0 4px 16px ${theme.colors.neutral[900]}30`,
              border: `2px solid ${theme.colors.accent[500]}`,
              overflow: "hidden",
            }}
          >
            <img
              src={team.logo_url}
              alt={`${team.short_name} logo`}
              style={{
                width: "35px",
                height: "35px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Team Name */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              fontSize: { xs: "0.9rem", md: "1rem" },
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: `0 2px 4px ${theme.colors.neutral[900]}50`,
            }}
          >
            {team.short_name}
          </Typography>
        </Box>
      </CardContent>

      {/* Team Roster Image */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() => onImageClick(team.roster_url, team.short_name)}
      >
        <CardMedia
          component="img"
          height="350"
          image={team.roster_url}
          alt={`${team.short_name} roster`}
          sx={{
            objectFit: "cover",
            transition: theme.transitions.slow,
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        />

        {/* Overlay gradient */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: `linear-gradient(transparent, ${theme.colors.neutral[900]}60)`,
            pointerEvents: "none",
          }}
        />

        {/* Click indicator */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: theme.transitions.normal,
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            👁️
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
