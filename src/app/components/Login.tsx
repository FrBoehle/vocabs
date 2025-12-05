import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  ThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import { messages } from "../resources/messages.res";

interface LoginProps {
  onLogin: () => void;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      onLogin();
    } else {
      setError(messages.wrongPW);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ background: (theme) => theme.palette.background.default }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            minWidth: 320,
            background: (theme) => theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: { xs: 22, sm: 28, md: 32 },
              mb: 1,
              mt: 1,
              textShadow: "0 2px 8px rgba(78,0,224,0.18)",
              userSelect: "none",
            }}
          >
            Learning Assyrian
          </Typography>
          <Typography
            variant="subtitle1"
            align="right"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 500,
              letterSpacing: 1,
              fontSize: { xs: 13, sm: 15, md: 17 },
              mb: 2,
              mr: 1,
              textShadow: "0 1px 6px rgba(78,0,224,0.10)",
              userSelect: "none",
              display: "block",
            }}
          >
            by Franz Böhle
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              type="password"
              label="Passwort"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              autoFocus
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.2,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)",
                color: "#fff",
                boxShadow: "0 4px 20px 0 rgba(74,0,224,0.25)",
                letterSpacing: 1,
                fontSize: 18,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #4a00e0 0%, #8e2de2 100%)",
                  boxShadow: "0 6px 24px 0 rgba(74,0,224,0.35)",
                },
                borderRadius: 3,
                mt: 1,
              }}
            >
              Login
            </Button>
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
