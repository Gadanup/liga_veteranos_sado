"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { useIsAdmin } from "../../hooks/admin/useIsAdmin";
import NavAppBar from "./NavAppBar";
import NavDrawer from "./NavDrawer";
import NavMobileModal from "./NavMobileModal";

export default function Nav({ onDrawerToggle }) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { isAdmin, loading, user, logout } = useIsAdmin(false);

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

  const handleLogout = () => {
    logout();
    setModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <NavAppBar
        open={open}
        isMobile={isMobile}
        isAdmin={isAdmin}
        user={user}
        loading={loading}
        onMenuClick={isMobile ? handleModalToggle : handleDrawerToggle}
        onLogout={logout}
        router={router}
      />

      {!isMobile ? (
        <NavDrawer
          open={open}
          selectedItem={selectedItem}
          onToggle={handleDrawerToggle}
          onItemClick={handleListItemClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ) : (
        <NavMobileModal
          open={modalOpen}
          onClose={handleModalToggle}
          isAdmin={isAdmin}
          user={user}
          loading={loading}
          onLogout={handleLogout}
          router={router}
        />
      )}
    </Box>
  );
}
