import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, useNavigate, NavLink } from "react-router-dom";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const goToProfile = () => {
    navigate("/profilo");
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/utenti", label: "Utenti" },
    { to: "/statistiche", label: "Statistiche" },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img
            src="../../logo.svg"
            alt="Logo Contoso Academy"
            width={60}
          />

          {isMobile ? (
            <>
              <IconButton onClick={toggleDrawer(true)} edge="start">
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                >
                  <List>
                    {user?.role === "admin" &&
                      adminLinks.map((link) => (
                        <ListItem
                          key={link.to}
                          component={NavLink}
                          to={link.to}
                          style={{ textDecoration: "none" }}
                        >
                          <ListItemText primary={link.label} />
                        </ListItem>
                      ))}
                    <ListItem component="button" onClick={goToProfile}>
                      <ListItemText primary="Profilo" />
                    </ListItem>
                    <ListItem component="button" onClick={logout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {user?.role === "admin" &&
                adminLinks.map((link) => (
                  <Typography
                    key={link.to}
                    component={NavLink}
                    to={link.to}
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                      fontWeight: 500,
                      "&.active": { color: "primary.main" },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}

              <IconButton onClick={goToProfile}>
                <Avatar alt={user?.email} src="/avatar-placeholder.png" />
              </IconButton>
              <Button variant="outlined" color="error" onClick={logout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 Contoso Academy
        </Typography>
      </Box>
    </Box>
  );
};


export default AppLayout;
