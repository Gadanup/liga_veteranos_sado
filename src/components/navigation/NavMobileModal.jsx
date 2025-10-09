import React from "react";
import Link from "next/link";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  IconButton,
  ListItemButton,
  Typography,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Close,
  Login,
  Logout,
  Person,
  ChevronRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { navigationSections } from "./navigationConfig";
import SocialLinks from "./SocialLinks";

const NavMobileModal = ({
  open,
  onClose,
  isAdmin,
  user,
  loading,
  onLogout,
  router,
}) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #6B4BA1 0%, #5A3E8C 100%)",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "rgba(90, 62, 140, 0.95)",
              backdropFilter: "blur(10px)",
              borderBottom: "2px solid rgba(255, 215, 0, 0.3)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    padding: "6px",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  Menu
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                    transform: "rotate(90deg)",
                  },
                  transition: "all 0.3s",
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, px: 2, py: 3 }}>
            {navigationSections.map((section, index) => (
              <Box key={section.key} mb={3}>
                {/* Section Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                    px: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      background:
                        "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)",
                      borderRadius: "2px",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#FFD700",
                      fontWeight: 700,
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>

                {/* Section Items */}
                <Box
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isLast = itemIndex === section.items.length - 1;

                    return (
                      <Box key={item.id}>
                        <ListItemButton
                          component={Link}
                          href={item.href}
                          onClick={onClose}
                          sx={{
                            py: 2,
                            px: 2.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                              background: "rgba(255, 215, 0, 0.15)",
                              transform: "translateX(4px)",
                            },
                            "&:active": {
                              background: "rgba(255, 215, 0, 0.25)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon sx={{ fontSize: 20, color: "#FFD700" }} />
                          </Box>
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              fontSize: "15px",
                              flex: 1,
                            }}
                          >
                            {item.label}
                          </Typography>
                          <ChevronRight
                            sx={{
                              fontSize: 20,
                              color: "rgba(255, 255, 255, 0.4)",
                            }}
                          />
                        </ListItemButton>
                        {!isLast && (
                          <Divider
                            sx={{
                              borderColor: "rgba(255, 255, 255, 0.08)",
                              mx: 2,
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}

            {/* Social Links Section - Mobile */}
            <Box mb={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  px: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    background:
                      "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)",
                    borderRadius: "2px",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#FFD700",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Redes Sociais
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <SocialLinks isMobile={true} variant="row" />
              </Box>
            </Box>
          </Box>

          {/* Footer - Admin Section */}
          {!loading && (
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 10,
                background: "rgba(90, 62, 140, 0.95)",
                backdropFilter: "blur(10px)",
                borderTop: "2px solid rgba(255, 215, 0, 0.3)",
                p: 2,
              }}
            >
              {!isAdmin ? (
                <Box
                  onClick={() => {
                    onClose();
                    router.push("/admin/login");
                  }}
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Login sx={{ fontSize: 22, color: "#6B4BA1" }} />
                  </Box>
                  <Box flex={1}>
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      Acesso Admin
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "12px",
                      }}
                    >
                      Fazer login como administrador
                    </Typography>
                  </Box>
                  <ChevronRight sx={{ color: "white", fontSize: 24 }} />
                </Box>
              ) : (
                <Box>
                  {/* Admin Info Card */}
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)",
                      border: "2px solid rgba(255, 215, 0, 0.3)",
                      borderRadius: "12px",
                      padding: "16px",
                      mb: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          background:
                            "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                        }}
                      >
                        <Person sx={{ fontSize: 24, color: "#6B4BA1" }} />
                      </Avatar>
                      <Box flex={1}>
                        <Chip
                          label="Administrador"
                          size="small"
                          sx={{
                            background: "#FFD700",
                            color: "#6B4BA1",
                            fontWeight: 700,
                            fontSize: "10px",
                            height: "20px",
                            mb: 0.5,
                          }}
                        />
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: "14px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Logout Button */}
                  <Box
                    onClick={onLogout}
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)",
                      border: "2px solid rgba(239, 68, 68, 0.4)",
                      borderRadius: "12px",
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        background: "rgba(239, 68, 68, 0.3)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(239, 68, 68, 0.4)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <Logout sx={{ fontSize: 20, color: "#ef4444" }} />
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      Terminar Sessão
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default NavMobileModal;
