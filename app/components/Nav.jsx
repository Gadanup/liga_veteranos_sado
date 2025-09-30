"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useMediaQuery, Modal, Backdrop, Fade } from "@mui/material";
import Button from "@mui/material/Button";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SportsRoundedIcon from "@mui/icons-material/SportsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import StadiumIcon from "@mui/icons-material/Stadium";
import GavelIcon from "@mui/icons-material/Gavel";
import DescriptionIcon from "@mui/icons-material/Description";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupsIcon from "@mui/icons-material/Groups";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#6B4BA1",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#6B4BA1",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Nav({ onDrawerToggle }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const router = useRouter();
  const { isAdmin, loading, user, logout } = useIsAdmin(false);

  const handleLogout = () => {
    logout();
    setModalOpen(false);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
    onDrawerToggle(!open);
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleMouseEnter = () => {
    setOpen(true);
    onDrawerToggle(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
    onDrawerToggle(false);
  };

  const handleListItemClick = (item) => {
    if (!open) {
      setOpen(true);
      onDrawerToggle(true);
    }
    setSelectedItem(item);
  };

  const shouldDisplayItem = (label) => {
    if (open) return true;
    return [
      "Classificação",
      "Taça",
      "Supertaça",
      "Galeria",
      "Info",
      "Histórico",
    ].includes(label);
  };

  const getListItemStyles = (item) => ({
    backgroundColor: selectedItem === item ? "#5A3E8C" : "inherit",
    color: selectedItem === item ? "#FFD700" : "white",
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          background:
            "linear-gradient(135deg, #6B4BA1 0%, #8B5FBF 50%, #6B4BA1 100%)",
          boxShadow: "0 4px 20px rgba(107, 75, 161, 0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Left: Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={isMobile ? handleModalToggle : handleDrawerToggle}
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s",
            }}
          >
            {isMobile ? (
              <MenuIcon />
            ) : open ? (
              <ChevronLeftIcon />
            ) : (
              <MenuIcon />
            )}
          </IconButton>

          {/* Center: Logo and Title */}
          <Box
            sx={{
              marginLeft: isMobile ? 0 : 20,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
              justifyContent: "center",
              maxWidth: isMobile ? "none" : "600px",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                padding: "6px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
            {!isMobile && (
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  fontSize: "1.1rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Liga Veteranos do Sado
              </Typography>
            )}
          </Box>

          {/* Right: Admin Section */}
          {!isMobile && !loading && (
            <Box display="flex" alignItems="center" gap={1.5}>
              {user && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pr: 1.5,
                    borderRight: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18, color: "#6B4BA1" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "10px",
                        display: "block",
                        lineHeight: 1,
                        mb: 0.3,
                      }}
                    >
                      Administrador
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 600,
                        lineHeight: 1,
                        maxWidth: "150px",
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
                  startIcon={<LoginIcon />}
                  onClick={() => router.push("/admin/login")}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    px: 2,
                    py: 0.75,
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.25)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.2s",
                  }}
                  size="small"
                >
                  Login
                </Button>
              ) : (
                <Button
                  startIcon={<LogoutIcon />}
                  onClick={logout}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    px: 2,
                    py: 0.75,
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    "&:hover": {
                      background: "rgba(239, 68, 68, 0.3)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    },
                    transition: "all 0.2s",
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

      {/* Drawer for larger screens */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open={open}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          {open && (
            <Typography
              variant="h6"
              sx={{
                padding: theme.spacing(1),
                color: "white",
                paddingBottom: "0px",
              }}
            >
              Liga
            </Typography>
          )}
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {shouldDisplayItem("Classificação") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Liga/Classification"
                  onClick={() => handleListItemClick("Classificação")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Classificação"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        selectedItem === "Classificação" ? "#FFD700" : "white",
                    }}
                  >
                    <LeaderboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Classificação"
                              ? "#FFD700"
                              : "white",
                        }}
                      >
                        Liga
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {open && (
              <>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    href="/Liga/Calendar"
                    onClick={() => handleListItemClick("Calendário")}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      flexDirection: open ? "row" : "column",
                      ...getListItemStyles("Calendário"),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          selectedItem === "Calendário" ? "#FFD700" : "white",
                      }}
                    >
                      <CalendarMonthRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: open ? "inherit" : "0.75rem",
                            textAlign: open ? "left" : "center",
                            color:
                              selectedItem === "Calendário"
                                ? "#FFD700"
                                : "white",
                          }}
                        >
                          Calendário
                        </Typography>
                      }
                      sx={{ opacity: open ? 1 : 1, color: "white" }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    href="/Liga/TopScorers"
                    onClick={() => handleListItemClick("Melhores marcadores")}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      flexDirection: open ? "row" : "column",
                      ...getListItemStyles("Melhores marcadores"),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          selectedItem === "Melhores marcadores"
                            ? "#FFD700"
                            : "white",
                      }}
                    >
                      <SportsSoccerRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: open ? "inherit" : "0.75rem",
                            textAlign: open ? "left" : "center",
                            color:
                              selectedItem === "Melhores marcadores"
                                ? "#FFD700"
                                : "white",
                          }}
                        >
                          Melhores marcadores
                        </Typography>
                      }
                      sx={{ opacity: open ? 1 : 1, color: "white" }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    href="/Liga/Discipline"
                    onClick={() => handleListItemClick("Disciplina")}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      flexDirection: open ? "row" : "column",
                      ...getListItemStyles("Disciplina"),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          selectedItem === "Disciplina" ? "#FFD700" : "white",
                      }}
                    >
                      <SportsRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: open ? "inherit" : "0.75rem",
                            textAlign: open ? "left" : "center",
                            color:
                              selectedItem === "Disciplina"
                                ? "#FFD700"
                                : "white",
                          }}
                        >
                          Disciplina
                        </Typography>
                      }
                      sx={{ opacity: open ? 1 : 1, color: "white" }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
          <Divider />
          {open && (
            <Typography
              variant="h6"
              sx={{
                padding: theme.spacing(1),
                color: "white",
                paddingBottom: "0px",
              }}
            >
              Taça
            </Typography>
          )}
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {shouldDisplayItem("Taça") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Taca/Draw"
                  onClick={() => handleListItemClick("Taça")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Taça"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: selectedItem === "Taça" ? "#FFD700" : "white",
                    }}
                  >
                    <EmojiEventsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color: selectedItem === "Taça" ? "#FFD700" : "white",
                        }}
                      >
                        Taça
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {/* {open && (
              <>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    component={Link}
                    href="/Taca/TopScorers"
                    onClick={() =>
                      handleListItemClick("Melhores marcadores Taça")
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      flexDirection: open ? "row" : "column",
                      ...getListItemStyles("Melhores marcadores Taça"),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          selectedItem === "Melhores marcadores Taça"
                            ? "#FFD700"
                            : "white",
                      }}
                    >
                      <SportsSoccerRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: open ? "inherit" : "0.75rem",
                            textAlign: open ? "left" : "center",
                            color:
                              selectedItem === "Melhores marcadores Taça"
                                ? "#FFD700"
                                : "white",
                          }}
                        >
                          Melhores marcadores
                        </Typography>
                      }
                      sx={{ opacity: open ? 1 : 1, color: "white" }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )} */}
          </List>
          <Divider />
          {open && (
            <Typography
              variant="h6"
              sx={{
                padding: theme.spacing(1),
                color: "white",
                paddingBottom: "0px",
              }}
            >
              Supertaça
            </Typography>
          )}
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {shouldDisplayItem("Supertaça") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Jogos/256"
                  onClick={() => handleListItemClick("Supertaça")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Supertaça"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: selectedItem === "Supertaça" ? "#FFD700" : "white",
                    }}
                  >
                    <StadiumIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Supertaça" ? "#FFD700" : "white",
                        }}
                      >
                        Supertaça
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          {open && (
            <Typography
              variant="h6"
              sx={{
                padding: theme.spacing(1),
                color: "white",
                paddingBottom: "0px",
              }}
            >
              Informações
            </Typography>
          )}
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {shouldDisplayItem("Info") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Informacao/Sorteio"
                  onClick={() => handleListItemClick("Info")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Info"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: selectedItem === "Info" ? "#FFD700" : "white",
                    }}
                  >
                    <GavelIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Informação" ? "#FFD700" : "white",
                        }}
                      >
                        {open ? "Sorteio" : "Info"}
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {shouldDisplayItem("Documentação") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Informacao/Documentacao"
                  onClick={() => handleListItemClick("Documentação")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Documentação"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        selectedItem === "Documentação" ? "#FFD700" : "white",
                    }}
                  >
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Documentação"
                              ? "#FFD700"
                              : "white",
                        }}
                      >
                        Documentação
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          {open && (
            <Typography
              variant="h6"
              sx={{
                padding: theme.spacing(1),
                color: "white",
                paddingBottom: "0px",
              }}
            >
              Galeria
            </Typography>
          )}
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {shouldDisplayItem("Galeria") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Galeria/Equipas"
                  onClick={() => handleListItemClick("Galeria")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Galeria"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: selectedItem === "Galeria" ? "#FFD700" : "white",
                    }}
                  >
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Galeria" ? "#FFD700" : "white",
                        }}
                      >
                        {open ? "Equipas" : "Galeria"}
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {/* {shouldDisplayItem("Convivio 23/24") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Galeria/Convivio2324"
                  onClick={() => handleListItemClick("Convivio 23/24")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Convivio 23/24"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        selectedItem === "Convivio 23/24" ? "#FFD700" : "white",
                    }}
                  >
                    <CollectionsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Convivio 23/24"
                              ? "#FFD700"
                              : "white",
                        }}
                      >
                        Convivio 23/24
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )} */}
          </List>
          <Divider />
          {open && (
            <Typography
              variant="h6"
              sx={{
                padding: theme.spacing(1),
                color: "white",
                paddingBottom: "0px",
              }}
            >
              Histórico
            </Typography>
          )}
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {shouldDisplayItem("Histórico") && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/historico"
                  onClick={() => handleListItemClick("Histórico")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                    ...getListItemStyles("Histórico"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: selectedItem === "Histórico" ? "#FFD700" : "white",
                    }}
                  >
                    <RestoreOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                          color:
                            selectedItem === "Histórico" ? "#FFD700" : "white",
                        }}
                      >
                        Histórico
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Drawer>
      )}

      {/* Full screen modal for mobile */}
      {isMobile && (
        <Modal
          open={modalOpen}
          onClose={handleModalToggle}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={modalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%", // Ensures modal fits in mobile
                maxHeight: "90%",
                backgroundColor: "#6B4BA1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: theme.spacing(2),
                overflowY: "auto", // Enable scrolling if content is too long
                borderRadius: "8px", // Adds some border rounding for a cleaner look
              }}
            >
              {/* Close button */}
              <IconButton
                onClick={handleModalToggle}
                sx={{ color: "white", alignSelf: "flex-end" }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <List sx={{ width: "100%" }}>
                {/* Liga Section */}
                <Typography variant="h6" align="center" sx={{ color: "white" }}>
                  Liga
                </Typography>
                <List sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Liga/Classification"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <LeaderboardIcon />
                      </ListItemIcon>
                      <ListItemText primary="Liga" sx={{ color: "white" }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Liga/Calendar"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <CalendarMonthRoundedIcon /> {/* Calendário Icon */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Calendário"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Liga/TopScorers"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <SportsSoccerRoundedIcon />{" "}
                        {/* Melhores Marcadores Icon */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Melhores Marcadores"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Liga/Discipline"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <SportsRoundedIcon /> {/* Disciplina Icon */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Disciplina"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider sx={{ backgroundColor: "white", my: 2 }} />

                {/* Taça Section */}
                <Typography variant="h6" align="center" sx={{ color: "white" }}>
                  Taça
                </Typography>
                <List sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Taca/Draw"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <EmojiEventsRoundedIcon /> {/* Taça Icon */}
                      </ListItemIcon>
                      <ListItemText primary="Taça" sx={{ color: "white" }} />
                    </ListItemButton>
                  </ListItem>
                  {/* <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Taca/TopScorers"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <SportsSoccerRoundedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Melhores Marcadores"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem> */}
                </List>
                <Divider sx={{ backgroundColor: "white", my: 2 }} />

                {/* Supertaça Section */}
                <Typography variant="h6" align="center" sx={{ color: "white" }}>
                  Supertaça
                </Typography>
                <List sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Jogos/233"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <StadiumIcon /> {/* Supertaça Icon */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Supertaça"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider sx={{ backgroundColor: "white", my: 2 }} />

                {/* Informações Section */}
                <Typography variant="h6" align="center" sx={{ color: "white" }}>
                  Informações
                </Typography>
                <List sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Informacao/Sorteio"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <GavelIcon /> {/* Sorteio Icon */}
                      </ListItemIcon>
                      <ListItemText primary="Sorteio" sx={{ color: "white" }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Informacao/Documentacao"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <DescriptionIcon /> {/* Documentação Icon */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Documentação"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider sx={{ backgroundColor: "white", my: 2 }} />

                {/* Galeria Section */}
                <Typography variant="h6" align="center" sx={{ color: "white" }}>
                  Galeria
                </Typography>
                <List sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Galeria/Equipas"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <GroupsIcon /> {/* Equipas Icon */}
                      </ListItemIcon>
                      <ListItemText primary="Equipas" sx={{ color: "white" }} />
                    </ListItemButton>
                  </ListItem>
                  {/* <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/Galeria/Convivio2324"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <CollectionsRoundedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Convívio 23/24"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem> */}
                </List>
                <Divider sx={{ backgroundColor: "white", my: 2 }} />

                {/* Histórico Section */}
                <Typography variant="h6" align="center" sx={{ color: "white" }}>
                  Histórico
                </Typography>
                <List sx={{ pl: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href="/historico"
                      onClick={handleModalToggle}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        <RestoreOutlinedIcon /> {/* Histórico Icon */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Histórico"
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider sx={{ backgroundColor: "white", my: 2 }} />

                  {/* Mobile Login/Logout Section */}
                  {!loading && (
                    <>
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{ color: "white", mt: 2 }}
                      >
                        Admin
                      </Typography>
                      <List sx={{}}>
                        {!isAdmin ? (
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => {
                                handleModalToggle();
                                router.push("/admin/login");
                              }}
                            >
                              <ListItemIcon sx={{ color: "white" }}>
                                <LoginIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Login Admin"
                                sx={{ color: "white" }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ) : (
                          <>
                            <ListItem sx={{ color: "white", py: 1 }}>
                              <ListItemIcon sx={{ color: "white" }}>
                                <PersonIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={user?.email}
                                secondary="Administrador"
                                secondaryTypographyProps={{
                                  sx: { color: "#FFD700" },
                                }}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton onClick={handleLogout}>
                                <ListItemIcon sx={{ color: "white" }}>
                                  <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Logout"
                                  sx={{ color: "white" }}
                                />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}
                      </List>
                    </>
                  )}
                </List>
              </List>
            </Box>
          </Fade>
        </Modal>
      )}
    </Box>
  );
}
