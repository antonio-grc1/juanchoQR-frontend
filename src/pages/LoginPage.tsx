import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirigir a la página de origen o al inicio si ya está autenticado
  const from = (location.state as { from?: string })?.from || '/';

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError('No se recibió el token de Google. Intentá de nuevo.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Error al iniciar sesión con Google.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('El inicio de sesión con Google fue cancelado o falló. Intentá de nuevo.');
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

          {/* Mensaje de error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          {/* Botón real de Google */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {loading ? (
              <CircularProgress size={36} />
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                size="large"
                useOneTap={false}
                auto_select={false}
              />
            )}
          </Box>

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
