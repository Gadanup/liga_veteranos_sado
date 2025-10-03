import React from "react";
import { Modal, Backdrop, Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

/**
 * ImageModal Component
 * Full-screen modal to display enlarged team roster images
 *
 * @param {boolean} open - Whether the modal is open
 * @param {Function} onClose - Callback to close the modal
 * @param {string} imageUrl - URL of the image to display
 * @param {string} teamName - Name of the team for the header
 */
const ImageModal = ({ open, onClose, imageUrl, teamName }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
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
            {teamName}
          </Typography>
          <IconButton
            onClick={onClose}
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
            src={imageUrl}
            alt={`${teamName} roster`}
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
  );
};

export default ImageModal;
