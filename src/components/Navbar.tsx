import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { usuario, isAuthenticated, isAdmin, isValidador, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              gap: 1,
            }}
          >
            <QrCode2Icon sx={{ fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Juancho<span style={{ color: '#1976d2' }}>QR</span>
            </Typography>
          </Box>

          {/* Links y Acciones */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 600 }}>
              Eventos
            </Button>

            {isAuthenticated && (
              <Button
                component={Link}
                to="/mis-entradas"
                color="inherit"
                startIcon={<ConfirmationNumberIcon />}
                sx={{ fontWeight: 600 }}
              >
                Mis Entradas
              </Button>
            )}

            {isValidador && (
              <Button
                component={Link}
                to="/escanear"
                color="secondary"
                variant="outlined"
                startIcon={<QrCodeScannerIcon />}
                size="small"
                sx={{ fontWeight: 600 }}
              >
                Escanear
              </Button>
            )}

            {isAdmin && (
              <Button
                component={Link}
                to="/admin"
                color="primary"
                variant="outlined"
                startIcon={<AdminPanelSettingsIcon />}
                size="small"
                sx={{ fontWeight: 600 }}
              >
                Admin
              </Button>
            )}

            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <Chip
                  label={usuario?.nombre}
                  color={isAdmin ? 'primary' : 'default'}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <IconButton onClick={handleLogout} title="Cerrar sesión" size="small" color="error">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                <Button
                  component={Link}
                  to="/admin/login"
                  variant="text"
                  size="small"
                  sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                >
                  Admin
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600, textTransform: 'none', px: 2 }}
                >
                  Ingresar
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

