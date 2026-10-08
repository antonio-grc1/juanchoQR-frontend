import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { EventoCard } from '../components/EventoCard';
import { eventosApi } from '../services/api';
import type { Evento } from '../types';

export const EventosPage: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventosApi.getAll();
      setEventos(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los eventos. Verificá que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Hero Header */}
      <Box sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Próximos Eventos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Elegí tu evento, comprá tus entradas de forma segura y recibí tu QR en el acto.
        </Typography>
      </Box>

      {/* Alerta de Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchEventos}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Skeletons de carga */}
      {loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {[1, 2, 3].map((n) => (
            <Box key={n} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ p: 2 }}>
                <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                <Skeleton width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton width="100%" height={40} />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Listado de eventos */}
      {!loading && !error && eventos.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </Box>
      )}

      {/* Estado vacío */}
      {!loading && !error && eventos.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 4,
            border: '2px dashed #e0e0e0',
          }}
        >
          <EventAvailableIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            No hay eventos publicados por el momento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Vuelve a consultar más tarde para conocer las próximas novedades.
          </Typography>
        </Box>
      )}
    </Container>
  );
};
