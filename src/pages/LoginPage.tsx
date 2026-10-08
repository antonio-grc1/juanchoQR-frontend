import React from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleGoogleLoginMock = () => {
    // Para entornos locales antes de registrar el Client ID en Google Cloud Console,
    // o para disparar el flujo real
    alert('Para activar Google Login se requiere configurar el GOOGLE_CLIENT_ID en Google Cloud Console.');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              bgcolor: 'primary.50',
              color: 'primary.main',
              p: 2,
              borderRadius: '50%',
              mb: 2,
            }}
          >
            <LockPersonIcon sx={{ fontSize: 40 }} />
          </Box>

          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
            Iniciar Sesión
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Inicia sesión con tu cuenta de Google para acceder a tus entradas y comprar más rápido.
          </Typography>

          {/* Botón de Google */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLoginMock}
            sx={{
              py: 1.4,
              borderColor: '#e0e0e0',
              color: '#333',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#f8f9fa',
                borderColor: '#ccc',
              },
            }}
          >
            Continuar con Google
          </Button>

          <Divider sx={{ my: 4 }}>
            <Typography variant="caption" color="text.secondary">
              o
            </Typography>
          </Divider>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ¿Sos organizador o parte del staff?
            </Typography>
            <Button
              component={Link}
              to="/admin/login"
              variant="text"
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Acceso Administrador con contraseña →
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

