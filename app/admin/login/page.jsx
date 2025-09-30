"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login,
  Shield,
  SportsSoccer,
} from "@mui/icons-material";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Sign in with email/password
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError("Email ou password incorretos");
      setLoading(false);
      return;
    }

    // Check if user is in admin whitelist
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .single();

    if (adminError || !adminData) {
      // User authenticated but not an admin - sign them out
      await supabase.auth.signOut();
      setError("Não tem permissões de administrador");
      setLoading(false);
      return;
    }

    // Success - redirect to calendar
    router.push("/Liga/Classification");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw", // Add this
        position: "fixed", // Change from relative to fixed
        top: 0, // Add this
        left: 0, // Add this
        display: "flex",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40%",
          height: "40%",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "35%",
          height: "35%",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          py: 4,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: isMobile ? 3 : 5,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          {/* Logo and Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                mb: 2,
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
              }}
            >
              <Shield sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Administração
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Liga Veteranos do Sado
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(102, 126, 234, 0.04)",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.08)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Login sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(102, 126, 234, 0.04)",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.08)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Shield sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Box
                sx={{
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  border: "1px solid rgba(211, 47, 47, 0.3)",
                  borderRadius: "12px",
                  padding: 2,
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    color: "error.main",
                    fontSize: "14px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                padding: "14px",
                fontSize: "16px",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {loading ? "A entrar..." : "Entrar"}
            </Button>
          </form>

          {/* Back to site link */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              onClick={() => router.push("/")}
              sx={{
                textTransform: "none",
                color: "#667eea",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                },
              }}
              startIcon={<SportsSoccer />}
            >
              Voltar ao site
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
