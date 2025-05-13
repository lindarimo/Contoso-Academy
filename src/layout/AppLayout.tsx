// src/layout/AppLayout.tsx
import { ReactNode } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user?.role === "admin"
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Utenti", path: "/utenti" },
        { label: "Statistiche", path: "/statistiche" },
        { label: "Profilo", path: "/profilo" },
      ]
    : [
        { label: "Profilo", path: "/profilo" },
      ];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portale Formazione
          </Typography>
          {navItems.map((item) => (
            <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>
              {item.label}
            </Button>
          ))}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box p={3}>{children}</Box>
    </Box>
  );
};

export default AppLayout;
