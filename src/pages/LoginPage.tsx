import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";
import { Utente } from "../models/Utente";
import api from "../api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.get<Utente[]>(
        "/utenti",
        {
          params: { username, password },
        }
      );

      const utente = response.data[0];

      if (utente) {
        login({ email: utente.email, role: utente.role });
        navigate("/profilo");
      } else {
        alert("Credenziali errate");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Errore durante l’accesso");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      minHeight="100vh"
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          mt={8}
          alignItems="center"
        >
          <img
            src="../../logo.svg"
            alt="Logo Contoso Academy"
            className="logo-login"
          />
          <Typography variant="h5" component="h1" textAlign="center">
            Accedi a Contoso Academy
          </Typography>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
          >
            Accedi
          </Button>
        </Box>
      </Container>

      <Box
        component="footer"
        py={2}
        textAlign="center"
        width="100%"
        bgcolor="#f5f5f5"
      >
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Contoso Academy. Tutti i diritti
          riservati.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
