import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useSearchParams } from 'react-router-dom';

interface PagoResultadoPageProps {
  tipo: 'exitoso' | 'fallido' | 'pendiente';
}

export const PagoResultadoPage: React.FC<PagoResultadoPageProps> = ({ tipo }) => {
  const [searchParams] = useSearchParams();
  const ordenId = searchParams.get('orden_id') || searchParams.get('external_reference') || '';

  const config = {
    exitoso: {
      bgColor: '#e8f5e9',
      icon: <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main' }} />,
      titulo: '¡Pago Realizado con Éxito!',
      descripcion:
        'Tu compra fue procesada correctamente. Ya generamos tus códigos QR únicos de acceso.',
      botonPrincipal: {
        texto: 'Ver Mis Entradas con QR',
        link: '/mis-entradas',
        icon: <ConfirmationNumberIcon />,
      },
    },
    fallido: {
      bgColor: '#ffebee',
      icon: <HighlightOffIcon sx={{ fontSize: 72, color: 'error.main' }} />,
      titulo: 'El pago no pudo procesarse',
      descripcion:
        'La transacción fue rechazada o cancelada. No se realizó ningún cobro en tu cuenta y el stock reservado fue liberado.',
      botonPrincipal: {
        texto: 'Volver a intentar',
        link: '/',
        icon: <ArrowBackIcon />,
      },
    },
    pendiente: {
      bgColor: '#fffde7',
      icon: <AccessTimeIcon sx={{ fontSize: 72, color: 'warning.main' }} />,
      titulo: 'Pago Pendiente de Acreditación',
      descripcion:
        'Tu pago se encuentra en proceso de validación. Apenas se confirme, tus entradas estarán disponibles en tu cuenta.',
      botonPrincipal: {
        texto: 'Ir a Mis Entradas',
        link: '/mis-entradas',
        icon: <ConfirmationNumberIcon />,
      },
    },
  }[tipo];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, textAlign: 'center' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: config.bgColor,
              mb: 2.5,
            }}
          >
            {config.icon}
          </Box>

          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1.5 }}>
            {config.titulo}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, px: 2 }}>
            {config.descripcion}
          </Typography>

          {ordenId && (
            <Box sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 2, mb: 4, display: 'inline-block' }}>
              <Typography variant="caption" color="text.secondary">
                Referencia de orden: <strong>{ordenId}</strong>
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              justifyContent: 'center',
            }}
          >
            <Button
              component={Link}
              to={config.botonPrincipal.link}
              variant="contained"
              size="large"
              startIcon={config.botonPrincipal.icon}
              sx={{ borderRadius: 2, py: 1.2, px: 3, fontWeight: 700, textTransform: 'none' }}
            >
              {config.botonPrincipal.texto}
            </Button>

            <Button
              component={Link}
              to="/"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, py: 1.2, px: 3, fontWeight: 600, textTransform: 'none' }}
            >
              Volver a Eventos
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
