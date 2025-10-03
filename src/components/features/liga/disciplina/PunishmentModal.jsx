import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  Close,
  Gavel,
  DateRange,
  Info,
  Person,
  Shield,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * PunishmentModal Component
 * Displays detailed punishment events for a team
 *
 * @param {boolean} open - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {Object} currentTeam - Currently selected team
 * @param {Array} punishmentEvents - Array of punishment events
 * @param {boolean} isMobile - Whether viewing on mobile
 */
const PunishmentModal = ({
  open,
  onClose,
  currentTeam,
  punishmentEvents,
  isMobile,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "95%" : "90%",
          maxWidth: 1000,
          maxHeight: "90vh",
          backgroundColor: theme.colors.background.card,
          borderRadius: "20px",
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            padding: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Gavel sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Detalhes Disciplinares
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {currentTeam?.teams.short_name}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box
          sx={{
            padding: 3,
            maxHeight: "calc(90vh - 120px)",
            overflow: "auto",
          }}
        >
          {punishmentEvents.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.colors.primary[50] }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: theme.colors.primary[600],
                      }}
                    >
                      <DateRange sx={{ verticalAlign: "middle", mr: 1 }} />
                      Data
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: theme.colors.primary[600],
                      }}
                    >
                      <Gavel sx={{ verticalAlign: "middle", mr: 1 }} />
                      Tipo
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: theme.colors.primary[600],
                      }}
                    >
                      <Info sx={{ verticalAlign: "middle", mr: 1 }} />
                      Descrição
                    </TableCell>
                    {!isMobile && (
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.primary[600],
                        }}
                      >
                        <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                        Jogador
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: theme.colors.primary[600],
                      }}
                      align="center"
                    >
                      Qtd
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {punishmentEvents.map((event) => (
                    <TableRow
                      key={event.team_punishment_id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: theme.colors.background.secondary,
                        },
                        "&:hover": {
                          backgroundColor: theme.colors.primary[50],
                        },
                      }}
                    >
                      <TableCell>
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString(
                              "pt-PT"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.punishment_type?.description || "-"}
                          size="small"
                          sx={{
                            backgroundColor: theme.colors.sports.draw,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: isMobile ? 150 : 300 }}>
                        {event.description || "-"}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>{event.player?.name || "-"}</TableCell>
                      )}
                      <TableCell align="center">
                        <Chip
                          label={event.quantity ?? "-"}
                          size="small"
                          sx={{
                            backgroundColor: theme.colors.primary[600],
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={6}>
              <Shield
                sx={{ fontSize: 60, color: theme.colors.neutral[400], mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ color: theme.colors.text.secondary }}
              >
                Nenhum evento disciplinar registado
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.tertiary, mt: 1 }}
              >
                Esta equipa não possui castigos registados
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PunishmentModal;
