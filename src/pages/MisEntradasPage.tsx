import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { QRCodeSVG } from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QRModal } from '../components/QRModal';
import type { Ticket } from '../types';

export const MisEntradasPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/mis-entradas');
      return;
    }

    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ticketsApi.getMisTickets();
        setTickets(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus entradas. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
          <ConfirmationNumberIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            Mis Entradas
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Tus códigos QR de acceso para los eventos que compraste. Mostralos directamente en la entrada.
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Skeletons de carga */}
      {loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {[1, 2].map((n) => (
            <Skeleton key={n} variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
          ))}
        </Box>
      )}

      {/* Listado de Tickets */}
      {!loading && !error && tickets.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {tickets.map((ticket) => {
            const evento = ticket.tipoEntrada.evento;
            const esActivo = ticket.estado === 'ACTIVO';
            const fechaFormateada = new Date(evento.fechaInicio).toLocaleDateString('es-AR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Card
                key={ticket.id}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  overflow: 'hidden',
                  border: '1px solid #eef2f6',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 5 },
                }}
              >
                {/* Imagen del Evento */}
                <CardMedia
                  component="img"
                  image={evento.imagenUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80'}
                  alt={evento.titulo}
                  sx={{
                    width: { xs: '100%', sm: 160 },
                    height: { xs: 160, sm: 'auto' },
                    objectFit: 'cover',
                  }}
                />

                <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Badges de Estado y Tipo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={ticket.estado}
                        color={esActivo ? 'success' : 'default'}
                        size="small"
                        icon={esActivo ? <CheckCircleIcon /> : <HighlightOffIcon />}
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip
                        label={ticket.tipoEntrada.nombre}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Título de Evento */}
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.25, mb: 1 }}>
                      {evento.titulo}
                    </Typography>

                    {/* Fechas y Lugar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                      <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {fechaFormateada}
                      </Typography>
                    </Box>

                    {evento.ubicacion && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <PlaceIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="caption">
                          {evento.ubicacion}
                        </Typography>
                      </Box>
                    )}
                  </div>

                  {/* Botón QR */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
                    <Box
                      onClick={() => setTicketSeleccionado(ticket)}
                      sx={{ cursor: 'pointer', p: 0.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                      title="Haz clic para agrandar el QR"
                    >
                      <QRCodeSVG value={ticket.tokenQr} size={48} level="M" />
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<QrCode2Icon />}
                      onClick={() => setTicketSeleccionado(ticket)}
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                      Ver QR
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Estado Vacío */}
      {!loading && !error && tickets.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 4,
            border: '2px dashed #e0e0e0',
          }}
        >
          <ConfirmationNumberIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
            Aún no tienes entradas compradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Tus compras y tickets confirmados aparecerán en esta sección.
          </Typography>
          <Button component={Link} to="/" variant="contained" sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
            Explorar Eventos Disponibles
          </Button>
        </Box>
      )}

      {/* Modal QR Detallado */}
      <QRModal
        open={!!ticketSeleccionado}
        onClose={() => setTicketSeleccionado(null)}
        ticket={ticketSeleccionado}
      />
    </Container>
  );
};
