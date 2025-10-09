import React from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Menu, ChevronLeft, Login, Logout, Person } from "@mui/icons-material";

const AppBar = styled(MuiAppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin", "background"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(["width", "margin", "background"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavAppBar = ({
  open,
  isMobile,
  isAdmin,
  user,
  loading,
  onMenuClick,
  onLogout,
  router,
}) => {
  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        background: open
          ? "rgba(90, 62, 140, 0.85)"
          : "linear-gradient(135deg, #6B4BA1 0%, #8B5FBF 50%, #6B4BA1 100%)",
        backdropFilter: open ? "blur(20px)" : "none",
        boxShadow: open
          ? "0 8px 32px rgba(107, 75, 161, 0.4)"
          : "0 4px 20px rgba(107, 75, 161, 0.3)",
        borderBottom: open ? "1px solid rgba(255, 215, 0, 0.2)" : "none",
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", py: 1.5, px: isMobile ? 2 : 3 }}
      >
        {/* Left: Menu Button */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                background: "rgba(255, 215, 0, 0.2)",
                borderColor: "#FFD700",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s",
            }}
          >
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>

          {/* Status indicator when drawer is open - Desktop only */}
          {open && !isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "6px 16px",
                background: "rgba(255, 215, 0, 0.15)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FFD700",
                  boxShadow: "0 0 10px #FFD700",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#FFD700",
                  fontWeight: 600,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Menu Expandido
              </Typography>
            </Box>
          )}
        </Box>

        {/* Center: Logo and Title */}
        {(isMobile || !open) && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 1 : 2,
            }}
          >
            <Box
              sx={{
                width: isMobile ? 40 : 52,
                height: isMobile ? 40 : 52,
                borderRadius: "14px",
                padding: isMobile ? "6px" : "8px",
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255, 215, 0, 0.3)",
                boxShadow: "0 8px 24px rgba(255, 215, 0, 0.2)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px) rotate(5deg)",
                  boxShadow: "0 12px 32px rgba(255, 215, 0, 0.3)",
                },
              }}
            >
              <img
                src="/logo/logo.png"
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  fontSize: isMobile ? "0.9rem" : "1.2rem",
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 10px rgba(255, 215, 0, 0.3)",
                }}
              >
                {isMobile ? "Veteranos do Sado" : "Liga Veteranos do Sado"}
              </Typography>
              {!isMobile && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 215, 0, 0.8)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Época 2025/2026
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Right: Admin Section - Desktop only */}
        {!isMobile && !loading && (
          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  padding: "10px 16px",
                  background:
                    "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "2px solid rgba(255, 215, 0, 0.3)",
                  boxShadow: "0 4px 16px rgba(255, 215, 0, 0.2)",
                  height: "48px",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      background: "#4ade80",
                      borderRadius: "50%",
                      border: "2px solid #5A3E8C",
                      boxShadow: "0 0 8px #4ade80",
                    },
                  }}
                >
                  <Person sx={{ fontSize: 20, color: "#6B4BA1" }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#FFD700",
                      fontSize: "9px",
                      display: "block",
                      lineHeight: 1,
                      mb: 0.3,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Administrador
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 600,
                      lineHeight: 1,
                      maxWidth: "180px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            )}
            {!isAdmin ? (
              <Button
                startIcon={<Login />}
                onClick={() => router.push("/admin/login")}
                sx={{
                  color: "white",
                  textTransform: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  height: "48px",
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%)",
                    borderColor: "#FFD700",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(255, 215, 0, 0.4)",
                  },
                  transition: "all 0.3s",
                }}
                size="small"
              >
                Login Admin
              </Button>
            ) : (
              <Button
                startIcon={<Logout />}
                onClick={onLogout}
                sx={{
                  color: "white",
                  textTransform: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  height: "48px",
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(239, 68, 68, 0.5)",
                  boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(239, 68, 68, 0.5)",
                  },
                  transition: "all 0.3s",
                }}
                size="small"
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavAppBar;
